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

interface PlaceLocation {
  _id?: string;
  name: string;
}

export interface PlaceInput {
  label: string;
  address: Address;
  locations: PlaceLocation[];
}

export type PlaceResponse = PlaceInput & { 
  _id: string, 
  permits: Permit[]
};

export type PlaceDocument = Document & PlaceInput & PlaceResponse;