import mongoose from 'mongoose';

export const dbConnect = async () => {
  await mongoose.connect(
    'mongodb://localhost:27017/league-ts-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
};

export const dbClose = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};

export const dbClear = async () => {
  const {collections} = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}