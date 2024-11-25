import { IUser } from './user';

export interface IAuth {
  user?: IUser | null;
  rememberMe?: boolean;
  isAuthenticated?: boolean;
}

export interface Tokens {
  token?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  refreshTokenExpiresAt?: Date | null;
}
