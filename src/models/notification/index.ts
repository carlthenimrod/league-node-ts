import { model } from 'mongoose';

import { 
  notificationSchema, 
  adminUserNotificationSchema,
  adminTeamNotificationSchema,
  teamInviteNotificationSchema
} from './schema';

import { 
  NotificationDocument,
  AdminUserNotificationDocument,
  AdminTeamNotificationDocument,
  TeamInviteNotificationDocument
} from './types';

export * from './types';

export const Notification = model<NotificationDocument>(
  'Notification', 
  notificationSchema
);

export const AdminUserNotification = Notification.discriminator<AdminUserNotificationDocument>(
  'AdminUserNotification', 
  adminUserNotificationSchema
);

export const AdminTeamNotification = Notification.discriminator<AdminTeamNotificationDocument>(
  'AdminTeamNotification', 
  adminTeamNotificationSchema
);

export const TeamInviteNotification = Notification.discriminator<TeamInviteNotificationDocument>(
  'TeamInviteNotification',
  teamInviteNotificationSchema
);