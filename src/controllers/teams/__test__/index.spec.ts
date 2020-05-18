import request from 'supertest';
import { ObjectID } from 'mongodb';

import app from '@app/app';
import { dbConnect, dbClose } from '@app/test/setup';
import Team, { TeamResponse, teamFactory } from '@models/team';
import { ErrorResponse } from '@app/models/error';

beforeAll(async () => await dbConnect('test-teams-controller'));

afterAll(async () => await dbClose());

afterEach(async () => await Team.deleteMany({}));

describe('GET teams/', () => {
  it('should return empty array', async () => {
    const response = await request(app).get('/teams');

    const { body: teams, status }:
    { body: TeamResponse[], status: number } 
    = response;

    expect(status).toEqual(200);
    expect(teams).toHaveLength(0);
  });

  it('should return 3 teams', async () => {
    await teamFactory.save(3);

    const response = await request(app).get('/teams');

    const { body: teams, status }:
    { body: TeamResponse[], status: number } 
    = response;

    expect(status).toEqual(200);
    expect(teams).toHaveLength(3);
  });
});

describe('GET teams/:id', () => {
  it('should save/return team', async () => {
    const testTeam = await teamFactory.save();

    const response = await request(app).get(`/teams/${ testTeam._id }`);
    const { body: responseTeam, status }: 
    { body: TeamResponse, status: number } 
    = response;

    expect(status).toEqual(200);
    expect(testTeam.name).toEqual(responseTeam.name);
    expect(
      Object.keys(responseTeam)
    ).toEqual(
      expect.arrayContaining(['_id', 'name'])
    );
  });

  it('should return 400 (ID Invalid)', async () => {
    const response = await request(app).get('/teams/truck');

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Team not found)', async () => {
    const id = new ObjectID();
    const response = await request(app).get(`/teams/${ id }`);

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});

describe('POST teams/', () => {
  it('should save/return team', async () => {
    const testTeam = teamFactory.create();

    const response = await request(app)
      .post('/teams')
      .send(testTeam);

    const { body: responseTeam, status }:
    { body: TeamResponse, status: number } 
    = response;

    expect(status).toEqual(200);
    expect(testTeam.name).toEqual(responseTeam.name);
    expect(
      Object.keys(responseTeam)
    ).toEqual(
      expect.arrayContaining(['_id', 'name'])
    );
  });

  it('should return 422 (Invalid data)', async () => {
    const response = await request(app).post('/teams');

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');
  });
});

describe('PUT teams/:id', () => {
  it('should update/return team', async () => {
    const testTeam = await teamFactory.save();
    testTeam.name = 'New Team Name';

    const response = await request(app)
      .put(`/teams/${ testTeam._id }`)
      .send(testTeam);

    const { body: responseTeam, status }:
    { body: TeamResponse, status: number } = response;

    expect(status).toEqual(200);
    expect(testTeam.name).toEqual(responseTeam.name);
  });

  it('should return 400 (ID Invalid)', async () => {
    const response = await request(app).put('/teams/truck');

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Team not found)', async () => {
    const id = new ObjectID();
    const response = await request(app).put(`/teams/${ id }`);

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });

  it('should return 422 (Invalid Data)', async () => {
    const testTeam = await teamFactory.save();
    testTeam.name = '';
  
    const response = await request(app)
      .put(`/teams/${ testTeam._id }`)
      .send(testTeam);

    const { body: error, status }:
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(422);
    expect(error).toHaveProperty('message');
  });
});

describe('DELETE teams/:id', () => {
  it('should remove team (empty response)', async () => {
    const testTeam = await teamFactory.save();
    
    const response = await request(app).delete(`/teams/${ testTeam._id }`);

    const { body, status }: 
    { body: void, status: number } 
    = response;

    expect(status).toEqual(200);
    expect(body).toEqual({});
  });

  it('should return 400 (Invalid ID)', async () => {
    const response = await request(app).delete('/teams/truck');

    const { body: error, status }: 
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(400);
    expect(error).toHaveProperty('message');
  });

  it('should return 404 (Team not found)', async () => {
    const id = new ObjectID();
    const response = await request(app).delete(`/teams/${ id }`);

    const { body: error, status }: 
    { body: ErrorResponse, status: number } 
    = response;

    expect(status).toEqual(404);
    expect(error).toHaveProperty('message');
  });
});