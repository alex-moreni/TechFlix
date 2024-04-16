import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

//Connect to MongoDB
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL || "";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

mongoose.connection.on("error", (error: Error) => {
  console.log("Error connecting to mongo:", error);
});
