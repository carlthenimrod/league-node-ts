import { Schema, model, Document } from 'mongoose';

/**
 * League data send from user to the server
 */
export interface LeagueInput {
  _id?: string;
  name: string;
}

/**
 * League data send back from server
 */
export type LeagueResponse = LeagueInput & { _id: string };

/**
 * League document returned from league model
 */
export type LeagueDocument = LeagueInput & Document;

const leagueSchema = new Schema({
  name: { type: String, required: true }
});

export default model<LeagueDocument>('League', leagueSchema);