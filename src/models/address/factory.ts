import faker from 'faker';

import { Address } from './types';

const generateAddress = (): Address => {
  return {
    street: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    postal: faker.address.zipCode()
  };
}

export const create = (total?: number): Address | Address[] => {
  if (total && Number.isInteger(total) && total > 1) {
    const address: Address[] = [];

    for (let i = 0; i < total; i++) {
      address.push(generateAddress());
    }

    return address;
  } else {
    return generateAddress();
  }
};