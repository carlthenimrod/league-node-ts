import { ObjectID } from 'mongodb';

import Place, { PlaceDocument } from '@models/place';

describe('Place Model', () => {
  let place: PlaceDocument;

  beforeAll(() => {
    const today = new Date();
    const tomorrow = new Date(today.getDate() + 1);

    place = new Place({
      label: 'Test Place',
      locations: [
        { name: 'Location 1' }, 
        { name: 'Location 2' }, 
        { name: 'Location 3' }
      ],
      address: {
        street: '123 Fake St.',
        city: 'Fake City',
        state: 'ST',
        postal: '12345'
      },
      permits: [{
        start: today.toISOString(),
        end: tomorrow.toISOString(),
        games: [{
          start: today.toISOString(),
          end: tomorrow.toISOString(),
          locations: [new ObjectID(), new ObjectID()]
        },
        {
          start: today.toISOString(),
          end: tomorrow.toISOString(),
          locations: [new ObjectID()]
        }]
      }]
    });
  });

  it('should have all keys', () => {
    expect(
      Object.keys(place.toObject())
    )
    .toEqual(
      expect.arrayContaining([
        '_id',
        'label',
        'address',
        'permits'
      ])
    );
  });

  it('should have 3 locations', () => {
    expect(place.locations).toBeInstanceOf(Array);
    expect(place.locations).toHaveLength(3);
  });

  it('should have 1 permit object', () => {
    expect(place.permits).toHaveLength(1);
    expect(
      Object.keys(place.toObject().permits[0])
    )
    .toEqual(
      expect.arrayContaining([
        'start',
        'end',
        'games'
      ])
    );
  });

  it('first permit should have 2 game objects', () => {
    expect(place.permits[0].games).toHaveLength(2);
    expect(
      Object.keys(place.toObject().permits[0].games[0])
    )
    .toEqual(
      expect.arrayContaining([
        '_id',
        'start',
        'end',
        'locations'
      ])
    )
  })
});