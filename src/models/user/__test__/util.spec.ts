import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { mocked } from 'ts-jest/utils';

import { AuthToken } from '@app/models/token';
import { Middleware, Methods, Helpers } from '../util';
import UserFactory from '@app/util/factory/user.factory';
import User from '@models/user';
import { Error401, Error404 } from '@app/models/error';

jest.mock('jsonwebtoken');

describe('Middleware.hashPassword', () => {
  it('should encrypt password', async () => {
    const password = 'test123';
  
    const user = UserFactory.create();
    user.password = password;
    
    await Middleware.hashPassword.call(user);
  
    expect(user.password).not.toEqual(password);
    await expect(
      bcrypt.compare(password, user.password)
    )
    .resolves.toBeTruthy();
  });
});

describe('Methods.verifyPassword', () => {
  it('should verify password/return true', async () => {
    const password = 'test123';
    const user = UserFactory.create();
    user.password = password;
  
    await Middleware.hashPassword.call(user);
  
    expect(
      Methods.verifyPassword.call(user, password)
    )
    .resolves
    .toBeTruthy();
  });
});

describe('Statics.findByCredentials', () => {
  it('should return user', async () => {
    const testUser = UserFactory.create();
    const password = testUser.password as string;
    testUser.password = await bcrypt.hash(testUser.password, 10);

    const spy = jest.spyOn(User, 'findOne');
    spy.mockResolvedValue(testUser);

    const resultUser = await User.findByCredentials(
      testUser.email, 
      password
    );

    expect(spy).toHaveBeenCalled();
    expect(resultUser.email).toEqual(testUser.email);
  });
});

describe('Statics.refreshToken', () => {
  it('should return user and access token', async () => {
    const user = UserFactory.create();

    mocked(jwt).verify.mockImplementation(() => {
      return { client: 'client-id' };
    });

    jest.spyOn(User, 'findOne').mockResolvedValue(user);

    const result = await User.refreshToken('client-id', 'refresh_token');

    expect(
      Object.keys(result)
    )
    .toEqual(
      expect.arrayContaining(['user', 'access_token'])
    )
  });

  it('should return 404 (user not found)', async () => {
    mocked(jwt).verify.mockImplementation(() => {
      return { client: 'client-id' };
    });

    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    await expect(
      User.refreshToken('client-id', 'refresh_token')
    )
    .rejects
    .toThrow(Error404);
  });

  it('should return 401 (incorrect client)', async () => {
    mocked(jwt).verify.mockImplementation(() => {
      return { client: 'wrong-client-id' };
    });

    await expect(
      User.refreshToken('client-id', 'refresh_token')
    )
    .rejects
    .toThrow(Error401);
  });
});

describe('Methods.generateTokens', () => {
  it('should create tokens object, user tokens array should contain a refresh token', () => {
    const user = UserFactory.create();
    const tokens = user.generateTokens();

    const refreshToken = user.tokens[0] as AuthToken;

    expect(Object.keys(tokens))
    .toEqual(
      expect.arrayContaining(['access_token', 'refresh_token', 'client'])
    );

    expect(user.tokens).toHaveLength(1);
    expect(refreshToken.client).toEqual(tokens.client);
    expect(refreshToken.token).toEqual(tokens.refresh_token);
  });
});

describe('Helpers.getFullName', () => {
  it('should return full name', async () => {
    const name = { first: 'Harry', last: 'Johnson' }
  
    const fullName = Helpers.getFullName(name);
    const { first, last } = name;
  
    expect(fullName).toEqual(`${ first } ${ last }`);
  });

  it('should return first name only (no last name provided)', () => {
    const first = 'Harry';

    const fullName = Helpers.getFullName({ first });
    expect(fullName).toEqual(first);
  });

  it('should return last name only (no first name provided)', () => {
    const last = 'Johnson';

    const fullName = Helpers.getFullName({ last });
    expect(fullName).toEqual(last);
  });

  it('should return undefined (no name provided)', () => {
    const fullName = Helpers.getFullName();
    expect(fullName).toBeUndefined();
  });
}); 