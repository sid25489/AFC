import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import { protect } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register admin user
// @access  Private (Admin only - for creating additional admins)
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        name,
        role: role || "admin",
      });

      res.status(201).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists and get password
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

