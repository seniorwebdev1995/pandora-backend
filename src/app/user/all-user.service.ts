import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CredentialInput } from '../auth/dto/credential.input';
import { Role } from '../auth/types';
import { hash } from '../helpers/strings.tools';
import { AppLogger } from '../logging/logging.service';
import { Admin } from './model/admin.model';
import { CommonUser } from './model/common-user.model';
import { User, UserId } from './model/user.model';

@Injectable()
export class AllUserService {
  constructor(
    private logger: AppLogger,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async authenticate(input: CredentialInput, role: Role.User): Promise<User | null>;
  async authenticate(input: CredentialInput, role: Role.Admin): Promise<Admin | null>;
  async authenticate(input: CredentialInput, role: Role): Promise<User | Admin | null>;
  async authenticate(input: CredentialInput, role: Role): Promise<User | Admin | null> {
    const query: FilterQuery<CommonUser> = {
      email: input.email,
      password: hash(input.password),
      deleted: { $exists: false },
    };
    switch (role) {
      default:
      case Role.User:
        return await this.userModel
          .findOneAndUpdate(query, { $set: { lastLoginDate: new Date() } }, { new: true })
          .exec();
      case Role.Admin:
        return await this.adminModel
          .findOneAndUpdate(query, { $set: { lastLoginDate: new Date() } }, { new: true })
          .exec();
    }
  }

  async getById(id: UserId, role: Role.User): Promise<User | null>;
  async getById(id: UserId, role: Role.Admin): Promise<Admin | null>;
  async getById(id: UserId, role: Role): Promise<User | Admin | null>;
  async getById(id: UserId, role: Role): Promise<User | Admin | null> {
    switch (role) {
      default:
      case Role.User:
        return await this.userModel.findById(id).exec();
      case Role.Admin:
        return await this.adminModel.findById(id).exec();
    }
  }

  async getByIds(ids: UserId[], role: Role.User): Promise<User[]>;
  async getByIds(ids: UserId[], role: Role.Admin): Promise<Admin[]>;
  async getByIds(ids: UserId[], role: Role): Promise<User[] | Admin[] | null>;
  async getByIds(ids: UserId[], role: Role): Promise<User[] | Admin[] | null> {
    switch (role) {
      default:
      case Role.User:
        return await this.userModel.find({ _id: { $in: ids } }).exec();
      case Role.Admin:
        return await this.adminModel.find({ _id: { $in: ids } }).exec();
    }
  }

  async getByIdOrThrow(id: UserId, role: Role.User): Promise<User>;
  async getByIdOrThrow(id: UserId, role: Role.Admin): Promise<Admin>;
  async getByIdOrThrow(id: UserId, role: Role): Promise<User | Admin>;
  async getByIdOrThrow(id: UserId, role: Role): Promise<User | Admin> {
    const userDoc = await this.getById(id, role);
    if (!userDoc) {
      throw Error(`User not found with id = ${id}`);
    }
    return userDoc;
  }

  async getByIdAndRefreshTokenHash(
    id: UserId,
    role: Role,
    refreshJwtHash: string,
  ): Promise<User | Admin | null> {
    switch (role) {
      default:
      case Role.User:
        return await this.userModel.findOne({ _id: id, refreshJwtHash }).exec();
      case Role.Admin:
        return await this.adminModel.findOne({ _id: id, refreshJwtHash }).exec();
    }
  }

  async updateRefreshTokenHash(id: UserId, role: Role.User, hash: string): Promise<void>;
  async updateRefreshTokenHash(id: UserId, role: Role.Admin, hash: string): Promise<void>;
  async updateRefreshTokenHash(id: UserId, role: Role, hash: string): Promise<void>;
  async updateRefreshTokenHash(id: UserId, role: Role, hash: string): Promise<void> {
    switch (role) {
      default:
      case Role.User:
        await this.userModel.updateOne({ _id: id }, { $set: { refreshJwtHash: hash } }).exec();
      case Role.Admin:
        await this.adminModel.updateOne({ _id: id }, { $set: { refreshJwtHash: hash } }).exec();
    }
  }
}
