import mongoose from "mongoose";

const initiateMongoServer = async (): Promise<void> => {
  const MONGO_URL: string = process.env.DATABASE as string;

  try {
    await mongoose.connect(MONGO_URL);
    console.info("Connected to DB");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default initiateMongoServer;
