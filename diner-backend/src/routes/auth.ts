import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User, { IUser, UserRole } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AuthRequest, protect } from "../middleware/auth";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register admin user
// @access  Private (Admin only)
router.post(
  "/register",
  protect,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const requestingUser = await User.findById(req.user?.id);
      if (!requestingUser || requestingUser.role !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Not authorized as admin" });
      }

      const { email, password, name, role } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user: IUser = await User.create({
        email,
        password,
        name,
        role: role || UserRole.ADMIN,
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
    body("password").notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is inactive" });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
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

export default router;
