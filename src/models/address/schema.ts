import { Schema } from 'mongoose';

const addressSchema = new Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postal: { type: String, trim: true }
}, {
  _id: false
});

export default addressSchema;