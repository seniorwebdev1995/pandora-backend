import { InjectModel } from '@nestjs/mongoose';
import DataLoader from 'dataloader';
import { keyBy } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { BadInputError } from '../helpers/errors/BadInputError';
import { assertAllExisting } from '../helpers/get-or-create-dataloader';
import { AppLogger } from '../logging/logging.service';
import { MongoPagination, paginateQuery } from '../pagination/pagination';
import { AdminId } from '../user/model/admin.model';
import { Category, CategoryId } from './category.model';

export class CategoryService {
  constructor(
    private logger: AppLogger,
    @InjectModel(Category.name) private model: Model<Category>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async create(name: string, imageUrl: string): Promise<Category> {
    return (await this.model.create({ name, imageUrl })).toObject();
  }

  async getMany(
    filter?: CategoryFilter,
    pagination?: MongoPagination<Category>,
  ): Promise<Category[]> {
    this.logger.verbose('getMany');
    const mongoFilter = filterToMongoFilter(filter || {});
    const query = this.model.find(mongoFilter);
    const docs = await paginateQuery<Category>(query, pagination).lean().exec();
    return docs;
  }

  async exists(categoriesIds: CategoryId[]): Promise<boolean> {
    const result = await this.model.count({ _id: { $in: categoriesIds } });
    return result === categoriesIds.length;
  }

  async softDelete(categoryId: CategoryId, adminId: AdminId): Promise<void> {
    this.logger.verbose('softDelete');
    const deletion: AdminAction = { date: new Date(), adminId };
    await this.model.updateOne({ _id: categoryId }, { $set: { deleted: deletion } });
  }

  createDataloaderById(): DataLoader<CategoryId, Category> {
    return new DataLoader<CategoryId, Category>(async (categoriesIds: CategoryId[]) => {
      const categories = await this.getMany({ ids: categoriesIds });
      const categoriesById = keyBy(categories, (g) => g._id);
      return assertAllExisting(
        Category.name,
        categoriesIds,
        categoriesIds.map((categoryId) => categoriesById[categoryId]),
      );
    });
  }

  async validateIdsExist(categoriesIds: CategoryId[]): Promise<CategoryId[]> {
    const categories = await this.getMany({ ids: categoriesIds });
    const categoryPerId = keyBy(categories, (g) => g._id);
    const missing = categoriesIds.filter((id) => !categoryPerId[id]);
    if (missing.length > 0) {
      throw new BadInputError(
        `Category with id ${missing.map((id) => `"${id}"`).join(', ')} does not exist`,
      );
    }
    return categoriesIds;
  }
}

export interface CategoryFilter {
  ids?: CategoryId[];
}

const filterToMongoFilter = (filter: CategoryFilter): FilterQuery<Category> => {
  const { ids } = filter;
  const query: FilterQuery<Category> = {};
  if (ids) {
    query._id = { $in: ids };
  }
  return query;
};
