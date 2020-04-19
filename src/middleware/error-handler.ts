import logger from '../util/logger';

import { ErrorRequestHandler } from 'express';
import { Error } from 'mongoose';

export interface ErrorResponse {
  message: string;
}

export const errorHandler: ErrorRequestHandler = 
(err, req, res, _next) => {
  let status: number;

  if (err instanceof Error.ValidationError) {
    status = 422;
  } else {
    status = res.statusCode === 200 ? 500 : res.statusCode;
  }

  logger.error(err.message, { action: req.method, status, path: req.url })
  
  const errorResponse: ErrorResponse = {
    message: err.message
  };

  res.status(status).send(errorResponse);
};

export default errorHandler;
