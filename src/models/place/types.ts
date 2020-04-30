import { Document } from 'mongoose';

import { Address } from '../address';

interface Game {
  _id: string;
  locations: string[],
  start: string;
  end: string;
}

interface Permit {
  start: string;
  end: string;
  games: Game[];
}

export interface PlaceDocument extends Document {
  label: string;
  address: Address;
  locations: string[];
  permits: Permit[];
}
