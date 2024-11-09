import cors from "cors";
import express from "express";
import dotenv from "dotenv";
// import { connectDB } from "./config/mongo.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// await connectDB();
const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;

app.get("/", (req, res) => {
  res.send("App is running!!");
});

app.post("/repo", (req, res) => {
  const { githubUrl } = req.body;

  const match = githubUrl.match(regex);

  if (match) {
    const username = match[1];
    const repo = match[2];

    console.log("Username:", username);
    console.log("Repository:", repo);
  } else {
    console.log("No match found");
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;

//github token: 
