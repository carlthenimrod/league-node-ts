import userStore from '../user';
import { userFactory } from '@models/user';
import { dbConnect, dbClose } from '@app/test/setup';

afterEach(() => 
  userStore.clear()
);

describe('userStore.get()', () => {
  test('return empty store', () => {
    const users = userStore.get();
    expect(users).toHaveLength(0);
  });

  test('add 3 users, return 2nd (User ID)', () => {
    const testUser = userFactory.create();

    userStore.add(userFactory.create(), 'socketID');
    userStore.add(testUser, 'socketID');
    userStore.add(userFactory.create(), 'socketID');

    const result = userStore.get(testUser._id);
    expect(result?._id).toEqual(testUser._id);

    const users = userStore.get();
    expect(users[1]._id).toEqual(testUser._id);
  });

  test('add 3 users, return 3rd (Socket ID)', () => {
    const testUser = userFactory.create();

    userStore.add(userFactory.create(), 'socketID');
    userStore.add(userFactory.create(), 'socketID');
    userStore.add(testUser, 'socketID1');
    userStore.add(testUser, 'socketID2');

    const result = userStore.get('socketID2');
    expect(result?._id).toEqual(testUser._id);

    const users = userStore.get();
    expect(users[2]._id).toEqual(testUser._id);
  });
});

describe('userStore.add()', () => {
  test('add 3 users to store, check user properties exist', () => {  
    userStore.add(userFactory.create(), 'socketID');
    userStore.add(userFactory.create(), 'socketID');
    userStore.add(userFactory.create(), 'socketID');

    const users = userStore.get();

    expect(users).toHaveLength(3);
    expect(
      Object.keys(users[0])
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'name', 
        'fullName', 
        'email', 
        'status', 
        'sockets'
      ])
    );
  });

  test('add 1 user and push another socket ID', () => {
    const user = userFactory.create();

    userStore.add(user, 'socketID1');
    userStore.add(user, 'socketID2');

    const users = userStore.get();
    
    expect(users).toHaveLength(1);
    expect(users[0].sockets).toHaveLength(2);
    expect(users[0].sockets[0]).toEqual('socketID1');
    expect(users[0].sockets[1]).toEqual('socketID2');
  });
});

describe('userStore.remove()', () => {
  test('add/remove user, store should be empty', () => {
    const user = userFactory.create();
    userStore.add(user, 'socketID');
    userStore.remove(user._id, 'socketID');

    const users = userStore.get();
    expect(users).toHaveLength(0);
  });

  test('add user w/2 sockets, remove 1 socket', () => {
    const user = userFactory.create();

    userStore.add(user, 'socketID1');
    userStore.add(user, 'socketID2');
    userStore.remove(user._id, 'socketID1');

    const users = userStore.get();
    expect(users).toHaveLength(1);
    expect(users[0].sockets).toHaveLength(1);
  });
});

describe('userStore.update()', () => {
  beforeAll(async () => await dbConnect('test-user-store'));

  afterAll(async () => await dbClose());

  test('add/update user properties', async () => {
    const user = await userFactory.save();

    userStore.add(user, 'socketID1');

    const users = userStore.get();

    expect(users).toHaveLength(1);
    expect(users[0].name.first).toEqual(user.name.first);
    expect(users[0].name.last).toEqual(user.name.last);

    user.email = 'foo@bar.com';
    user.name.first = 'Foo';
    user.name.last = 'Bar';
    await user.save();

    await new Promise(resolve =>
      userStore.events.once('updated', () => resolve())
    );

    expect(users[0].email).toEqual('foo@bar.com');
    expect(users[0].name.first).toEqual('Foo');
    expect(users[0].name.last).toEqual('Bar');
    expect(users[0].fullName).toEqual('Foo Bar');
  });
});