import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Strategy as GitHubStrategy } from "passport-github2";
import { authRoute, repoRoute, adminRoute } from "./routes/index.js";
import { connectDB } from "./config/mongo.js";
import { User } from "./models/index.js";
import bcrypt from "bcrypt";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ email: profile.emails[0]?.value });
      if (user) {
        return done(null, user);
      }
      const hashedPassword = await bcrypt.hash(
        profile.username,
        Number(process.env.SALT)
      );
      // Save user data in the database or session
      await User.create({
        email: profile?.emails[0].value,
        githubUrl: profile.profileUrl,
        githubProfileUrl: profile?.photos[0].value,
        password: hashedPassword,
        emailVerified: true,
        githubUsername: profile.username,
      });
      return done(null, { profile, accessToken });
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user, done) => {
  done(null, user);
});

await connectDB();

app.get("/", (req, res) => {
  res.send("App is running!");
});

app.use("/api/docs", repoRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});

export default app;
