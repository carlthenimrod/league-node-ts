import { dbConnect, dbClose } from '@app/test/setup';
import User from '@app/models/user';
import UserFactory from './user.factory';

beforeAll(async () => await dbConnect('test-user-factory'));

afterAll(async () => await dbClose());

afterEach(async () => User.deleteMany({}));

describe('User Factory', () => {
  it('should save/return single user', async () => {
    const user = await UserFactory.save();

    expect(user).toBeInstanceOf(User);
    expect(user).toBeTruthy();
  });

  it('should save/return multiple users', async () => {
    const users = await UserFactory.save(5);

    expect(users).toHaveLength(5);
    users.forEach(
      user => expect(user).toBeInstanceOf(User)
    );
  });
});