import Game, { GameDocument } from '../';

describe('Game Model', () => {
  let game: GameDocument;
  
  beforeAll(() => {
    game = new Game({
      home: {
        name: 'Home Team',
        score: 3
      },
      away: {
        name: 'Away Team',
        score: 5
      },
      start: new Date().toISOString(),
      time: true,
      place: null
    });
  });

  it('should contain all keys', () => {
    expect(
      Object.keys(game.toObject())
    )
    .toEqual(
      expect.arrayContaining([
        '_id', 
        'home', 
        'away', 
        'start', 
        'time', 
        'place'
      ])
    );
  });

  it('should have home team with score of 3', () => {
    expect(game.home).toBeDefined();
    expect(game.home.name).toEqual('Home Team');
    expect(game.home.score).toEqual(3);
  });

  it('should have away team with score of 5', () => {
    expect(game.away).toBeDefined();
    expect(game.away.name).toEqual('Away Team');
    expect(game.away.score).toEqual(5);
  });

  it('should have start set to date', () => {
    expect(game.start).toBeInstanceOf(Date);
  });

  it('should have time set true', () => {
    expect(game.time).toBeTruthy();
  });
});