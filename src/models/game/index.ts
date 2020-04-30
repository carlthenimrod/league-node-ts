import { model } from 'mongoose';

import gameSchema from './schema';
import { GameDocument } from './types';

export * from './types';

export default model<GameDocument>('Game', gameSchema);