import League, { LeagueDocument } from '@models/league';

/**
 * Creates a new league document and saves to database
 * @param total number of leagues to create
 */
async function createLeague(): Promise<LeagueDocument>;
async function createLeague(total: number): Promise<LeagueDocument[]>;
async function createLeague(total?: number): Promise<LeagueDocument|LeagueDocument[]> {
  if (total && Number.isInteger(total)) {
    const leagues: LeagueDocument[] = [];

    for (let i = 0; i < total; ++i) {
      const league = new League({ name: `League ${ i + 1 }` });
      leagues.push(league);
    }

    return League.insertMany(leagues);
  } else {
    const league = new League({ name: 'New League' });
    return league.save();
  }
};

export default createLeague;