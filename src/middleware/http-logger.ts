import { RequestHandler } from 'express';

import logger from '../util/logger';

const httpLogger: RequestHandler = (req, res, next) => {
  logger.http('...Logging', { 
    action: req.method, 
    status: res.statusCode, 
    path: req.url 
  });

  next();
};

export default httpLogger;
