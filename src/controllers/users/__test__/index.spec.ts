import request from 'supertest';
import { ObjectID } from 'mongodb';

import app from '@app/app';
import { dbConnect, dbClose } from '@app/test/setup';
import User, { UserResponse } from '@app/models/user';
import UserFactory from '@util/factory/user.factory';
import { ErrorResponse } from '@app/models/error';

beforeAll(async () => await dbConnect('test-users-controller'));

afterAll(async () => await dbClose());

afterEach(async () => User.deleteMany({}));

describe('GET users/', () => {
  it('should return 5 users', async () => {
    await UserFactory.save(5);

    const result = await request(app).get('/users');
    const { body: users, status }
    : { body: UserResponse[], status: number } 
    = result;

    expect(status).toEqual(200);
    expect(users).toHaveLength(5);
  });

  it('should return empty array', async () => {
    const result = await request(app).get('/users');
    const { body: users, status }
    : { body: UserResponse[], status: number } 
    = result;

    expect(status).toEqual(200);
    expect(users).toHaveLength(0);
  });
});

describe('GET users/:id', () => {
  it('should return a user', async () => {
    const testUser = await UserFactory.save();

    const result = await request(app).get(`/users/${ testUser._id }`);
    const { body: responseUser, status }
    : { body: UserResponse, status: number }
    = result;

    expect(status).toEqual(200);
    expect(responseUser.fullName).toEqual(testUser.fullName);
  });

  it('should return error 400 (Invalid ID)', async () => {
    const result = await request(app).get('/users/truck');
    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return error 404 (User not found)', async () => {
    const id = new ObjectID();

    const result = await request(app).get(`/users/${ id }`);
    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST users/', () => {
  it('should save/return user', async () => {
    const testUser = UserFactory.create();

    const result = await request(app).post('/users').send(testUser);
    const { body: responseUser, status } 
    : { body: UserResponse, status: number }
    = result; 

    expect(status).toEqual(200);
    expect(testUser.fullName).toEqual(responseUser.fullName);
  });

  it('should return error 422 (Validation Failed)', async () => {
    const testUser = { ...UserFactory.create().toObject() };
    delete testUser.name;

    const result = await request(app).post('/users').send(testUser);
    const { body: error, status } 
    : { body: ErrorResponse, status: number }
    = result; 

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');
  });
});

describe('PUT users/', () => {
  it('should update/return user', async () => {
    const testUser = await UserFactory.save();
    const result = await request(app)
      .put(`/users/${ testUser._id }`)
      .send(testUser);

    const { body: responseUser, status }
    : { body: UserResponse, status: number }
    = result;

    expect(status).toEqual(200);
    expect(testUser.fullName).toEqual(responseUser.fullName);
  });

  it('should return error 400 (Invalid ID)', async () => {
    const result = await request(app)
      .put('/users/truck')
      .send();

      const { body: error, status }
      : { body: ErrorResponse, status: number }
      = result;

      expect(status).toEqual(400);
      expect(error).toHaveProperty('message');
  });

  it('should return error 404 (User not found)', async () => {
    const id = new ObjectID();

    const result = await request(app)
      .put(`/users/${ id }`)
      .send();

      const { body: error, status }
      : { body: ErrorResponse, status: number }
      = result;

      expect(status).toEqual(404);
      expect(error).toHaveProperty('message');
  });
});

describe('DELETE users/', () => {
  it('should remove user', async () => {
    const testUser = await UserFactory.save();
    const result = await request(app)
      .delete(`/users/${ testUser._id }`);

    const { body, status }
    : { body: {}, status: number }
    = result;

    expect(status).toEqual(200);
    expect(body).toEqual({});
  });

  it('should return error 400 (Invalid ID)', async () => {
    const result = await request(app)
      .delete('/users/truck');

    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return error 404 (User not found)', async () => {
    const id = new ObjectID();
    const result = await request(app)
      .delete(`/users/${ id }`);

    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST users/email', () => {
  it('should return 200 (email available)', async () => {
    const result = await request(app)
      .post('/users/email')
      .send({ email: 'test@test.com' });
    
    const { body, status } = result;

    expect(status).toEqual(200);
    expect(body).toEqual({});
  });

  it('should return 409 (email exists)', async () => {
    const testUser = await UserFactory.save();

    const result = await request(app)
      .post('/users/email')
      .send({ email: testUser.email });

    const { body: error, status } 
    : { body: ErrorResponse, status: number } 
    = result;

    expect(status).toEqual(409);
    expect(error).toHaveProperty('message');
  })
});