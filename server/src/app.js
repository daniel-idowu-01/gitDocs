import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { Strategy as GitHubStrategy } from "passport-github2";
import MongoStore from "connect-mongo";
import bcrypt from "bcrypt";

import { authRoute, repoRoute, adminRoute } from "./routes/index.js";
import { connectDB } from "./config/mongo.js";
import { User } from "./models/index.js";

const app = express();
dotenv.config();

app.set("trust proxy", 1);

await connectDB();

app.use(
  cors({
    origin: "https://getgitdocs.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self' data:; img-src 'self' data:;"
  );
  next();
});

app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
      sameSite: "none",
      domain: "onrender.com",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("=== Session Debug ===");
  console.log("Session:", req.session);
  console.log("Session ID:", req.sessionID);
  console.log("Is Authenticated:", req.isAuthenticated());
  console.log("User:", req.user);
  next();
});

passport.serializeUser((user, done) => {
  console.log("serialized user id", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserialize called with ID:", id);
  try {
    const user = await User.findById(id);
    console.log("Deserialized user:", user);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0]?.value });
        if (!user) {
          const hashedPassword = await bcrypt.hash(
            profile.username,
            Number(process.env.SALT)
          );

          user = await User.create({
            email: profile?.emails[0].value,
            githubUrl: profile.profileUrl,
            githubProfileUrl: profile?.photos[0].value,
            password: hashedPassword,
            emailVerified: true,
            githubUsername: profile.username,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Auth middleware to deserialize user
app.use(async (req, res, next) => {
  console.log("Session user:", req.session);
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      req.user = user;
    } catch (err) {
      console.error("Session user fetch error:", err);
    }
  }
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

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
