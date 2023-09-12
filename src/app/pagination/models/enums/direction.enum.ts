import { registerEnumType } from '@nestjs/graphql';

export enum Direction {
  Asc = 'Asc',
  Desc = 'Desc',
}

registerEnumType(Direction, {
  name: 'Direction',
});
