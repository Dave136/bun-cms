import mongoose from "mongoose";

const NODE_ENV = process.env.NODE_ENV || "development";
const uri =
  NODE_ENV === "production"
    ? (process.env.MONGO_URI as string)
    : "mongodb://alfagames:alfagames@localhost:27017";

async function initConnection() {
  try {
    await mongoose.connect(uri);
    console.log(`[${NODE_ENV}] Connected to MongoDB`);
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to MongoDB");
  }
}

initConnection();
