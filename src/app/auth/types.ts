export enum Role {
  User = 'User',
  Admin = 'Admin',
}

export enum TokenType {
  Auth = 'Auth',
  Refresh = 'Refresh',
}

export interface TokenPayload {
  sub: string; // = UserId
  role: Role;
}

export interface AuthTokenPayload extends TokenPayload {
  type: TokenType.Auth;
}

export interface RefreshTokenPayload extends TokenPayload {
  type: TokenType.Refresh;
}
