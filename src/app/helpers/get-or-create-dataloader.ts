import DataLoader from 'dataloader';
import { isNil } from 'lodash';

export enum DataLoaderContextKey {
  UserById = 'UserById',
  CategoriesById = 'CategoriesById',
  DealById = 'DealById',
}

const DATALOADER_MAP_KEY = '_dataloaders';

// Get a dataloader from request context, or create one if not existing.
// When creating one, the dataloader is stored in the context:
// Context {
//   _dataloaders: {
//     myContextKey1: DataLoader,
//     myContextKey2: DataLoader,
//     myContextKey3: DataLoader,
//   }
// }
export const getOrCreateDataloader = <K, V>(
  context: object, // Obtain with @Context() decorator
  contextKey: DataLoaderContextKey,
  loader: DataLoader<K, V>,
): DataLoader<K, V> => {
  if (!context[DATALOADER_MAP_KEY]) {
    context[DATALOADER_MAP_KEY] = {};
  }
  const dataloaderMap = context[DATALOADER_MAP_KEY];
  if (!dataloaderMap[contextKey]) {
    dataloaderMap[contextKey] = loader;
  }
  return dataloaderMap[contextKey];
};

export const getDataloader = <K, V>(
  context: object, // Obtain with @Context() decorator
  contextKey: DataLoaderContextKey,
): DataLoader<K, V> | undefined => {
  return context[DATALOADER_MAP_KEY]?.[contextKey];
};

export const assertAllExisting = <T>(
  entityName: string,
  idList: unknown[],
  objList: (T | null | undefined)[],
): T[] => {
  return objList.map((val, index) => {
    if (isNil(val)) {
      throw new Error(`${entityName} document with id ${idList[index]} does not exist`);
    }
    return val;
  });
};

export const assertNoneIsError = <T>(objList: (T | Error)[]): T[] => {
  return objList.map((val) => {
    if (val instanceof Error) {
      throw val;
    }
    return val;
  });
};
