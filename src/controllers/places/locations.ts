import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import Place from '@models/place';
import { Error400, Error404 } from '@app/models/error';

const locationsRouter = Router({ mergeParams: true });

interface AddLocationRequest extends Request {
  params: { id: string };
  body: {
    name: string;
  }
}

const addLocation = async (
  req: AddLocationRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const place = await Place.findById(id);
    if (!place) {
      throw new Error404('Place not found');
    }

    place.locations.push({ name });
    await place.save();
    res.send(place);
  } catch (e) {
    next(e);
  }
};

locationsRouter.post('/', addLocation);

export default locationsRouter;