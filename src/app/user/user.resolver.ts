import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { setAsAuthorizedDocument } from '../auth/authz/rule-builders/can-read-authorized-documents';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/types';
import { AppLogger } from '../logging/logging.service';
import { graphqlToMongoPagination, ListMetadata } from '../pagination/pagination-args.graphql';
import { CreateUserInputDto } from './dto/create-user-input.dto';
import { UpdateUserInputDto } from './dto/update-user-input.dto';
import { UserOutputDto } from './dto/user-output.dto';
import { UsersQueryArgs } from './dto/users-query-args';
import { User, UserId } from './model/user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private logger: AppLogger, private userService: UserService) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= QUERY =============== */
  @Roles(Role.User)
  @Query(() => User)
  async me(@CurrentUserId() id: UserId): Promise<User> {
    this.logger.verbose('me');
    const user = await this.userService.getById(id, { excludeSoftDeleted: true });
    if (!user) {
      throw new UserInputError('User does not exist');
    }
    return user;
  }

  @Public()
  @Query(() => Boolean)
  async isEmailTaken(@Args('email') email: string): Promise<boolean> {
    this.logger.verbose('isEmailTaken');
    return await this.userService.isEmailTaken(email);
  }

  @Roles(Role.Admin)
  @Query(() => [User])
  async users(@Args() { filter, ...pagination }: UsersQueryArgs): Promise<User[]> {
    this.logger.verbose('users');
    return await this.userService.getMany(
      filter,
      graphqlToMongoPagination(pagination, { defaultLimit: 10, maxLimit: 50 }),
    );
  }

  @Roles(Role.Admin)
  @Query(() => ListMetadata)
  async usersMetadata(@Args() { filter }: UsersQueryArgs): Promise<ListMetadata> {
    this.logger.verbose('usersMetadata');
    return { count: await this.userService.count(filter) };
  }

  /* ================= MUTATION =============== */
  @Public()
  @Mutation(() => User)
  async createUser(@Args() user: CreateUserInputDto, @Context() context: object): Promise<User> {
    this.logger.verbose('createUser');
    const newUser = await this.userService.create(user);
    setAsAuthorizedDocument(newUser._id, context);
    return newUser;
  }

  @Roles(Role.User)
  @Mutation(() => UserOutputDto)
  async updateMe(
    @Args('form') form: UpdateUserInputDto,
    @CurrentUserId() id: UserId,
  ): Promise<UserOutputDto | null> {
    this.logger.verbose('updateMe');
    return await this.userService.updateUser(id, form, { excludeSoftDeleted: true });
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('userId') userId: UserId,
    @CurrentUserId() adminId: UserId,
  ): Promise<boolean> {
    this.logger.verbose('deleteUser');
    await this.userService.softDelete(userId, adminId);
    return true;
  }
}
