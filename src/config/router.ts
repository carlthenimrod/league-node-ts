import { Router } from 'express';

import leagueController from '@controllers/leagues';
import UserController from '@controllers/users';
import httpLogger from '@middleware/http-logger';
import errorHandler from '@middleware/error-handler';

const router = Router();

// http logger
router.use(httpLogger);

// controllers
router.use('/leagues', leagueController)


// user router
const userRouter = Router();
router.use('/users', userRouter);

// user routes
userRouter.get('/', UserController.getUsers);
userRouter.get('/:id', UserController.getUser);
userRouter.post('/', UserController.postUser);
userRouter.put('/:id', UserController.putUser);
userRouter.delete('/:id', UserController.deleteUser);
userRouter.post('/email', UserController.checkEmail);


// 404
router.use((_req, res, next) => {
  res.statusCode = 404;
  next(new Error('Not Found'));
});

// error handler
router.use(errorHandler);

export default router;