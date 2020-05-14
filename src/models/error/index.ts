import { Error as MongooseError } from 'mongoose';
import { JsonWebTokenError } from 'jsonwebtoken';

export interface ErrorResponse {
  message: string;
}

export class Error400 extends Error { };
export class Error401 extends Error { };
export class Error404 extends Error { };
export class Error409 extends Error { };

export const getStatusCode = (err: Error): number => {
switch (err.constructor) {
    case Error400:
      return 400;
    case Error401:
    case JsonWebTokenError:
      return 401;
    case Error404:
      return 404;
    case Error409:
      return 409;
    case MongooseError:
      return getMongooseErrorCode(err);
    default:
      return 500;
  }
}

const getMongooseErrorCode = (err: MongooseError): number => {
  switch (err.name) {
    case 'ValidationError':
      return 422;
    default:
      return 500;
  }
}
