import { Document } from 'mongoose';

import Place, { placeFactory } from '@models/place';

describe('placeFactory.create', () => {
  it('should return a single place', () => {
    const place = placeFactory.create();

    expect(place).toBeInstanceOf(Document);
  });

  it('should return 5 places', () => {
    const places = placeFactory.create(5);

    expect(places).toBeInstanceOf(Array);
    expect(places).toHaveLength(5);
  });

  it('should have between 0 and 3 locations', () => {
    const place = placeFactory.create();

    expect(place.locations).toBeInstanceOf(Array);
    expect(place.locations.length).toBeGreaterThanOrEqual(0);
    expect(place.locations.length).toBeLessThanOrEqual(3);
  });
});

describe('placeFactory.save', () => {
  it('single call save (instance)', async () => {
    const mock = jest.fn();
    Place.prototype.save = mock;

    await placeFactory.save();
    
    expect(mock).toHaveBeenCalled();
  });

  it('should call insertMany', async () => {
    const mock = jest.fn();
    Place.insertMany = mock;

    await placeFactory.save(5);

    expect(mock).toHaveBeenCalled();
  });
});