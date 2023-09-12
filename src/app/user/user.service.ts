import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ForbiddenError } from 'apollo-server-express';
import DataLoader from 'dataloader';
import { isBoolean, keyBy } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { v4 } from 'uuid';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { excludeIfSoftDeleted, SoftDeleteOptions } from '../helpers/admin-action/deletion.helper';
import { assertAllExisting } from '../helpers/get-or-create-dataloader';
import { createAlphanumericId } from '../helpers/helper';
import { hash } from '../helpers/strings.tools';
import { AppLogger } from '../logging/logging.service';
import { MongoPagination, paginateQuery } from '../pagination/pagination';
import { CommonCreateUserInputDto } from './dto/common-create-user-input.dto';
import { UpdateUserInputDto } from './dto/update-user-input.dto';
import { UserOutputDto } from './dto/user-output.dto';
import { AdminId } from './model/admin.model';
import { User, UserId } from './model/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: AppLogger,
    @InjectModel(User.name) private readonly model: Model<User>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getById(id: UserId, options: SoftDeleteOptions = {}): Promise<User | null> {
    return await this.model
      .findOne({ _id: id, ...excludeIfSoftDeleted(options) })
      .lean()
      .exec();
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ email }).lean().exec();
  }

  static createUserId(): UserId {
    return v4();
  }

  async getMany(filter?: UserFilter, pagination?: MongoPagination<User>): Promise<User[]> {
    this.logger.verbose('getMany');
    const mongoFilter = filterToMongoFilter(filter || {});
    const query = this.model.find(mongoFilter);
    const docs = await paginateQuery<User>(query, pagination).lean().exec();
    return docs;
  }

  async count(filter?: UserFilter): Promise<number> {
    this.logger.verbose('count');
    return await this.model.count(filterToMongoFilter(filter || {})).exec();
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const exists = await this.model.exists({ email });
    return exists ? !!exists._id : false;
  }

  async create({ ...form }: CommonCreateUserInputDto): Promise<User> {
    const createdUser = await this.model.create({
      ...form,
      referralCode: createAlphanumericId(10),
      password: hash(form.password),
    });
    return createdUser.toObject();
  }

  async createWithDetail(email: string, pwd: string, userId: string): Promise<User> {
    const createdUser = await this.model.create({
      _id: userId,
      email,
      referralCode: createAlphanumericId(10),
      password: hash(pwd),
    });
    return createdUser.toObject();
  }

  async updateUser(
    userId: UserId,
    { newPassword, currentPassword, ...form }: UpdateUserInputDto,
    options: SoftDeleteOptions = {},
  ): Promise<UserOutputDto | null> {
    const passwordIsProvided = Boolean(currentPassword);
    if (passwordIsProvided) {
      const userCount = await this.model
        .count({ _id: userId, password: hash(currentPassword!), ...excludeIfSoftDeleted(options) })
        .exec();
      if (userCount !== 1) {
        throw new ForbiddenError('Incorrect password');
      }
    }
    if (newPassword && !passwordIsProvided) {
      throw new ForbiddenError('The current password is required to change it');
    }
    const result = await this.model.findOneAndUpdate(
      { _id: userId, ...excludeIfSoftDeleted(options) },
      {
        $set: {
          ...form,
          ...(newPassword ? { password: hash(newPassword) } : {}),
        },
      },
      { new: true },
    );
    return result;
  }

  async softDelete(userId: UserId, adminId: AdminId): Promise<void> {
    this.logger.verbose('softDelete');
    const deletion: AdminAction = { date: new Date(), adminId };
    await this.model.updateOne({ _id: userId }, { $set: { deleted: deletion } });
  }

  createDataloaderById(): DataLoader<UserId, User> {
    return new DataLoader<UserId, User>(async (userIds: UserId[]) => {
      const users = await this.getMany({ ids: userIds });
      const usersById = keyBy(users, (g) => g._id);
      return assertAllExisting(
        User.name,
        userIds,
        userIds.map((userId) => usersById[userId]),
      );
    });
  }

  private createUserId(): UserId {
    return v4();
  }
}

export interface UserFilter {
  ids?: UserId[];
  email?: string;
  createdMinDate?: Date;
  createdMaxDate?: Date;
  deleted?: boolean;
}

const filterToMongoFilter = (filter: UserFilter): FilterQuery<User> => {
  const { ids, email, createdMinDate, createdMaxDate, deleted } = filter;
  const query: FilterQuery<User> = {};
  if (ids) {
    query._id = { $in: ids };
  }
  if (email) {
    query.email = { $regex: email, $options: 'i' };
  }
  if (createdMinDate || createdMaxDate) {
    query.createdAt = {
      ...(createdMinDate ? { $gte: createdMinDate } : {}),
      ...(createdMaxDate ? { $lte: createdMaxDate } : {}),
    };
  }
  if (isBoolean(deleted)) {
    query.deleted = { $exists: deleted };
  }
  return query;
};
