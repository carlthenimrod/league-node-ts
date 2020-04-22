import { Router } from 'express';

import LeaguesController from '@controllers/leagues';
import UsersController from '@controllers/users';
import httpLogger from '@middleware/http-logger';
import errorHandler from '@middleware/error-handler';

const router = Router();

// http logger
router.use(httpLogger);

// controllers
const leaguesRouter = Router();
router.use('/leagues', leaguesRouter);

//leagues router
leaguesRouter.get('/', LeaguesController.getLeagues);
leaguesRouter.get('/:id', LeaguesController.getLeague);
leaguesRouter.post('/', LeaguesController.postLeague);
leaguesRouter.put('/:id', LeaguesController.putLeague);
leaguesRouter.delete('/:id', LeaguesController.deleteLeague);

// users router
const usersRouter = Router();
router.use('/users', usersRouter);

// users routes
usersRouter.get('/', UsersController.getUsers);
usersRouter.get('/:id', UsersController.getUser);
usersRouter.post('/', UsersController.postUser);
usersRouter.put('/:id', UsersController.putUser);
usersRouter.delete('/:id', UsersController.deleteUser);
usersRouter.post('/email', UsersController.checkEmail);


// 404
router.use((_req, res, next) => {
  res.statusCode = 404;
  next(new Error('Not Found'));
});

// error handler
router.use(errorHandler);

export default router;