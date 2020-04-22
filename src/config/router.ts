import { Router } from 'express';

import leagueController from '@controllers/leagues';
import userController from '@controllers/users';
import httpLogger from '@middleware/http-logger';
import errorHandler from '@middleware/error-handler';

const router = Router();

// http logger
router.use(httpLogger);

// controllers
router.use('/leagues', leagueController);
router.use('/users', userController)

// 404
router.use((_req, res, next) => {
  res.statusCode = 404;
  next(new Error('Not Found'));
});

// error handler
router.use(errorHandler);

export default router;