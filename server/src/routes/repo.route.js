import expressRouter from "express";
import { authToken } from "../middleware/auth.js";
import { generateDocumentation } from "../controllers/repo.controller.js";

const router = expressRouter();

router.post("/", generateDocumentation);

export default router;
