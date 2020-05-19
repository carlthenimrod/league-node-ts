import { Schema, Types } from 'mongoose';
import ObjectId = Types.ObjectId;

const notificationSchema = new Schema({
  type: { type: String, required: true },
  action: { type: String, required: true },
  status: {
    read: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const adminUserNotificationSchema = new Schema({
  type: { type: String, default: 'admin' },
  user: { ref: 'User', required: true, type: ObjectId }
});

const adminTeamNotificationSchema = new Schema({
  type: { type: String, default: 'admin' },
  team: { ref: 'Team', required: true, type: ObjectId }
});

const teamInviteNotificationSchema = new Schema({
  type: { type: String, default: 'team' },
  action: { type: String, default: 'invite' },
  team: { ref: 'Team', required: true, type: ObjectId },
  status: {
    pending: { type: Boolean, default: true },
    accepted: { type: Boolean, default: false }
  }
});

export {
  notificationSchema,
  adminUserNotificationSchema,
  adminTeamNotificationSchema,
  teamInviteNotificationSchema
}