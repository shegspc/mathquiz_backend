import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import multiplicationResultRoute from "./routes/multiplicationResult.js";
import arithmeticResultRoute from "./routes/arithmeticResult.js"
import authRoute from "./routes/auth.js"
import usersRoute from "./routes/users.js";
import cors from "cors";
//const bodyParser = require('body-parser');

const app = express();

// to grant access from  frontend API request 
 const corsOptions = {
  origin: "https://mymathquizapp.onrender.com"
 }


// Connection from backend to Mongo DB

import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    // console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// middlewares
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json()) 
app.use("/backend/multiplicationResult", multiplicationResultRoute);
app.use("/backend/arithmeticResult", arithmeticResultRoute);
app.use("/backend/auth", authRoute);
app.use("/backend/users", usersRoute); 
  
// Connection from frontend to backend
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});


app.listen(8800, () => {
    connect();
    // console.log("Connected to backend.");
  });