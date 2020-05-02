import request from 'supertest';
import { ObjectID } from 'mongodb';

import { dbConnect, dbClose } from '@app/test/setup';
import app from '@app/app';
import Place, { placeFactory, PlaceResponse } from '@models/place';
import { ErrorResponse } from '@app/models/error';

beforeAll(async () => await dbConnect('test-places'));

afterAll(async () => await dbClose());

afterEach(async () => await Place.deleteMany({}));

describe('GET /places', () => {
  it('should respond with empty array', async () => {
    const response = await request(app).get('/places');
    const { body: places, status }:
    { body: PlaceResponse, status: number } = response;
  
    expect(status).toEqual(200);
    expect(places).toBeInstanceOf(Array);
    expect(places).toHaveLength(0);
  });

  it('should respond with 5 places', async () => {
    await placeFactory.save(5);

    const result = await request(app).get('/places');
    const { body: places, status }: 
    { body: PlaceResponse[], status: number } = result;

    expect(status).toEqual(200);
    expect(places).toBeInstanceOf(Array);
    expect(places).toHaveLength(5);
  });
});

describe('GET /places/:id', () => {
  it('should respond with place', async () => {
    const testPlace = await placeFactory.save();

    const response = await request(app).get(`/places/${ testPlace._id }`);
    const { body: responsePlace, status }:
    { body: PlaceResponse, status: number } = response;

    expect(status).toEqual(200);
    expect(testPlace.label).toEqual(responsePlace.label);
    expect(
      Object.keys(responsePlace)
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'label', 
        'locations', 
        'address', 
        'permits'
      ])
    );
  });

  it('should respond with 400 (Invalid ID)', async () => {
    const response = await request(app).get('/places/truck');
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should respond with 404 (Not Found)', async () => {
    const id = new ObjectID();

    const response = await request(app).get(`/places/${ id }`);
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST /places', () => {
  it('should save/respond with place', async () => {
    const testPlace = placeFactory.create();
  
    const response = await request(app)
      .post('/places')
      .send(testPlace);
  
    const { body: responsePlace, status }:
    { body: PlaceResponse, status: number } = response;
  
    expect(status).toEqual(200);
    expect(
      Object.keys(responsePlace)
    ).toEqual(
      expect.arrayContaining([
        '_id', 
        'label', 
        'address', 
        'locations', 
        'permits'
      ])
    )
  });

  it('should respond with 422 (Invalid Data)', async () => {
    const response = await request(app).post('/places');
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');
  });
});

describe('PUT /places/:id', () => {
  it('should update/respond with place', async () => {
    const testPlace = await placeFactory.save();
    testPlace.label = 'Updated Label';
  
    const response = await request(app)
      .put(`/places/${ testPlace._id }`)
      .send(testPlace);
    
    const { body: responsePlace, status }:
    { body: PlaceResponse, status: number } = response;

    expect(status).toEqual(200);
    expect(responsePlace.label).toEqual(testPlace.label);
  });

  it('should respond with 400 (Invalid ID)', async () => {
    const response = await request(app).put('/places/truck');
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should respond with 404 (Not Found)', async () => {
    const id = new ObjectID();

    const response = await request(app).put(`/places/${ id }`);
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('DELETE /places', () => {
  it('should remove place (empty response)', async () => {
    const testPlace = await placeFactory.save();

    const response = await request(app)
      .delete(`/places/${ testPlace._id }`);

    const { body, status }: 
    { body: {}, status: number } = response;

    expect(status).toBe(200);
    expect(body).toEqual({});
  });

  it('should respond with 400 (Invalid ID)', async () => {
    const response = await request(app).delete('/places/truck');
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should respond with 404 (Not Found)', async () => {
    const id = new ObjectID();

    const response = await request(app).delete(`/places/${ id }`);
    const { body: error, status }:
    { body: ErrorResponse, status: number } = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});