import { Schema } from 'mongoose';
import validator from 'validator';

import { UserDocument } from './types';
import { addressSchema } from '../address';
import { tokenSchema } from '../token';
import { Helpers } from './util';

const userSchema = new Schema({
  name: {
    first: { type: String, trim: true, required: true },
    last: { type: String, trim: true, required: true }
  },
  email: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    trim: true,
    minlength: 6,
    select: false
  },
  status: {
    new: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
  },
  img: String,
  tokens: {
    type: [tokenSchema],
    select: false
  },
  address: addressSchema,
  phone: { type: String, trim: true },
  secondary: { type: String, trim: true },
  emergency: {
    name: {
      first: { type: String, trim: true },
      last: { type: String, trim: true }
    },
    phone: { type: String, trim: true },
    secondary: { type: String, trim: true }
  },
  comments: { type: String, trim: true }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default userSchema;