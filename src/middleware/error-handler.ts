import logger from '../util/logger';

import { ErrorRequestHandler } from 'express';
import { getStatusCode, ErrorResponse } from '@app/models/error';

export const errorHandler: ErrorRequestHandler = 
(err, req, res, _next) => {
  res.statusCode = getStatusCode(err);

  logger.error(err.message, { 
    action: req.method, 
    status: res.statusCode, 
    path: req.url 
  });
  
  const errorResponse: ErrorResponse = {
    message: err.message
  };

  res.send(errorResponse);
};

export default errorHandler;
