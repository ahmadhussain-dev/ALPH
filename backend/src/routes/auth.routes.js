
import express from "express";
import rateLimit from "express-rate-limit";

import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";
import requireTrustedOrigin from "../middlewares/csrf.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Public routes
router.post(
  "/register",
  authLimiter,
  requireTrustedOrigin,
  validate(registerSchema),
  register
);

router.post(
  "/login",
  authLimiter,
  requireTrustedOrigin,
  validate(loginSchema),
  login
);

// Refresh session
router.post(
  "/refresh",
  requireTrustedOrigin,
  refresh
);

// Logout
router.post(
  "/logout",
  requireTrustedOrigin,
  logout
);

// Protected route
router.get(
  "/me",
  authenticate,
  getMe
);

export default router;
