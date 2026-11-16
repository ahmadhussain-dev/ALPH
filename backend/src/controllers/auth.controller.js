
import authService from "../services/auth.service.js";

import asyncHandler from "../utils/asyncHandler.js";
import { sanitizeUser } from "../utils/user.utils.js";

import {
  setAuthCookies,
  clearAuthCookies,
} from "../utils/cookie.utils.js";

const getMetadata = (req) => ({
  ipAddress: req.ip,
  userAgent: req.get("user-agent"),
});

// REGISTER
export const register = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.register(
    req.body,
    getMetadata(req)
  );

  setAuthCookies(res, tokens);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      user: sanitizeUser(user),
    },
  });
});

// LOGIN
export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.login(
    req.body,
    getMetadata(req)
  );

  setAuthCookies(res, tokens);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: sanitizeUser(user),
    },
  });
});

// REFRESH
export const refresh = asyncHandler(async (req, res) => {
  const { user, tokens } = await authService.refresh(
    req.cookies?.refreshToken,
    getMetadata(req)
  );

  setAuthCookies(res, tokens);

  res.status(200).json({
    success: true,
    message: "Session refreshed successfully",
    data: {
      user: sanitizeUser(user),
    },
  });
});

// LOGOUT
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies?.refreshToken);

  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// CURRENT USER
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(req.user),
    },
  });
});
