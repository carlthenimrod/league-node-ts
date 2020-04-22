import { dbConnect, dbClose } from '@test/setup';
import League from '@app/models/league';
import leagueFactory from './league.factory';

beforeAll(async () => await dbConnect('test-league-factory'));

afterAll(async () => await dbClose());

afterEach(async () => League.deleteMany({}));

describe('League Factory', () => {
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