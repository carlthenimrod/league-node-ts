import { model } from 'mongoose';

import placeSchema from './schema';
import { PlaceDocument } from './types';

export { placeSchema };

export * from './types';

export * as placeFactory from './factory';

export default model<PlaceDocument>('Place', placeSchema);