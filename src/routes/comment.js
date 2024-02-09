import { Router } from "express";
import { getComments } from "../controllers/comment.js";
import { validateAuthentication } from "../middleware/auth.js";

const router = Router()

router.get('/', validateAuthentication, getComments)

export default router