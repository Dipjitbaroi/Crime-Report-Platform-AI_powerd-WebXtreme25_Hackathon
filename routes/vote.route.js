
import express from "express";

import { checkToken } from "../middlewares/checkToken.js";
import { addVote, deleteVote } from "../controllers/vote.controller.js";

const router = express.Router();

// Add a vote to a crime post
router.post("/votes", checkToken, addVote);

// Remove a vote from a crime post
router.delete("/votes", checkToken, deleteVote);

export default router;
