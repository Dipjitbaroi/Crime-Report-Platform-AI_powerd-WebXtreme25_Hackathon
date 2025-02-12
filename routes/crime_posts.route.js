import express from "express";
import {
  createCrimePost,
  getAllCrimePosts,
  getCrimePostById,
  updateCrimePost,
  deleteCrimePost,
} from "../controllers/crime_posts.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

// Create a new crime post
router.post("/crimes", checkToken, createCrimePost);

// Get all crime posts
router.get("/crimes", checkToken, getAllCrimePosts);

// Get a single crime post by ID
router.get("/crimes/:id", checkToken, getCrimePostById);

// Update a crime post by ID
router.put("/crimes/:id", checkToken, updateCrimePost);

// Delete a crime post by ID
router.delete("/crimes/:id", checkToken, deleteCrimePost);

export default router;
