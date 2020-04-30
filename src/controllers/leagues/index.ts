import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import League, { LeagueDocument, LeagueInput } from '@models/league';
import { Error400, Error404 } from '@app/models/error';

const leagueRouter = Router();

/**
 * Retrieve all leagues
 */
const getLeagues = async (
  _req: Request,
  res: Response<LeagueDocument[]>,
  next: NextFunction
) => {
  try {
    const leagues = await League.find();
    res.send(leagues);
  } catch (e) {
    next(e);
  }
};

/**
 * Retrieves a single league
 */
const getLeague = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if(!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const league = await League.findById(id);
    if (!league) {
      throw new Error404('League not found');
    }

    res.send(league);
  } catch (e) {
    next(e);
  }
};

/**
 * Creates/saves league to DB
 */
const saveLeague = async (
  req: Request & { body: LeagueInput },
  res: Response<LeagueDocument>,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const league = new League({ name });
    await league.save();
    res.send(league);
  } catch (e) {
    next(e);
  }
};

/**
 * Updates/saves league to DB
 */
const updateLeague = async (
  req: Request<{ id: string }> & { body: LeagueInput },
  res: Response<LeagueDocument>,
  next: NextFunction
) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const league = await League.findById(id);
    if (!league) {
      throw new Error404('League not found');
    }

    league.name = name;
    await league.save();
    res.send(league);
  } catch (e) {
    next(e);
  }
};

const deleteLeague = async (
  req: Request<{ id: string }>,
  res: Response<void>,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }
    
    const result = await League.findByIdAndDelete(id);
    if (!result) {
      throw new Error404('League not found');
    }

    res.send();
  } catch (e) {
    next(e);
  }
};

leagueRouter.get('/', getLeagues);
leagueRouter.post('/', saveLeague);
leagueRouter.get('/:id', getLeague);
leagueRouter.put('/:id', updateLeague);
leagueRouter.delete('/:id', deleteLeague);

export default leagueRouter;