import express from "express";
import {
  createCrimePost,
  getAllCrimePosts,
  getCrimePostById,
  updateCrimePost,
  deleteCrimePost,
} from "../controllers/crime_posts.controller.js";
import { checkToken } from "../middlewares/checkToken.js";
import { addVote, deleteVote } from "../controllers/vote.controller.js";
import { addComment, deleteComment } from "../controllers/comments.controller.js";

const router = express.Router();

// Create a new crime post
router.post("/add", checkToken, createCrimePost);

// Get all crime posts
router.get("/get", checkToken, getAllCrimePosts);

// Get a single crime post by ID
router.get("/get/:id", checkToken, getCrimePostById);

// Update a crime post by ID
router.put("/update/:id", checkToken, updateCrimePost);

// Delete a crime post by ID
router.delete("/delete/:id", checkToken, deleteCrimePost);

// Add a vote to a crime post
router.post("/votes", checkToken, addVote);

// Remove a vote from a crime post
router.delete("/votes", checkToken, deleteVote);

// Route to add a comment
router.post("/comments", addComment);

// Route to delete a comment
router.delete("/comments/:commentId", deleteComment);


export default router;
