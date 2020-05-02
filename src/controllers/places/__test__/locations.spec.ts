import request from 'supertest';
import { ObjectID } from 'mongodb';

import { dbConnect, dbClose } from '@app/test/setup';
import app from '@app/app';
import Place, { placeFactory, PlaceResponse } from '@models/place';
import { response } from 'express';
import { ErrorResponse } from '@app/models/error';

beforeAll(async () => await dbConnect('test-places'));

afterAll(async () => await dbClose());

afterEach(async () => await Place.deleteMany({}));

describe('POST /places/:id/locations', () => {
  it('should add location - respond w/ updated place', async () => {
    const testPlace = await placeFactory.save();
    const currentTotal = testPlace.locations.length;
    const location = { name: 'Test Location' };

    const response = await request(app)
      .post(`/places/${ testPlace._id }/locations`)
      .send(location);

    const { body: responsePlace, status }:
    { body: PlaceResponse, status: number } = response;

    expect(status).toEqual(200);
    expect(responsePlace.locations).toHaveLength(currentTotal +  1);
    expect(
      responsePlace.locations[responsePlace.locations.length - 1].name
    ).toEqual('Test Location');
  });

  it('should respond with 400 (Invalid ID)', async () => {
    const response = await request(app)
      .post('/places/truck/locations');

    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should respond with 404 (Not Found)', async () => {
    const id = new ObjectID();
    const response = await request(app)
      .post(`/places/${ id }/locations`);

    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});