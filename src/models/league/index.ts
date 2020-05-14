import { model } from 'mongoose';

import { leagueSchema } from './schema';
import { LeagueDocument } from './types';

export * from './types';

export * as leagueFactory from './factory';

export default model<LeagueDocument>('League', leagueSchema);