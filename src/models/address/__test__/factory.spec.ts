import { AddressFactory } from '../'

describe('Address Factory', () => {
  it('should return single address', () => {
    const address = AddressFactory.create();

    expect(
      Object.keys(address)
    )
    .toEqual(
      expect.arrayContaining([
        'street', 
        'city', 
        'state', 
        'postal'
      ])
    );
  });

  it('should return 5 addresses', () => {
    const addresses = AddressFactory.create(5);

    expect(addresses).toBeInstanceOf(Array);
    expect(addresses).toHaveLength(5);
  });
});