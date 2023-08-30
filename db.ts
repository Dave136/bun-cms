import mongoose from "mongoose";

export default async function initConnection() {
  try {
    await mongoose.connect("mongodb://alfagames:alfagames@localhost:27017");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to MongoDB");
  }
}
