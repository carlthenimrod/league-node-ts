import { Schema, model, Document } from 'mongoose';

export interface AddressInput {
  street?: string;
  city?: string;
  state?: string;
  postal?: string;
}

export type AddressResponse = AddressInput;

export type AddressDocument = AddressInput & Document;

export const addressSchema = new Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postal: { type: String, trim: true }
}, {
  _id: false
});

export default model<AddressDocument>('Address', addressSchema);