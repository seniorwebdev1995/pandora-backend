import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ENDPOINT_IS_PUBLIC_METADATA_KEY } from '../metadata';

// Indicate that an endpoint is public access
export const Public = (): CustomDecorator<string> =>
  SetMetadata(ENDPOINT_IS_PUBLIC_METADATA_KEY, true);
