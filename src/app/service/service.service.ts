import { InjectModel } from '@nestjs/mongoose';
import DataLoader from 'dataloader';
import { isBoolean, keyBy } from 'lodash';
import { FilterQuery, Model } from 'mongoose';
import { CategoryId } from '../category/category.model';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { BadInputError } from '../helpers/errors/BadInputError';
import { assertAllExisting } from '../helpers/get-or-create-dataloader';
import { AppLogger } from '../logging/logging.service';
import { MongoPagination, paginateQuery } from '../pagination/pagination';
import { PaginationService } from '../pagination/pagination.service';
import { AdminId } from '../user/model/admin.model';
import { CreateServiceInputDto } from './dto/create-service-input.dto';
import { ListServiceInput } from './dto/list-service-input.dto';
import { ListServicesOutputDto } from './dto/list-service-output.dto';
import { Service, ServiceId } from './service.model';

export class ServiceService {
  constructor(
    private logger: AppLogger,
    private readonly paginationService: PaginationService,
    @InjectModel(Service.name) private model: Model<Service>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async create(form: CreateServiceInputDto): Promise<Service> {
    return (await this.model.create(form)).toObject();
  }

  async getMany(filter?: ServiceFilter, pagination?: MongoPagination<Service>): Promise<Service[]> {
    this.logger.verbose('getMany');
    const mongoFilter = filterToMongoFilter(filter || {});
    const query = this.model.find(mongoFilter);
    const docs = await paginateQuery<Service>(query, pagination).lean().exec();
    return docs;
  }

  async getManyOld(args: ListServiceInput): Promise<ListServicesOutputDto> {
    this.logger.verbose('getMany');
    const q = this.model.find(filterToMongoFilter(args.criteria || {}));
    return await this.paginationService.paginate(q, args, { lean: true });
  }

  async exists(dealIds: ServiceId[]): Promise<boolean> {
    const result = await this.model.count({ _id: { $in: dealIds } });
    return result === dealIds.length;
  }

  async softDelete(dealId: ServiceId, adminId: AdminId): Promise<void> {
    this.logger.verbose('softDelete');
    const deletion: AdminAction = { date: new Date(), adminId };
    await this.model.updateOne({ _id: dealId }, { $set: { deleted: deletion } });
  }

  createDataloaderById(): DataLoader<ServiceId, Service> {
    return new DataLoader<ServiceId, Service>(async (dealIds: ServiceId[]) => {
      const deals = await this.getMany({ ids: dealIds });
      const dealsById = keyBy(deals, (g) => g._id);
      return assertAllExisting(
        Service.name,
        dealIds,
        dealIds.map((dealId) => dealsById[dealId]),
      );
    });
  }

  async validateIdsExist(serviceIds: ServiceId[]): Promise<ServiceId[]> {
    const services = await this.getMany({ ids: serviceIds });
    const servicePerId = keyBy(services, (g) => g._id);
    const missing = serviceIds.filter((id) => !servicePerId[id]);
    if (missing.length > 0) {
      throw new BadInputError(
        `Service with id ${missing.map((id) => `"${id}"`).join(', ')} does not exist`,
      );
    }
    return serviceIds;
  }
}

export interface ServiceFilter {
  ids?: ServiceId[];
  id?: ServiceId;
  categoriesIds?: CategoryId[];
  deleted?: boolean;
}

const filterToMongoFilter = (filter: ServiceFilter): FilterQuery<Service> => {
  const { ids, id, categoriesIds, deleted } = filter;
  const query: FilterQuery<Service> = {};
  if (id || ids) {
    query._id = { $in: [...(id ? [id] : []), ...(ids || [])] };
  }
  if (categoriesIds) {
    query.categorieIds = { $in: categoriesIds };
  }
  if (isBoolean(deleted)) {
    query.deleted = { $exists: deleted };
  }
  return query;
};
