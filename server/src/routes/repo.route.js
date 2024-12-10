import expressRouter from "express";
import { authToken } from "../middleware/auth.js";
import { createRepo, generateDocumentation } from "../controllers/repo.controller.js";

const router = expressRouter();

router.post("/repo",/*  authToken, */ createRepo);
router.post("/",/*  authToken, */ generateDocumentation);

export default router;
