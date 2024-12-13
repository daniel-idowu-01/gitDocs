import expressRouter from "express";
import passport from "passport";
import { authToken } from "../middleware/auth.js";
import {
  createUser,
  login,
  changePassword,
  confirmEmail,
} from "../controllers/auth.controller.js";

const router = expressRouter();

router.post("/", createUser);
router.post("/login", login);
router.put("/change-password", authToken, changePassword);
router.get("/confirm-email/:emailToken", confirmEmail);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email", "repo"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    console.log(req)
    // Successful authentication, redirect or respond with user data
    res.redirect("http://localhost:5173/");
  }
);

export default router;
