import { Schema } from 'mongoose';
import ObjectId = Schema.Types.ObjectId;

import { addressSchema } from '@models/address';

const gameSchema = new Schema({
  locations: [ObjectId],
  start: Date,
  end: Date
});

const locationSchema = new Schema({
  name: { type: String, required: true, trim: true }
});

const permitSchema = new Schema({
  start: Date,
  end: Date,
  games: [gameSchema]
});

const placeSchema = new Schema({
  label: {
    type: String,
    trim: true,
    required: true
  },
  address: addressSchema,
  locations: [locationSchema],
  permits: [permitSchema]
});

export default placeSchema;