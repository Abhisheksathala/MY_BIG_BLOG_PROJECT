import mongoose from "mongoose";

const URI = process.env?.URI || "";
if (!URI) {
  console.error("No URI found. Please set the URI environment variable.");
}


const ConnectDb = async () => {
  try {
    const connectToDb = await mongoose.connect(URI)
    if (!connectToDb) {
      console.log("Error connecting to database")
      process.exit(1)
    } else {
      console.log("Connected to database " + connectToDb.connection.readyState + " " + connectToDb.connection.host)
    }
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}

export default ConnectDb