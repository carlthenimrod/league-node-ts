import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

import { 
  accessToken as accessTokenConfig, 
  refreshToken as refreshTokenConfig
} from '@app/config';
import { UserDocument, UserModel } from './types';
import { TokenInfo, RefreshTokenDecoded } from '../token';
import { Error404, Error401 } from '../error';

export namespace Middleware {
  /**
   * Encrypts password before saving
   */
  export const hashPassword = async function(this: UserDocument) {
    if (!this.isModified('password')) { return; }
    this.password = await bcrypt.hash(this.password, 10);
  };
}

export namespace Statics {
  /**
   * Find user by email/password
   */
  export const findByCredentials = async function (
    this: UserModel,
    email: string,
    password: string
  ): Promise<UserDocument> {
    const user = await this.findOne({ email }, '+password +tokens').populate('teams');
    if (!user) {
      throw new Error404('User not found');
    }

    if (!await user.verifyPassword(password)) {
      throw new Error401('Password is incorrect');
    } else {
      return user;
    }
  };

  /**
   * Removes refresh token from user's token array
   */
  export const removeToken = async function (
    this: UserModel, 
    client: string, 
    refresh_token: string
  ) {
    return await this.updateOne({
      'tokens.client': client,
      'tokens.token': refresh_token,
      'tokens.type': 'refresh'
    }, {
      $pull: { tokens: { client, token: refresh_token } }
    });
  };

  /**
   * Finds user based on refresh token, 
   * creates/returns new access token along with user
   */
  export const refreshToken = async function (
    this: UserModel, 
    client: string, 
    refresh_token: string
  ): Promise<{ user: UserDocument, access_token: string }> {
    const decoded = jwt.verify(
      refresh_token, 
      refreshTokenConfig.secret
    ) as RefreshTokenDecoded;

    if (decoded.client !== client) {
      throw new Error401('Client doesn\'t match');
    }
  
    const user = await this
      .findOne({
        'tokens.client': client, 
        'tokens.token': refresh_token,
        'tokens.type': 'refresh'
      });
    
    if (!user) {
      throw new Error404('User not found');
    }
  
    const access_token = jwt.sign({
      _id: user._id,
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      status: user.status,
      img: user.img,
      teams: user.teams
    }, accessTokenConfig.secret, {
      expiresIn: accessTokenConfig.expiresIn
    });
  
    return { user, access_token };
  };
}

export namespace Methods {
  export const confirmEmail = function (this: UserDocument, code: string) {
    const tokens = this.tokens;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
  
      if ((token.type === 'confirm') && (token.token === code)) {
        return true;
      }
    }

    return false;
  };

  export const recoverPassword = async function(this: UserDocument) {
    const code = crypto.randomBytes(5).toString('hex');
    
    // this.tokens.push({ 
    //   token: code, 
    //   type: 'confirm' 
    // });
  
    if (this.email) { // send temporary password
      const link = `http://localhost:4200/confirm/${this._id}?code=${code}`;
  
      // mailer.send('user/recover', this.email, {
      //   name: this.fullName, 
      //   link
      // });
    }
  }

  /**
   * Checks value submitted is unencrypted password
   * @param value string to compare to user's stored password
   */
  export const verifyPassword = function (
    this: UserDocument, 
    password: string
  ): Promise<boolean> {
    if (!this.password) { throw Error('No Password'); }
    return bcrypt.compare(password, this.password);
  };

  /**
   * Generates access/refresh tokens, adds to user tokens array
   * @returns {TokenInfo} object containing tokens and client
   */
  export const generateTokens = function (this: UserDocument): TokenInfo {
    const access_token = jwt.sign(
      {
        _id: this._id,
        email: this.email,
        name: this.name,
        fullName: this.fullName,
        // status: this.status,
        img: this.img,
        // teams: this.teams
      },
      accessTokenConfig.secret,
      { expiresIn: accessTokenConfig.expiresIn }
    );
  
    const client = new ObjectID().toHexString();
  
    const refresh_token = jwt.sign(
      { client }, 
      refreshTokenConfig.secret, 
      { expiresIn: refreshTokenConfig.expiresIn }
    );
  
    this.tokens.push({
      client, 
      token: refresh_token,
      type: 'refresh'
    });
  
    while (this.tokens.length > 5) {
      this.tokens.shift();
    }
  
    return { access_token, refresh_token, client };
  };
}

export namespace Helpers {
  interface Name {
    first?: string;
    last?: string;
  }
  
  /**
   * Combines first/last name with space between
   * @param name name object containing first/last name
   */
  export const getFullName = (name?: Name): string | undefined => {
    if (!name) { return; }
    const { first, last } = name;
  
    return first && last 
      ? `${ first } ${ last }`
      : first || last;
  }
}