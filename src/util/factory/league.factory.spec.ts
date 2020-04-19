import { dbConnect, dbClose, dbClear } from '@test/setup';
import League from '@app/models/league';
import leagueFactory from './league.factory';

beforeAll(async () => {
  await dbConnect();
  await dbClear();
});

afterAll(async () => {
  await dbClear();
  await dbClose();
});

describe('League Factory', () => {
  afterEach(async () => League.deleteMany({}));

  it('should save/return single league', async () => {
    const league = await leagueFactory();

    expect(league).toBeInstanceOf(League);
    expect(league).toBeTruthy();
  });

  it('should save/return multiple leagues', async () => {
    const leagues = await leagueFactory(5);

    expect(leagues).toHaveLength(5);
    leagues.forEach(
      league => expect(league).toBeInstanceOf(League)
    );
  });
});