import { Router, RequestHandler, Request, Response, NextFunction } from 'express'
import { ObjectID } from 'mongodb';

import User, { UserDocument, UserInput } from '@models/user';

const router = Router();

router.get<{}, UserDocument[]>
('/', async (_req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    next(e);
  }
});

router.get<{ id: string }, UserDocument>
('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      res.statusCode = 400;
      throw new Error('Invalid ID');
    }

    const user = await User.findById(id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.post<{}, UserDocument, UserInput>
('/', async (req, res, next) => {
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
});

router.put<{ id: string }, UserDocument, UserInput>(
  '/:id', async (req, res, next) => {
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
      res.statusCode = 400;
      throw new Error('Invalid ID');
    }

    const user = await User.findById(id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.secondary = secondary;
    user.comments = comments;
    user.address.set(address);
    user.set('emergency', emergency);

    await user.save();
    res.send(user);
  } catch (e) {
    next(e);
  }
});

router.delete<{ id: string }, void>(
  '/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      res.statusCode = 400;
      throw new Error('Invalid ID');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    res.send();
  } catch (e) {
    next(e);
  }
});

const checkEmail: RequestHandler = async (
  req: Request & { body: { email: string } }, 
  res: Response<void>, 
  next: NextFunction
) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.statusCode = 409;
      throw new Error('User email taken');
    }
    res.send();
  } catch (e) {
    next(e);
  }
};

router.post('/email', checkEmail);

export default router;