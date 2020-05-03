import { Schema } from 'mongoose';
import ObjectId = Schema.Types.ObjectId;

const rosterSchema = new Schema({
  user: { 
    type: ObjectId, 
    ref: 'User' 
  },
  roles: [String]
}, { _id: false });

const feedSchema = new Schema({
  type: String,
  body: String,
  from: { 
    type: ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    new: {
      type: Boolean,
      default: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  roster: [rosterSchema],
  pending: [rosterSchema],
  feed: [feedSchema],
  leagues: [{ type: ObjectId, ref: 'League' }]
});

export default teamSchema;