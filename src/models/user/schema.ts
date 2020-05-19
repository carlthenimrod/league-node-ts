import { Schema, Types } from 'mongoose';
import ObjectId = Types.ObjectId;
import validator from 'validator';

import { Helpers } from './util';
import { addressSchema } from '../address';
import { tokenSchema } from '../token';
import { UserDocument } from './types';
import { 
  notificationSchema, 
  adminUserNotificationSchema, 
  adminTeamNotificationSchema, 
  teamInviteNotificationSchema 
} from '../notification/schema';

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
  comments: { type: String, trim: true },
  teams: [{ ref: 'Team', type: ObjectId }],
  notifications: [notificationSchema]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const notificationsArray = userSchema.path('notifications') as Schema.Types.DocumentArray;

notificationsArray.discriminator('AdminUserNotification', adminUserNotificationSchema);
notificationsArray.discriminator('AdminTeamNotification', adminTeamNotificationSchema);
notificationsArray.discriminator('TeamInviteNotification', teamInviteNotificationSchema);

userSchema.virtual('fullName')
  .get(function(this: UserDocument) {
    return Helpers.getFullName(this.name);
  });

userSchema.virtual('emergency.fullName')
  .get(function(this: UserDocument) {
    return this.emergency && Helpers.getFullName(this.emergency.name);
  });

export default userSchema;