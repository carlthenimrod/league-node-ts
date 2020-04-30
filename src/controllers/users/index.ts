import { Router, Request, Response, NextFunction } from 'express'
import { ObjectID } from 'mongodb';

import User, { UserDocument, UserInput } from '@models/user';
import passwordRouter from './password';
import { Error400, Error404, Error409 } from '@app/models/error';

/**
 * Contains user routes
 */
const userRouter = Router();

/**
 * Retrieves all users
 */
const getUsers = async (
  _req: Request, 
  res: Response<UserDocument[]>, 
  next: NextFunction
) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    next(e);
  }
};

/**
 * Retrieves a single user
 */
const getUser = async (
  req: Request<{ id: string }>,
  res: Response<UserDocument>,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error404('User not found');
    }
    res.send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Creates/saves user to DB
 */
const saveUser = async (
  req: Omit<Request, 'body'> & { body: UserInput },
  res: Response<UserDocument>,
  next: NextFunction
) => {
  const {
    name,
    email,
    address,
    phone,
    secondary,
    emergency,
    comments
  } = req.body;

  const user = new User({
    name,
    email,
    address,
    phone,
    secondary,
    emergency,
    comments
  });

  try {
    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Updates user in DB
 */
const updateUser = async (
  req: Omit<Request<{ id: string }>, 'body'> & { body: UserInput },
  res: Response<UserDocument>,
  next: NextFunction
) => {
  const id = req.params.id;
  const {
    name,
    email,
    address,
    phone,
    secondary,
    emergency,
    comments
  } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const user = await User.findById(id);
    if (!user) {
      throw new Error404('User not found');
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.secondary = secondary;
    user.comments = comments;
    user.address = address;
    user.set('emergency', emergency);

    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Deletes user from DB 
 */
const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response<void>,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error404('User not found');
    }

    res.send();
  } catch (e) {
    next(e);
  }
};

/**
 * Checks to see if email exists
 */
const checkEmail = async (
  req: Omit<Request, 'body'> & { body: { email: string } }, 
  res: Response<void>, 
  next: NextFunction
) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (user) {
      throw new Error409('User email taken');
    }
    res.send();
  } catch (e) {
    next(e);
  }
};

userRouter.get('/', getUsers);
userRouter.post('/', saveUser);
userRouter.get('/:id', getUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
userRouter.post('/email', checkEmail);

userRouter.use('/:id/password', passwordRouter);

export default userRouter;