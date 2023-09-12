import { InjectModel } from '@nestjs/mongoose';
import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { CategoryId } from '../category/category.model';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { BadInputError } from '../helpers/errors/BadInputError';
import { assertAllExisting } from '../helpers/get-or-create-dataloader';
import { AppLogger } from '../logging/logging.service';
import { MongoPagination, paginateQuery } from '../pagination/pagination';
import { AdminId } from '../user/model/admin.model';
import { DealType } from './deal-type';
import { Deal, DealId } from './deal.model';
import { CreateDealInputDto } from './dto/create-deal-input.dto';

export class DealService {
  constructor(private logger: AppLogger, @InjectModel(Deal.name) private model: Model<Deal>) {
    this.logger.setContext(this.constructor.name);
  }

  async getById(id: DealId): Promise<Deal | null> {
    return await this.model.findOne({ _id: id }).lean().exec();
  }

  async getByIdOrThrow(id: DealId): Promise<Deal> {
    const doc = await this.getById(id);
    if (!doc) {
      throw Error(`DealId not found with id ${id}`);
    }
    return doc;
  }

  async create(form: CreateDealInputDto, type: DealType): Promise<Deal> {
    return (await this.model.create({ ...form, type })).toObject();
  }

  async getMany(filter?: DealFilter, pagination?: MongoPagination<Deal>): Promise<Deal[]> {
    this.logger.verbose('getMany');
    const mongoFilter = filterToMongoFilter(filter || {});
    const query = this.model.find(mongoFilter);
    const docs = await paginateQuery<Deal>(query, pagination).lean().exec();
    return docs;
  }

  async exists(dealIds: DealId[]): Promise<boolean> {
    const result = await this.model.count({ _id: { $in: dealIds } });
    return result === dealIds.length;
  }

  async softDelete(dealId: DealId, adminId: AdminId): Promise<void> {
    this.logger.verbose('softDelete');
    const deletion: AdminAction = { date: new Date(), adminId };
    await this.model.updateOne({ _id: dealId }, { $set: { deleted: deletion } });
  }

  createDataloaderById(): DataLoader<DealId, Deal> {
    return new DataLoader<DealId, Deal>(async (dealIds: DealId[]) => {
      const deals = await this.getMany({ ids: dealIds });
      const dealsById = keyBy(deals, (g) => g._id);
      return assertAllExisting(
        Deal.name,
        dealIds,
        dealIds.map((dealId) => dealsById[dealId]),
      );
    });
  }

  async increaseRedeemAmunt(dealId: DealId): Promise<void> {
    await this.model.findOneAndUpdate({ _id: dealId }, { $inc: { redeemedAmount: 1 } }).exec();
  }

  async validateIdsExist(dealIds: DealId[]): Promise<DealId[]> {
    const deals = await this.getMany({ ids: dealIds });
    const dealPerId = keyBy(deals, (g) => g._id);
    const missing = dealIds.filter((id) => !dealPerId[id]);
    if (missing.length > 0) {
      throw new BadInputError(
        `Deal with id ${missing.map((id) => `"${id}"`).join(', ')} does not exist`,
      );
    }
    return dealIds;
  }
}

export interface DealFilter {
  ids?: DealId[];
  categoriesIds?: CategoryId[];
}

const filterToMongoFilter = (filter: DealFilter): FilterQuery<Deal> => {
  const { ids, categoriesIds } = filter;
  const query: FilterQuery<Deal> = {};
  if (ids) {
    query._id = { $in: ids };
  }
  if (categoriesIds) {
    query.categoriesIds = { $in: categoriesIds };
  }
  return query;
};
