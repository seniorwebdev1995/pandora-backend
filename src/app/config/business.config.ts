import { stringifiedIntegerZod } from './helpers/conversions';

export const businessConfigZod = {
  auctionBiddingIncreaseMin: ['AUCTION_BIDDING_INCREASE_MIN', stringifiedIntegerZod(200)],
} as const;
