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
  passport.authenticate("github", {
    failureRedirect: "/",
    session: true,
    failureMessage: true,
  }),
  (req, res) => {
    console.log("=== GitHub Callback Debug ===");
    console.log("User after auth:", req.user);
    console.log("Session after auth:", req.session);
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("Session ID:", req.sessionID);

    res.redirect(`${process.env.FRONTEND_URL}`);
  }
);

export default router;
