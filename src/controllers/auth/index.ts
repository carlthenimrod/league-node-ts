import { Router, Request, Response, NextFunction } from 'express';

import User from '@models/user';
import { AuthResponse } from '@models/auth';

const authRouter = Router();

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}

const loginUser = async (
  req: LoginRequest, 
  res: Response<AuthResponse>, 
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const tokens = user.generateTokens();
    await user.save();

    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      status: user.status,
      img: user.img,
      teams: user.teams,
      ...tokens
    });
  } catch (e) {
    next(e);
  }
};

interface LogoutRequest extends Request {
  body: {
    client: string;
    refresh_token: string;
  }
}

const logoutUser = async (
  req: LogoutRequest,
  res: Response,
  next: NextFunction
) => {
  const { client, refresh_token } = req.body;

  try {
    await User.removeToken(client, refresh_token);
    res.send();
  } catch (e) {
    next(e);
  }
};

type RefreshRequest = LogoutRequest;

const refreshToken = async (
  req: RefreshRequest,
  res: Response<AuthResponse>,
  next: NextFunction
) => {
  const { client, refresh_token } = req.body;

  try {
    const { user, access_token } = await User.refreshToken(client, refresh_token);
    res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      fullName: user.fullName,
      status: user.status,
      img: user.img,
      teams: user.teams,
      client,
      access_token,
      refresh_token
    });
  } catch (e) {
    next(e);
  }
};

authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);
authRouter.post('/refresh', refreshToken);

export default authRouter;