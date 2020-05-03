import Team, { TeamDocument } from '@models/team';

const colors = [
  'Blue', 'Red', 'Green', 'Purple', 'Orange', 'Grey', 'Black', 
  'Pink', 'Rainbow', 'Gold', 'Silver', 'Brown'
];

const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

const animals = [
  'Pandas', 'Anacondas', 'Monkeys', 'Wolves', 'Hawks', 'Eagles', 
  'Tigers', 'Frogs', 'Dragons', 'Wookies', 'Dinosaurs'
];

const randomAnimals = () => {
  return animals[Math.floor(Math.random() * colors.length)];
};

const generateTeam = (): TeamDocument => {
  return new Team({
    name: `${ randomColor() } ${ randomAnimals() }`
  });
};

export function create(): TeamDocument;
export function create(total: number): TeamDocument[];
export function create(total?: number): TeamDocument|TeamDocument[] {
  if (total && Number.isInteger(total) && total > 1) {
    const teams: TeamDocument[] = [];

    let i = 0;
    while (i < total) {
      const team = generateTeam();
      teams.push(team);
      ++i;
    }

    return teams;
  } else {
    return generateTeam();
  }
}

export async function save(): Promise<TeamDocument>;
export async function save(total: number): Promise<TeamDocument[]>;
export async function save(total?: number): Promise<TeamDocument|TeamDocument[]> {
  if (total && Number.isInteger(total) && total > 1) {
    return Team.insertMany(create(5));
  } else {
    return create().save();
  }
}