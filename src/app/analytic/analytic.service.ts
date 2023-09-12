import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isNumber } from 'lodash';
import { Model } from 'mongoose';
import { Deal } from '../deal/deal.model';
import { AppLogger } from '../logging/logging.service';
import { UserId } from '../user/model/user.model';
import { Analytic } from './analytic.model';
import { PushEventInputDto } from './dto/push-event-input.dto';
import { ListEventsPossible } from './types';

@Injectable()
export class AnalyticService {
  constructor(
    private logger: AppLogger,
    @InjectModel(Analytic.name) private model: Model<Analytic>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async create(form: PushEventInputDto, userId: UserId): Promise<Analytic> {
    return (await this.model.create({ ...form, userId })).toObject();
  }

  async getTopViewedDeals({ fromDate, toDate, limit }: GetTopViewedDealsFilter = {}): Promise<
    TopViewDeals[]
  > {
    return await this.model.aggregate([
      {
        $match: {
          key: ListEventsPossible.DealPageShown,
          ...(fromDate || toDate
            ? {
                createdAt: {
                  ...(fromDate ? { $gte: fromDate } : {}),
                  ...(toDate ? { $lte: toDate } : {}),
                },
              }
            : {}),
        },
      },
      {
        $group: { _id: '$dealId', viewCount: { $sum: 1 } },
      },
      { $sort: { viewCount: -1 } },
      ...(isNumber(limit) ? [{ $limit: limit }] : []),
      {
        $lookup: {
          localField: '_id', // group._id = projectId of the group
          from: 'deals',
          foreignField: '_id',
          as: 'deals',
        },
      },
      {
        $unwind: '$deals',
      },
      {
        $project: {
          deals: '$deals',
          viewCount: '$viewCount',
        },
      },
    ]);
  }
}

interface GetTopViewedDealsFilter {
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}

export interface TopViewDeals {
  deal: Deal;
  viewCount: number;
}
