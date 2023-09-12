import { ObjectType } from '@nestjs/graphql';
import { Page } from '../../pagination/models/output/page.type';
import { Service } from '../service.model';

@ObjectType({ isAbstract: true })
export class ListServicesOutputDto extends Page(Service, 'ServicePage') {}
