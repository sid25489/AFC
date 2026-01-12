import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User, { IUser, UserRole } from "../models/User";
import { generateToken } from "../utils/generateToken";
import { AuthRequest, protect } from "../middleware/auth";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register customer user (public)
// @access  Public
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user: IUser = await User.create({
        email,
        password,
        name,
        role: UserRole.CUSTOMER,
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

// @route   POST /api/auth/register-admin
// @desc    Register admin user
// @access  Private (Admin only)
router.post(
  "/register-admin",
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

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post(
  "/google",
  [body("token").notEmpty()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token } = req.body;

      // Verify Google OAuth token
      const { OAuth2Client } = await import('google-auth-library');
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      let payload;
      try {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (error) {
        return res.status(401).json({ error: "Invalid Google token" });
      }

      if (!payload || !payload.email) {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      const { email, name, sub: googleId } = payload;

      // Check if user exists
      let user = await User.findOne({ $or: [{ email }, { googleId }] });

      if (user) {
        // Update existing user with Google ID if not present
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Create new user with Google OAuth
        user = await User.create({
          email,
          name: name || email.split('@')[0],
          googleId,
          role: UserRole.CUSTOMER,
          isActive: true,
        });
      }

      res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset email
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      const user = await User.findOne({ email });

      // Don't reveal if user exists or not
      if (!user) {
        return res.json({
          message: "If an account exists with that email, a password reset link has been sent.",
        });
      }

      // Check if user has a Google account (no password)
      if (user.googleId && !user.password) {
        return res.status(400).json({
          error: "This account uses Google Sign-In. Please use Google to log in.",
        });
      }

      // Generate reset token
      const crypto = await import('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Hash token and set expiry (1 hour)
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await user.save();

      // Send email
      const { sendPasswordResetEmail } = await import('../utils/emailService');
      try {
        await sendPasswordResetEmail(user.email, resetToken, user.name);
      } catch (emailError) {
        console.error("Email send error:", emailError);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({ error: "Failed to send email. Please try again later." });
      }

      res.json({
        message: "If an account exists with that email, a password reset link has been sent.",
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password/:token",
  [body("password").isLength({ min: 6 })],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token } = req.params;
      const { password } = req.body;

      // Hash the token from URL
      const crypto = await import('crypto');
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find user with valid token
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          error: "Invalid or expired reset token",
        });
      }

      // Set new password
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({
        message: "Password reset successful. You can now log in with your new password.",
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", protect, async (req: AuthRequest, res: Response) => {
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
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    });
  } catch (error: any) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
