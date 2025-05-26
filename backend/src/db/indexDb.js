import mongoose from "mongoose";

const URI = process.env?.URI || "";
if (!URI) {
  console.error("No URI found. Please set the URI environment variable.");
}


const ConnectDb = async (req, res) => {
  try {
    const connectToDb = await mongoose.connect(URI)
    if (!connectToDb) {
      console.log("Error connecting to database")
      res.status(500).json({ message: "Error connecting to database" });
      process.exit(1)
    } else {
      console.log("Connected to database" + connectToDb.connection.readyState + " " + connectToDb.connection.host)
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error connecting to database" });
  }
}

export default ConnectDb