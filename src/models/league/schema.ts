import { Schema } from 'mongoose';

export const leagueSchema = new Schema({
  name: { type: String, required: true }
});