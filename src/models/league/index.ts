import { model } from 'mongoose';

import { leagueSchema } from './schema';
import { LeagueDocument } from './types';

export * from './types';

export default model<LeagueDocument>('League', leagueSchema);