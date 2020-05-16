import mongoose from 'mongoose';

const dbClear = async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

export const dbConnect = async (dbName: string) => {
  await mongoose.connect(
    `mongodb://localhost:27017/${ dbName }?replicaSet=rs0`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  await dbClear();
};

export const dbClose = async () => {
  await dbClear();
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};