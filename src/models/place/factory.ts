import faker from 'faker';

import Place, { PlaceDocument } from '@models/place';
import { AddressFactory } from '@models/address';

const labels = [
  `The #name`,
  `#name Field`, 
  `#name Courts`
];

const getLabel = (): string => {
  let label = labels[
    Math.floor(Math.random() * labels.length)
  ];

  label = label.replace('#name', faker.address.streetSuffix());

  return label;
}

const createLocations = (label: string): { name: string }[] => {
  const locations: { name: string }[] = [];
  const total = Math.floor(Math.random() * 4);

  for (let i = 0; i < total; i++) {
    locations.push({
      name: `${ label } #${ i + 1 }`
    });
  }

  return locations;
}

const generatePlace = (): PlaceDocument => {
  const label = getLabel();
  const address = AddressFactory.create();
  const locations = createLocations(label);

  return new Place({
    label,
    address,
    locations
  });
}

export function create(): PlaceDocument;
export function create(total: number): PlaceDocument[];
export function create(total?: number): PlaceDocument | PlaceDocument[] {
  if (total && Number.isInteger(total) && total > 1) {
    const places: PlaceDocument[] = [];

    for (let i = 0; i < total; i++) {
      places.push(generatePlace());
    }

    return places;
  } else {
    return generatePlace();
  }
};

export function save(): Promise<PlaceDocument>;
export function save(total: number): Promise<PlaceDocument[]>;
export function save(total?: number): Promise<PlaceDocument|PlaceDocument[]> {
  if (total && Number.isInteger(total) && total > 0) {
    return Place.insertMany(create(total));
  } else {
    return create().save();
  }
};