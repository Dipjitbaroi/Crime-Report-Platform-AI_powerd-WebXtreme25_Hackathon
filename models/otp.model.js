import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows either email or phone to be unique
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.OTP_EXPIRES, // OTP expires after given minutes
  },
});

const OTP = mongoose.model("OTP", OTPSchema);
export default OTP;
