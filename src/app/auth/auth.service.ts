import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import moment from 'moment';
import { ConfigService } from '../config/config.service';
import { jwtDelayRegex } from '../config/jwt.config';
import { hash } from '../helpers/strings.tools';
import { AppLogger } from '../logging/logging.service';
import { AllUserService } from '../user/all-user.service';
import { CredentialInput } from './dto/credential.input';
import { Token, TokenPairOutputDto } from './dto/token.dto';
import { AuthTokenPayload, RefreshTokenPayload, Role, TokenType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private logger: AppLogger,
    private conf: ConfigService,
    private allUserService: AllUserService,
    private jwtService: JwtService,
  ) {
    this.logger.setContext('AuthService');
  }

  async login(role: Role, input: CredentialInput): Promise<TokenPairOutputDto> {
    const user = await this.allUserService.authenticate(input, role);
    if (!user) {
      throw new AuthenticationError('Incorrect email or password.');
    }
    return await this.createAndSaveTokenPair(user._id, role);
  }

  verifyToken(jwt: string): AuthTokenPayload {
    this.logger.verbose('validateJwtToken');
    return this.jwtService.verify<AuthTokenPayload>(jwt);
  }

  async refreshAuthToken(refreshJwt: string): Promise<TokenPairOutputDto> {
    this.logger.verbose('refreshAuthToken');
    const {
      sub: userId,
      role,
      type: tokenType,
    } = this.jwtService.verify<RefreshTokenPayload>(refreshJwt);
    if (tokenType !== TokenType.Refresh) {
      throw new AuthenticationError(`Expected Refresh token. Received ${tokenType} token`);
    }
    const user = await this.allUserService.getByIdAndRefreshTokenHash(
      userId,
      role,
      hash(refreshJwt),
    );
    if (!user) {
      throw new AuthenticationError('No user with this refresh JWT');
    }
    return await this.createAndSaveTokenPair(userId, role);
  }

  private async createAndSaveTokenPair(userId: string, role: Role): Promise<TokenPairOutputDto> {
    return {
      authToken: this.createAuthToken(userId, role),
      refreshToken: await this.createAndSaveUserRefreshToken(userId, role),
    };
  }

  private createAuthToken(userId: string, role: Role): Token {
    this.logger.verbose(`createAuthToken for ${userId}`);
    const payload: AuthTokenPayload = { type: TokenType.Auth, sub: userId, role };
    const expireDelay = this.conf.jwt.authExpire;
    const [delayAmount, delayUnit] = splitDateAmountAndUnit(expireDelay);
    const expirationDate = moment().add(delayAmount, delayUnit as any);
    return {
      expiresAt: expirationDate.toDate(),
      token: this.jwtService.sign(payload, { expiresIn: expireDelay }),
    };
  }

  private async createAndSaveUserRefreshToken(userId: string, role: Role): Promise<Token> {
    this.logger.verbose(`createAndSaveUserRefreshToken for ${userId}`);
    const refreshToken = this.createRefreshToken(userId, role);
    await this.allUserService.updateRefreshTokenHash(userId, role, hash(refreshToken.token));
    return refreshToken;
  }

  private createRefreshToken(userId: string, role: Role): Token {
    this.logger.verbose(`createRefreshToken for ${userId}`);
    const payload: RefreshTokenPayload = { type: TokenType.Refresh, sub: userId, role };
    const expireDelay = this.conf.jwt.refreshExpire;
    const [delayAmount, delayUnit] = splitDateAmountAndUnit(expireDelay);
    const expirationDate = moment().add(delayAmount, delayUnit as any);
    return {
      expiresAt: expirationDate.toDate(),
      token: this.jwtService.sign(payload, { expiresIn: expireDelay }),
    };
  }
}

const splitDateAmountAndUnit = (str: string): [number, string] => {
  const match = str.match(jwtDelayRegex);
  if (!match) {
    throw new InternalServerErrorException(`"${str}" doest not match regex ${jwtDelayRegex}`);
  }
  return [+match[1], match[2]];
};
