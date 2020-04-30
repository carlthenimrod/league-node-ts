import { Error as MongooseError } from 'mongoose';

import { Error400, Error401, Error404, Error409, getStatusCode } from '..';

describe('getStatusCode', () => {
  it('should return 400', () => {
    const err = new Error400();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(400);
  });

  it('should return 401', () => {
    const err = new Error401();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(401);
  });
  
  it('should return 404', () => {
    const err = new Error404();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(404);
  });
  
  it('should return 409', () => {
    const err = new Error409();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(409);
  });
  
  it('should return 422', () => {
    const err = new MongooseError.ValidationError();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(422);
  });
  
  it('should return 500', () => {
    const err = new Error();
    const statusCode = getStatusCode(err);

    expect(statusCode).toEqual(500);
  });
});