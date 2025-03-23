import { User } from '@phishing-simulation/types';

export interface AuthTokenResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}
