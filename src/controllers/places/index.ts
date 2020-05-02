import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import Place, { PlaceDocument, PlaceInput } from '@app/models/place';
import locationsRouter from './locations';
import permitsRouter from './permits';
import { Error400, Error404 } from '@app/models/error';

const placesRouter = Router();

const getPlaces = async (
  _req: Request, 
  res: Response<PlaceDocument[]>,
  next: NextFunction
) => {
  try {
    const places = await Place.find();
    res.send(places);
  } catch (e) {
    next(e);
  }
};

const getPlace = async (
  req: Request<{ id: string }>,
  res: Response<PlaceDocument>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const place = await Place.findById(id);
    if (!place) {
      throw new Error404('Place Not Found');
    }

    res.send(place);
  } catch (e) {
    next(e);
  }
}

const savePlace = async (
  req: Omit<Request, 'body'> & { body: PlaceInput }, 
  res: Response<PlaceDocument>, 
  next: NextFunction
) => {
  const {
    label,
    address,
    locations
  } = req.body;

  try {
    const place = new Place({ label, address, locations });
    await place.save();

    res.send(place);
  } catch (e) {
    next(e);
  }
};

interface UpdatePlaceRequest extends Request {
  params: { id: string };
  body: PlaceInput;
}

const updatePlace = async (
  req: UpdatePlaceRequest, 
  res: Response<PlaceDocument>, 
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { label, address, locations } = req.body;

    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const place = await Place.findById(id);
    if (!place) {
      throw new Error404('Place not found'); 
    }

    place.set('label', label);
    place.set('address', address);
    place.set('locations', locations);
    await place.save();

    res.send(place);
  } catch (e) {
    next(e);
  }
};

const deletePlace = async (
  req: Request<{ id: string }>, 
  res: Response, 
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const result = await Place.findByIdAndDelete(id);
    if (!result) {
      throw new Error404('Place not found');
    }

    res.send();
  } catch (e) {
    next(e);
  }
};

placesRouter.get('/', getPlaces);
placesRouter.get('/:id', getPlace);
placesRouter.post('/', savePlace);
placesRouter.put('/:id', updatePlace);
placesRouter.delete('/:id', deletePlace);

placesRouter.use('/:id/locations', locationsRouter);
placesRouter.use('/:id/permits', permitsRouter);

export default placesRouter;