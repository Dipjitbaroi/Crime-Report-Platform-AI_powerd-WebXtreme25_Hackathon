import express from "express";
import {
  register,
  login,
  deleteUser,
  updateUser,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/user.controller.js";
import { checkToken } from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.put("/update", checkToken, updateUser);

router.delete("/delete/:id", checkToken, deleteUser);

router.post("/send-otp", checkToken, sendOtp);

router.post("/verify-otp", checkToken, verifyOtp);

router.post("/reset-password", checkToken, resetPassword);

export default router;
