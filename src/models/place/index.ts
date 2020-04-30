import { model } from 'mongoose';

import placeSchema from './schema';
import { PlaceDocument } from './types';

export { placeSchema };

export * from './types';

export default model<PlaceDocument>('Place', placeSchema);