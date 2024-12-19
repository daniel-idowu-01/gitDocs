import expressRouter from "express";
import passport from "passport";
import { authToken } from "../middleware/auth.js";
import {
  createUser,
  login,
  changePassword,
  confirmEmail,
  checkAuth,
} from "../controllers/auth.controller.js";

const router = expressRouter();

router.post("/", createUser);
router.post("/login", login);
router.put("/change-password", authToken, changePassword);
router.get("/confirm-email/:emailToken", confirmEmail);
router.get("/check-auth", checkAuth);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/", session: true }),
  (req, res) => {
    // Successful authentication, redirect or respond with user data
    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

export default router;
