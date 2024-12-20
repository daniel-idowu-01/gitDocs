import expressRouter from "express";
import { createRepo, generateDocumentation, getUserGithubRepos } from "../controllers/repo.controller.js";

const router = expressRouter();

router.post("/repo", createRepo);
router.post("/", generateDocumentation);
router.post("/user/repos", getUserGithubRepos);

export default router;