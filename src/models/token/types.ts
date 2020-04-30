/**
 * Generic Token
 */
export interface Token {
  token: string;
  type: string;
}

/**
 * Authentication Token for API access
 */
export interface AuthToken extends Token {
  client: string;
}

/**
 * Object holding tokens and client that they belong to
 */
export interface TokenInfo {
  client: string;
  access_token: string;
  refresh_token: string;
}

/**
 * Decoded access token
 */
export interface AccessTokenDecoded { 
  _id: string;
  email: string;
  name: string;
  fullName: string;
  // status: this.status,
  img: string;
  // teams: this.teams
}

/**
 * Decoded refresh token
 */
export interface RefreshTokenDecoded { 
  client: string;
}