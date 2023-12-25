import { Router } from "express";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { getURL } from "./translator.controller.js";
const router = Router();

// get url from user
router.post("/upload", isAuthenticated, getURL);


export default router;