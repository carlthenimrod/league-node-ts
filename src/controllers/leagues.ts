import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import League, { LeagueDocument, LeagueInput } from '@models/league';

/**
 * LeaguesController Namespace
 * @namespace LeaguesController
 */
namespace LeaguesController {
  /**
   * Retrieve all leagues
   */
  export const getLeagues = async (
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
  export const getLeague = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;

    try {
      if(!ObjectID.isValid(id)) {
        res.statusCode = 400;
        throw new Error('Invalid ID');
      }
  
      const league = await League.findById(id);
      if (!league) {
        res.statusCode = 404;
        throw new Error('League not found');
      }
  
      res.send(league);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Creates/saves league to DB
   */
  export const postLeague = async (
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
  export const putLeague = async (
    req: Request<{ id: string }> & { body: LeagueInput },
    res: Response<LeagueDocument>,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const { name } = req.body;
  
    try {
      if (!ObjectID.isValid(id)) {
        res.statusCode = 400;
        throw new Error('Invalid ID');
      }
  
      const league = await League.findById(id);
      if (!league) {
        res.statusCode = 404;
        throw new Error('League not found');
      }
  
      league.name = name;
      await league.save();
      res.send(league);
    } catch (e) {
      next(e);
    }
  };

  export const deleteLeague = async (
    req: Request<{ id: string }>,
    res: Response<void>,
    next: NextFunction
  ) => {
    const id = req.params.id;

    try {
      if (!ObjectID.isValid(id)) {
        res.statusCode = 400;
        throw Error('Invalid ID');
      }
      
      const result = await League.findByIdAndDelete(id);
      if (!result) {
        res.statusCode = 404;
        throw Error('League not found');
      }
  
      res.send();
    } catch (e) {
      next(e);
    }
  };
}

export default LeaguesController;