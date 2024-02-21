import { Router } from "express";
import { isAuthenticated } from "../../middlewares/Authentication.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { newMovie } from "./movies.controller.js";
const router = Router();

// add movie
router.post("/addNew", isAuthenticated, newMovie);
// get all movies

// get single movie

// get movie of Genre

// delete movie


export default router;
