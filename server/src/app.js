import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { authRoute, repoRoute, adminRoute } from "./routes/index.js";
import { connectDB } from "./config/mongo.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();


app.get("/", (req, res) => {
  res.send("App is running!!");
});

app.use('/api/docs', repoRoute)
app.use('/api/auth', authRoute)
app.use('/api/admin', adminRoute)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;
