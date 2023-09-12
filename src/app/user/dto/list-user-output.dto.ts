import { ObjectType } from '@nestjs/graphql';
import { Page } from '../../pagination/models/output/page.type';
import { UserOutputDto } from './user-output.dto';

@ObjectType({ isAbstract: true })
export class ListUserOutputDto extends Page(UserOutputDto, 'UserPage') {}
