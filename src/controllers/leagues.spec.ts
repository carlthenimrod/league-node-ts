import request from 'supertest';
import { ObjectID } from 'mongodb';

import { dbConnect, dbClose, dbClear } from '@test/setup';
import app from '@app/app';
import League, { LeagueDocument } from '@models/league';
import { ErrorResponse } from '@app/middleware/error-handler';

beforeAll(async () => {
  await dbConnect();
  await dbClear();
});

afterAll(async () => {
  await dbClear();
  await dbClose();
});

const createLeague
: () => Promise<LeagueDocument> 
= async () => {
  const league = new League({ name: 'League 1' });
  await league.save();
  return league;
};

const removeLeague
: (league: LeagueDocument) => Promise<void> 
= async league => {
  await League.deleteOne({ _id: league._id });
};

describe('GET /leagues', () => {
  it('should return empty array', async () => {
    const result = await request(app).get('/leagues');
    const { body: leagues, status }: 
    { body: LeagueDocument[], status: number } 
    = result;

    expect(status).toEqual(200);
    expect(leagues).toHaveLength(0);
  });
});

describe('GET /leagues/:id', () => {
  it('should return league', async () => {
    const testLeague = await createLeague();

    const result = await request(app).get(`/leagues/${ testLeague._id }`);
    const { body: league, status }: 
    { body: LeagueDocument, status: number } 
    = result;

    expect(status).toEqual(200);
    expect(league._id).toEqual(testLeague._id.toString());
    expect(league.name).toEqual(testLeague.name);

    await removeLeague(testLeague._id);
  });

  it('should return 400 (Invalid ID)', async () => {
    const result = await request(app).get('/leagues/truck');
    const { body: error, status }:
    { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Not Found)', async () => {
    const id = new ObjectID();
    const result = await request(app).get(`/leagues/${ id }`);
    const { body: error, status }:
    { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST /leagues', () => {
  it('should insert/return new league', async () => {
    const newLeague = new League({ name: 'League 1' });

    const result = await request(app).post('/leagues').send(newLeague);
    const { body: responseLeague, status }:
    { body: LeagueDocument, status: number }
    = result;

    expect(status).toEqual(200);
    expect(responseLeague.name).toEqual(newLeague.name);
  });

  it('should return error 422 (Failed Validation)', async () => {
    const newLeague = new League();

    const result = await request(app)
      .post('/leagues')
      .send(newLeague);
    
    const { body: error, status }:
    { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');
  });
});

describe('PUT /leagues/:id', () => {
  it('should update/return league', async () => {
    const testLeague = await createLeague();
    const updatedLeague = { ...testLeague.toObject(), name: 'New League 1' };

    const result = await request(app)
      .put(`/leagues/${ updatedLeague._id }`)
      .send(updatedLeague);
    
    const { body: responseLeague, status }
    : { body: LeagueDocument, status: number }
    = result;

    expect(status).toBe(200);
    expect(responseLeague.name).toEqual(updatedLeague.name);
    expect(testLeague.name).not.toEqual(updatedLeague.name);

    await removeLeague(testLeague._id);
  });

  it('should return 400 (Invalid ID)', async () => {
    const result = await request(app)
      .put('/leagues/truck');

    const { body: error, status }:
    { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Not Found)', async () => {
    const id = new ObjectID();
    
    const result = await request(app)
      .put(`/leagues/${ id }`);

    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });

  it('should return 422 (Failed Validation)', async () => {
    const testLeague = await createLeague();
    const updatedLeague = { ...testLeague.toObject(), name: '' };

    const result = await request(app)
      .put(`/leagues/${ updatedLeague._id }`)
      .send(updatedLeague);

    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');

    await removeLeague(testLeague._id);
  });
});

describe('DELETE /leagues/:id', () => {
  it('should remove league', async () => {
    const testLeague = await createLeague();

    const result = await request(app)
      .delete(`/leagues/${ testLeague._id }`);

    const { body, status }
    : { body: {}, status: number } 
    = result;

    expect(status).toEqual(200);
    expect(body).toEqual({});
  });
  
  it('should return 400 (Invalid ID)', async () => {
    const result = await request(app)
      .delete('/leagues/truck');

    const { body: error, status }
    : { body: Error, status: number }
    = result;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Not Found)', async () => {
    const id = new ObjectID();
    
    const result = await request(app)
      .delete(`/leagues/${ id }`);

    const { body: error, status }
    : { body: ErrorResponse, status: number }
    = result;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});