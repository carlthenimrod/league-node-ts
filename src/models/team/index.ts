import { model } from 'mongoose';

import teamSchema from './schema';
import { TeamDocument, TeamModel } from './types';

export * from './types';

export * as teamFactory from './factory';

// todo: teamSchema.static();

export default model<TeamDocument, TeamModel>('Team', teamSchema);