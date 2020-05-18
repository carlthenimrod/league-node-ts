import { Router, Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';

import Team, { TeamDocument, TeamInput } from '@models/team';
import { Error400, Error404 } from '@app/models/error';

const teamsRouter = Router();

const getTeams = async (
  req: Request,
  res: Response<TeamDocument[]>,
  next: NextFunction
) => {
  try {
    const teams = await Team.find();
    res.send(teams);
  } catch (e) {
    next(e);
  }
};

const getTeam = async (
  req: Request<{ id: string }>,
  res: Response<TeamDocument>,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new Error404('Team not found');
    }

    res.send(team);
  } catch (e) {
    next(e);
  }
};

interface SaveTeamRequest extends Request {
  body: TeamInput
}

const saveTeam = async (
  req: SaveTeamRequest,
  res: Response<TeamDocument>,
  next: NextFunction
) => {
  const { name } = req.body;

  try {
    const team = new Team({ name });
    await team.save();

    res.send(team);
  } catch (e) {
    next(e);
  }
};

type UpdateTeamRequest = SaveTeamRequest & { params: { id: string } };

const updateTeam = async (
  req: UpdateTeamRequest,
  res: Response<TeamDocument>,
  next: NextFunction
) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const team = await Team.findById(id);
    if (!team) {
      throw new Error404('Team not found');
    }
    
    team.name = name;
    await team.save();

    res.send(team);
  } catch (e) {
    next(e);
  }
};

const deleteTeam = async (
  req: Request<{ id: string }>,
  res: Response<void>,
  next: NextFunction
) => {
  const id = req.params.id;

  try {
    if (!ObjectID.isValid(id)) {
      throw new Error400('Invalid ID');
    }

    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      throw new Error404('Team not found');
    }

    res.send();
  } catch (e) {
    next(e);
  }
};

teamsRouter.get('/', getTeams);
teamsRouter.post('/', saveTeam);
teamsRouter.get('/:id', getTeam);
teamsRouter.put('/:id', updateTeam);
teamsRouter.delete('/:id', deleteTeam);

export default teamsRouter;