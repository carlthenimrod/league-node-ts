import { ObjectID } from 'mongodb';
import { Error as MongooseError } from 'mongoose';

import { dbConnect, dbClose } from '@app/test/setup';
import { Notification, AdminUserNotification, AdminTeamNotification, TeamInviteNotification } from '@models/notification';

beforeAll(async () => await dbConnect('test-notification-model'));

afterAll(async () => await dbClose());

afterEach(async () => await Notification.deleteMany({}));

describe('new Notification()', () => {
  it('should save new notification', async () => {
    const notification = new Notification({
      type: 'test',
      action: 'testAction'
    });

    await notification.validate();

    console.log(notification);

    await expect(notification.save()).resolves.toBeInstanceOf(Notification);
    expect(
      Object.keys(notification.toObject())
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'type', 
        'action', 
        'status', 
        'createdAt', 
        'updatedAt'
      ])
    );
  });

  it('should throw mongoose error (Invalid Data)', async () => {
    const notification = new Notification();

    await expect(notification.save()).rejects.toBeInstanceOf(MongooseError);
  });
});

describe('new AdminUserNotification()', () => {
  it('should save new admin user notification', async () => {
    const id = new ObjectID();
    const adminUserNotification = new AdminUserNotification({
      action: 'new',
      user: id
    });

    await expect(adminUserNotification.save()).resolves.toBeInstanceOf(AdminUserNotification);
    expect(adminUserNotification.type).toEqual('admin');
    expect(
      Object.keys(adminUserNotification.toObject())
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'type', 
        'action', 
        'status',
        'user', 
        'createdAt', 
        'updatedAt'
      ])
    );
  });

  it('should throw mongoose error (Invalid Data)', async () => {
    const adminUserNotification = new AdminUserNotification({
      action: 'new'
    });

    await expect(adminUserNotification.save()).rejects.toBeInstanceOf(MongooseError);
  });
});

describe('new AdminTeamNotification()', () => {
  it('should save new admin user notification', async () => {
    const id = new ObjectID();
    const adminTeamNotification = new AdminTeamNotification({
      action: 'new',
      team: id
    });

    await expect(adminTeamNotification.save()).resolves.toBeInstanceOf(AdminTeamNotification);
    expect(adminTeamNotification.type).toEqual('admin');
    expect(
      Object.keys(adminTeamNotification.toObject())
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'type', 
        'action', 
        'status',
        'team', 
        'createdAt', 
        'updatedAt'
      ])
    );
  });

  it('should throw mongoose error (Invalid Data)', async () => {
    const adminTeamNotification = new AdminTeamNotification({
      action: 'new'
    });

    await expect(adminTeamNotification.save()).rejects.toBeInstanceOf(MongooseError);
  });
});

describe('new TeamInviteNotification()', () => {
  it('should save new team invite notification', async () => {
    const id = new ObjectID();
    const adminTeamNotification = new TeamInviteNotification({
      team: id
    });

    await expect(adminTeamNotification.save()).resolves.toBeInstanceOf(TeamInviteNotification);
    expect(adminTeamNotification.type).toEqual('team');
    expect(
      Object.keys(adminTeamNotification.toObject())
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'type', 
        'action', 
        'status',
        'team', 
        'createdAt', 
        'updatedAt'
      ])
    );
  });

  it('should throw mongoose error (Invalid Data)', async () => {
    const teamInviteNotification = new TeamInviteNotification();

    await expect(teamInviteNotification.save()).rejects.toBeInstanceOf(MongooseError);
  });
});