import User, { UserDocument } from '@app/models/user';
import faker from 'faker';

namespace UserFactory {
  /**
   * Creates/returns new user document
   */
  export function create(): UserDocument {
    return new User({
      name: {
        first: faker.name.firstName(),
        last: faker.name.lastName()
      },
      email: faker.internet.email(),
      password: faker.internet.password(),
      img: faker.internet.avatar(),
      address: {
        street: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        postal: faker.address.zipCode()
      },
      phone: faker.phone.phoneNumberFormat(),
      secondary: faker.phone.phoneNumberFormat(),
      emergency: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName()
        },
        phone: faker.phone.phoneNumberFormat(),
        secondary: faker.phone.phoneNumberFormat()
      },
      comments: faker.lorem.paragraph()
    });
  }

  /**
   * Creates a new user document and saves to database
   * @param total number of users to create
   */
  export async function save(): Promise<UserDocument>;
  export async function save(total: number): Promise<UserDocument[]>;
  export async function save(total?: number): Promise<UserDocument|UserDocument[]> {
    if (total && Number.isInteger(total)) {
      const users: UserDocument[] = [];
      
      for (let i = 0; i < total; i++) {
        users.push(create());
      }

      return await User.insertMany(users);
    } else {
      const user = create();
      return await user.save();
    }
  }
}

export default UserFactory;