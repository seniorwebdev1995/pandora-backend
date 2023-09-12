import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AppLogger } from '../logging/logging.service';
import { AuthService } from './auth.service';
import { CurrentAuthToken } from './decorators/current-token-payload.decorator';
import { Public } from './decorators/public.decorator';
import { CredentialInput } from './dto/credential.input';
import { TokenPairOutputDto } from './dto/token.dto';
import { Role } from './types';

@Resolver('auth')
export class AuthResolver {
  constructor(private logger: AppLogger, private auth: AuthService) {
    this.logger.setContext(this.constructor.name);
  }

  @Public()
  @Mutation(() => TokenPairOutputDto, { description: 'Login to the application as a user' })
  async login(@Args() input: CredentialInput): Promise<TokenPairOutputDto> {
    this.logger.verbose('login');
    return await this.auth.login(Role.User, input);
  }

  @Public()
  @Mutation(() => TokenPairOutputDto, { description: 'Login to the application as an admin' })
  async adminLogin(@Args() input: CredentialInput): Promise<TokenPairOutputDto> {
    this.logger.verbose('adminLogin');
    return await this.auth.login(Role.Admin, input);
  }

  @Public()
  @Mutation(() => TokenPairOutputDto, { description: 'Refreshing an auth token' })
  async refreshAuthToken(
    @CurrentAuthToken() refreshJwt: string, // Unlike other endpoints, the provided jwt must be the refresh token.
  ): Promise<TokenPairOutputDto> {
    this.logger.verbose('refreshAuthToken');
    return await this.auth.refreshAuthToken(refreshJwt);
  }
}
