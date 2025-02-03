import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Router from "./routes/Routes.js";

// Load environment variables
dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
app.use(express.json());
// Connecting Routes with express backend.
app.use("/", Router);
// Build MongoDB connection string from environment variables.
const MONGO_URI = `mongodb+srv://vishnusathyanathan:1234@cluster0.wudzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const PORT =  5000;

// will Start the server and connect to the database
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected");
    app.listen(PORT, () => {
      console.log(`Test 2 Backend Initiated on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
startServer();
