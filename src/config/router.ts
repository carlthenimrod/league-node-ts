import { Router } from 'express';

import leaguesController from '@app/controllers/leagues';
import usersController from '@app/controllers/users';
import placesController from '@app/controllers/places';
import httpLogger from '@middleware/http-logger';
import errorHandler from '@middleware/error-handler';

const router = Router();

// http logger
router.use(httpLogger);

// controllers
router.use('/leagues', leaguesController);
router.use('/users', usersController);
router.use('/places', placesController);

// 404
router.use((_req, res, next) => {
  res.statusCode = 404;
  next(new Error('Not Found'));
});

// error handler
router.use(errorHandler);

export default router;