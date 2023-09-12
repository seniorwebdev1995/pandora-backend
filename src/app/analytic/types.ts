import { registerEnumType } from '@nestjs/graphql';

export enum ListEventsPossible {
  DealPageShown = 'DealPageShown',
  DealLinkClicked = 'DealLinkClicked',
  CheckoutPageShown = 'CheckoutPageShown',
  PurchaseSuccess = 'PurchaseSuccess',
  PurchaseError = 'PurchaseError',
  RegisterPageShown = 'RegisterPageShown',
  RegisterCompleted = 'RegisterCompleted',
}

registerEnumType(ListEventsPossible, {
  name: 'ListEventsPossible',
});
