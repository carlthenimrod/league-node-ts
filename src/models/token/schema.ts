import { Schema } from 'mongoose';

export const tokenSchema = new Schema({
  client: String,
  token: { type: String, required: true },
  type: { type: String }
}, {
  _id: false
});