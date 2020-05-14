import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@app/app';
import { dbConnect, dbClose } from '@app/test/setup';
import User, { userFactory, UserDocument } from '@models/user';
import { AuthResponse } from '@app/models/auth';
import { ErrorResponse } from '@app/models/error';
import { refreshToken } from '@app/config';

beforeAll(async () => await dbConnect('test-auth-controller'));

afterAll(async () => await dbClose());

afterEach(async () => await User.deleteMany({}));

describe('POST auth/login', () => {
  it('should login/return auth information', async () => {
    const testUser = userFactory.create();
    const { email, password } = testUser;
    await testUser.save();

    const response = await request(app)
      .post('/auth/login')
      .send({ email, password });

    const { body: authResponse, status }:
    { body: AuthResponse, status: number } 
    = response;

    expect(status).toEqual(200);
    expect(
      Object.keys(authResponse)
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'email', 
        'name', 
        'fullName', 
        'status', 
        'img', 
        'teams', 
        'access_token',
        'refresh_token',
        'client'
      ])
    );
  });

  it('should return 401 (incorrect password)', async () => {
    const testUser = await userFactory.save();

    const response = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: 'badpassword123' });
    
    const { body: error, status }
    : { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(401);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (user not found)', async () => {
    const response = await request(app).post('/auth/login');
    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST auth/logout', () => {
  it('should remove refresh token from user', async () => {
    const testUser = userFactory.create();
    testUser.tokens.push({
      client: '123',
      token: '123',
      type: 'refresh'
    });
    await testUser.save();
    expect(testUser.tokens).toHaveLength(1);

    const response = await request(app)
      .post('/auth/logout')
      .send({ client: '123', refresh_token: '123' });

    const { status } = response;

    expect(status).toEqual(200);
    const user = await User.findOne({}, '+tokens');
    expect((user as UserDocument).tokens).toHaveLength(0);
  });
});

describe.only('POST auth/refresh', () => {
  it('should return new access token', async () => {
    const testToken = jwt.sign({ client: 'clientID' }, refreshToken.secret);
    const testUser = userFactory.create();

    testUser.tokens.push({
      client: 'clientID',
      token: testToken,
      type: 'refresh'
    });

    await testUser.save();

    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: testToken, client: 'clientID' });

    const { body: authResponse, status }:
    { body: AuthResponse, status: number } 
    = response;

    expect(status).toEqual(200);
    expect(
      Object.keys(authResponse)
    )
    .toEqual(
      expect.arrayContaining([
        '_id', 
        'email', 
        'name', 
        'fullName', 
        'status', 
        'img', 
        'teams', 
        'access_token',
        'refresh_token',
        'client'
      ])
    )
  });

  it('should return 401 (token not provided)', async () => {
    const response = await request(app).post('/auth/refresh');
    
    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(401);
    expect(error).toHaveProperty('message');
  });

  it('should return 401 (client doesn\'t match)', async () => {
    const testToken = jwt.sign({ client: 'clientID' }, refreshToken.secret);

    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: testToken });

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(401);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (user not found)', async () => {
    const testToken = jwt.sign({ client: 'clientID' }, refreshToken.secret);
    
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refresh_token: testToken, client: 'clientID' });

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});