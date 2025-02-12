import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";
import OTP from "../models/otp.model.js";

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Phone validation regex (supports various formats)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (!email && !phone) {
      return res.status(400).json({ msg: "Email or phone number is required" });
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }
    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    let user = await User.findOne(query);
    if (user)
      return res
        .status(400)
        .json({ msg: "This email or phone number already exists" });

    user = new User({ name, email, password, phone });
    await user.save();

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email || "",
        phone: user.phone || "",
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.deleteOne();

    return res.json({ msg: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({
      msg: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const sendOtp = async (req, res) => {
  const { email, phone } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();

  try {
    let existingOtp = await OTP.findOne({ $or: [{ email }, { phone }] });
    if (existingOtp) {
      existingOtp.code = otp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      await OTP.create({ email, phone, code: otp });
    }

    if (email) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
    }

    if (phone) {
      const client = twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE,
        to: phone,
      });
    }

    res.json({ msg: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, phone, otp } = req.body;
  try {
    const existingOtp = await OTP.findOne({ $or: [{ email }, { phone }] });

    if (!existingOtp || existingOtp.code !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    await OTP.deleteOne({ _id: existingOtp._id }); // Remove OTP after verification
    res.json({ msg: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, phone, otp, newPassword } = req.body;

  try {
    const existingOtp = await OTP.findOne({ $or: [{ email }, { phone }] });

    if (!existingOtp || existingOtp.code !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.password = newPassword;

    await user.save();
    await OTP.deleteOne({ _id: existingOtp._id }); // Remove OTP after password reset

    res.json({ msg: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
