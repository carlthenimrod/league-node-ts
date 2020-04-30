import { Document } from 'mongoose';

import { Address } from '../address';

interface GameTeam {
  name: string;
  score: number; 
  _id: string;
}

export interface GameDocument extends Document {
  home: GameTeam;
  away: GameTeam;
  start: string;
  time: boolean;
  place: {
    label: string;
    address: Address;
    locations: [{
      name: string;
    }]
  };
}