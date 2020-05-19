import { Document } from 'mongoose';

import { UserDocument } from '@models/user';
import { TeamDocument } from '@models/team';

export interface NotificationDocument extends Document {
  _id: string;
  type: string;
  action: string;
  status: {
    read: boolean;
  }
}

export interface AdminUserNotificationDocument extends NotificationDocument {
  user: UserDocument | string;
}

export interface AdminTeamNotificationDocument extends NotificationDocument {
  team: TeamDocument | string;
}

export interface TeamInviteNotificationDocument extends NotificationDocument {
  team: TeamDocument | string;
  status: {
    read: boolean;
    pending: boolean;
    accepted: boolean;
  }
}