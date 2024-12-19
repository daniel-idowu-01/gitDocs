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

await connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.BASE_URL,
];

app.use(cors({
  origin: "https://getgitdocs.netlify.app",
  credentials: true,
}));
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

// Configure session middleware
app.use(
  session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
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

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log('errrrrrrrrrr', err)
    done(err, null);
  }
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
