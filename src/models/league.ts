import { Schema, model, Document } from 'mongoose';

export interface LeagueDocument extends Document {
  name: string;
}

const leagueSchema = new Schema({
  name: { type: String, required: true }
});

export default model<LeagueDocument>('League', leagueSchema);