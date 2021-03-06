import { Router } from 'express';

import authController from '@app/controllers/auth';
import leaguesController from '@app/controllers/leagues';
import teamsController from '@app/controllers/teams';
import usersController from '@app/controllers/users';
import placesController from '@app/controllers/places';
import httpLogger from '@middleware/http-logger';
import errorHandler from '@middleware/error-handler';

const router = Router();

// http logger
// router.use(httpLogger);

// controllers
router.use('/auth', authController)
router.use('/leagues', leaguesController);
router.use('/teams', teamsController);
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