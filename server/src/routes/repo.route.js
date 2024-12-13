import expressRouter from "express";
import { authToken } from "../middleware/auth.js";
import { createRepo, generateDocumentation, getUserGithubRepos } from "../controllers/repo.controller.js";

const router = expressRouter();

router.post("/repo",/*  authToken, */ createRepo);
router.post("/",/*  authToken, */ generateDocumentation);
router.post("/user/repos",/*  authToken, */ getUserGithubRepos);

export default router;