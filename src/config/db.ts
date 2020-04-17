import mongoose from 'mongoose';

import { db } from './';

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});