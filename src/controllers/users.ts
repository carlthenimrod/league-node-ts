import { Request, Response, NextFunction } from 'express'
import { ObjectID } from 'mongodb';

import User, { UserDocument, UserInput } from '@models/user';

/**
 * UsersController Namespace
 * @namespace UsersController
 */
namespace UsersController {
  /**
   * Retrieves all users
   */
  export const getUsers = async (
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
  export const getUser = async (
    req: Request<{ id: string }>,
    res: Response<UserDocument>,
    next: NextFunction
  ) => {
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
  };

  /**
   * Creates/saves user to DB
   */
  export const postUser = async (
    req: Request & { body: UserInput },
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
  export const putUser = async (
    req: Request<{ id: string }> & { body: UserInput },
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
  };

  /**
   * Deletes user from DB 
   */
  export const deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<void>,
    next: NextFunction
  ) => {
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
  };

  /**
   * Checks to see if email exists
   */
  export const checkEmail = async (
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
}

export default UsersController;