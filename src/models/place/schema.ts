import { Schema } from 'mongoose';
import ObjectId = Schema.Types.ObjectId;

import { addressSchema } from '@models/address';

const gameSchema = new Schema({
  locations: [ObjectId],
  start: Date,
  end: Date
});

const permitSchema = new Schema({
  start: Date,
  end: Date,
  games: [gameSchema]
}, { _id: false });

const placeSchema = new Schema({
  label: {
    type: String,
    trim: true,
    required: true
  },
  address: addressSchema,
  locations: [{ 
    name: { type: String, required: true, trim: true }
  }],
  permits: [permitSchema]
});

export default placeSchema;