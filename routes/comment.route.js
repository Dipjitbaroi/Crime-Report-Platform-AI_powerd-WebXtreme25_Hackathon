import express from "express";
import { addComment, deleteComment } from "../controllers/comments.controller";

const router = express.Router();

// Route to add a comment
router.post("/comments", addComment);

// Route to delete a comment
router.delete("/comments/:commentId", deleteComment);

export default router;
