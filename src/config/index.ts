import dotenv from 'dotenv';
dotenv.config();

const {
  NODE_ENV = 'development',
  BASE_URL = 'http://localhost:4200',
  PORT = 3000,
  MONGODB_URI = 'mongodb://localhost:27017/league?replicaSet=rs0',
  ACCESS_TOKEN_SECRET = 'random_string',
  ACCESS_TOKEN_EXPIRES_IN = '1h',
  REFRESH_TOKEN_SECRET = 'random_string',
  REFRESH_TOKEN_EXPIRES_IN = '1h',
  EMAIL_API_KEY = false,
  EMAIL_FROM_DEFAULT = false
} = process.env;

export const environment = NODE_ENV;

export const baseUrl = BASE_URL;

export const port = +PORT;

export const db = MONGODB_URI;

interface TokenConfig {
  secret: string;
  expiresIn: string;
}

export const accessToken: TokenConfig = {
  secret: ACCESS_TOKEN_SECRET,
  expiresIn: ACCESS_TOKEN_EXPIRES_IN
}

export const refreshToken: TokenConfig = {
  secret: REFRESH_TOKEN_SECRET,
  expiresIn: REFRESH_TOKEN_EXPIRES_IN
}

interface EmailConfig {
  apiKey: string | boolean;
  fromDefault: string | boolean;
}

export const email: EmailConfig = {
  apiKey: EMAIL_API_KEY,
  fromDefault: EMAIL_FROM_DEFAULT
}

export interface Config {
  environment: string;
  baseUrl: string;
  port: number;
  db: string;
  accessToken: any;
  refreshToken: any;
  email: any;
};

const config: Config = {
  environment, 
  baseUrl, 
  port,
  db,
  accessToken,
  refreshToken,
  email
}

export default config;