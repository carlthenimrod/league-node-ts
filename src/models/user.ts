import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { addressSchema, AddressDocument, AddressInput } from './address';

export interface UserInput {
  name: {
    first: string;
    last: string;
  },
  email: string;
  password?: string;
  img?: string;
  address: AddressInput;
  phone: string;
  secondary?: string;
  emergency?: {
    name: {
      first: string;
      last: string;
    },
    phone: string;
    secondary: string;
  },
  comments?: string;
}

export interface UserResponse extends Omit<UserInput, 'password'> {
  fullName: string;
  _id: string;
  __v: string;
}

export interface UserDocument extends Document, UserInput, Omit<UserResponse, '_id'|'__v'> {
  address: AddressDocument;
}

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
    type: [{
      _id: false,
      client: String,
      token: String,
      type: { type: String }
    }],
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

function getFullName(name: { first: string, last: string }): string {
  return name.first && name.last
    ? name.first + ' ' + name.last
    : name.first || name.last;
}

userSchema.virtual('fullName').get(function(this: UserDocument) {
  return getFullName(this.name);
});

userSchema.virtual('emergency.fullName').get(function(this: UserDocument) {
  if (this.emergency && this.emergency.name 
    && (this.emergency.name.first || this.emergency.name.last)
  ) { return getFullName(this.emergency.name); }
});

/**
 * Hash password before saving (if it has been modified)
 * 
 * @param this current user document
 */
const hashPassword = async function(this: UserDocument) {
  if (!this.isModified('password')) { return; }
  this.password = await bcrypt.hash(this.password, 10);
};

userSchema.pre('save', hashPassword);

userSchema.statics.findByCredentials 
= async function(this: Model<UserDocument>, email: string, password: string) {
  const user = await this.findOne({ email }, '+password +tokens');

}

export default model<UserDocument>('User', userSchema);