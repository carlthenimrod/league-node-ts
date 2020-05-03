import Team, { teamFactory } from '../';

describe('teamFactory.create()', () => {
  it('should return a single team', () => {
    const team = teamFactory.create();

    expect(team).toBeDefined();
    expect(typeof team.name).toBe('string');
    expect(team.status).toBeDefined();
    expect(team.status.new).toBeTruthy();
    expect(team.status.verified).toBeFalsy();
  });

  it('should return 5 teams', () => {
    const teams = teamFactory.create(5);

    expect(teams).toBeInstanceOf(Array);
    expect(teams).toHaveLength(5);
  });
});

describe('teamFactory.save()', () => {
  it('should call save on instance', async () => {
    const mock = jest.fn();
    Team.prototype.save = mock;

    await teamFactory.save();

    expect(mock).toHaveBeenCalled();
  });

  it('should call insertMany', async () => {
    const mock = jest.fn();
    Team.insertMany = mock;

    await teamFactory.save(5);

    expect(mock).toHaveBeenCalled();
  });
});