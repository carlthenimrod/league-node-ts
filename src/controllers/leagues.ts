import { Router } from 'express';
import { ObjectID } from 'mongodb';

import League from '@models/league';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const leagues = await League.find();
    res.send(leagues);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const id: string = req.params.id;

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
});

router.post('/', async (req, res, next) => {
  const { name } = req.body;

  try {
    const league = new League({ name });
    await league.save();
    res.send(league);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  const id: string = req.params.id;
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
});

router.delete('/:id', async (req, res, next) => {
  const id: string = req.params.id;

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
});

export default router;