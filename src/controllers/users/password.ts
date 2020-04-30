import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import User from '@models/user';
import { Error400, Error401, Error404 } from '@app/models/error';

const passwordRouter = Router({ mergeParams: true });

interface SavePasswordRequest extends Request {
  params: {
    id: string;
  }
  body: {
    code: string;
    password: string;
  }
}

const savePassword = async (
  req: SavePasswordRequest,
  res: Response, 
  next: NextFunction
) => {
  const id = req.params.id;
  const { code, password } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID.');
    }

    const user = await User
      .findById(id, '+tokens');

    if (!user) {
      throw new Error404('User not found');
    };

    if (user.confirmEmail(code)) {
      user.password = password;
      user.tokens = [];
      //const tokens = await user.generateTokens();
      
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        fullName: user.fullName,
        img: user.img,
        //...tokens
      });
    }
  } catch (e) {
    next(e);
  }
};

interface UpdatePasswordRequest extends Request {
  params: {
    id: string;
  }
  body: {
    old: string;
    password: string;
  }
}

const updatePassword = async (
  req: UpdatePasswordRequest,
  res: Response<void>,
  next: NextFunction
) => {
  const id = req.params.id;
  const { old, password } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const user = await User.findById(id, '+password');
    if (!user) {
      throw new Error404('User not found');;
    }

    if (!await user.verifyPassword(old)) {
      throw new Error401('Password is incorrect');
    }

    user.password = password;
    await user.save();

    res.send();
  } catch (e) {
    next(e);
  }
};

passwordRouter.post('/', savePassword);
passwordRouter.put('/', updatePassword);

export default passwordRouter;