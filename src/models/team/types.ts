import { Document, Model } from 'mongoose'

export interface TeamInput {
  name: string;
  status: {
    new: boolean;
    verified: boolean;
  };
  roster: any;
  pending: any;
  feed: any;
  leagues: any;
}

export type TeamResponse = TeamInput & {
  _id: string;
}

export interface TeamModel extends Model<TeamDocument> {
  invite: () => string;
}

export type TeamDocument = Document & TeamInput & TeamResponse;