import { Document, Model } from 'mongoose';

import { Address } from '../address';
import { Token, AuthToken, TokenInfo } from '../token';
import { TeamInput, TeamDocument } from '../team';

export interface UserInput {
  name: {
    first: string;
    last: string;
  },
  email: string;
  password?: string;
  status?: {
    new: boolean;
    verified: boolean;
  };
  img?: string;
  address: Address;
  phone: string;
  secondary?: string;
  emergency?: {
    name: {
      first: string;
      last: string;
    },
    phone: string;
    secondary: string;
  },
  comments?: string;
  teams?: TeamInput[];
}

export interface UserResponse extends Omit<UserInput, 'password'> {
  fullName: string;
  _id: string;
  __v: string;
}

export interface UserDocument extends Document, UserInput, Omit<UserResponse, '_id'|'__v'> {
  tokens: (Token|AuthToken)[];
  teams: TeamDocument[];
  status: {
    new: boolean;
    verified: boolean;
  };
  img: string;
  confirmEmail: (this: UserDocument, code: string) => boolean;
  generateTokens: (this: UserDocument) => TokenInfo; 
  verifyPassword: (this: UserDocument, password: string) => Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByCredentials: (email: string, password: string) => Promise<UserDocument>;
  removeToken: (client: string, refresh_token: string) => Promise<void>; 
  refreshToken: (client: string, refresh_token: string) => Promise<{ user: UserDocument, access_token: string }>;
}