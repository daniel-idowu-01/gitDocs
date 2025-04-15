import expressRouter from "express";
import {
  createRepo,
  generateDocumentation,
  getUserGithubRepos,
  getRepoCommit,
} from "../controllers/repo.controller.js";

const router = expressRouter();

router.post("/repo", createRepo);
router.post("/", generateDocumentation);
router.post("/user/repos", getUserGithubRepos);
router.post("/repos/commits", getRepoCommit);

export default router;
