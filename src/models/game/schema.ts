import { Schema } from 'mongoose';

import { placeSchema } from '@models/place';

const gamePlaceSchema = placeSchema.clone();
gamePlaceSchema.remove('permits');

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number
  }
});

const gameSchema = new Schema({
  home: teamSchema,
  away: teamSchema,
  start: Date,
  time: {
    type: Boolean,
    default: false
  },
  place: gamePlaceSchema
});

export default gameSchema;