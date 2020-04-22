import bcrypt from 'bcrypt';

import { dbConnect, dbClose } from '@app/test/setup';
import User from './user';
import UserFactory from '@app/util/factory/user.factory';

beforeAll(async () => await dbConnect('test-user-model'));

afterAll(async () => await dbClose());

afterEach(async () => await User.deleteMany({}));

describe('User Model', () => {
  it('should return user', async () => {
    const user = await UserFactory.save();

    expect(user).toBeTruthy();
    expect(user).toBeInstanceOf(User);
  });

  it('should throw an error (Validation Error)', () => {
    const user = new User();

    expect(user.save()).rejects.toThrowError();
  });

  it('should have full name virtual', async () => {
    const user = await UserFactory.save();

    expect(user.fullName).toEqual(user.name.first + ' ' + user.name.last);
  });

  it('should hash password', async () => {
    const user = await UserFactory.save();

    const newPassword = 'New Password';
    user.password = newPassword;
    await user.save();

    expect(newPassword).not.toEqual(user.password);
    expect(
      bcrypt.compare(newPassword, user.password)
    )
    .resolves
    .toBeTruthy();
  });
});