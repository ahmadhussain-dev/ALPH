
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";

import ApiError from "../utils/ApiError.js";
import {
  hashToken,
  generateTokens,
  generateSessionId,
  REFRESH_TOKEN_EXPIRY,
} from "../utils/token.utils.js";

const createSession = async (user, metadata = {}) => {
  const sessionId = generateSessionId();

  const tokens = generateTokens(
    user._id.toString(),
    sessionId
  );

  await RefreshToken.create({
    user: user._id,
    jti: sessionId,
    tokenHash: hashToken(tokens.refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    userAgent: metadata.userAgent,
    ipAddress: metadata.ipAddress,
  });

  return tokens;
};

// REGISTER
const register = async (data, metadata) => {
  const { fullName, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  // Public registrations always create customers
  const user = await User.create({
    fullName,
    email,
    password,
    role: "customer",
  });

  const tokens = await createSession(user, metadata);

  return { user, tokens };
};

// LOGIN
const login = async (data, metadata) => {
  const { email, password } = data;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been disabled");
  }

  const tokens = await createSession(user, metadata);

  return { user, tokens };
};

// REFRESH ACCESS TOKEN
const refresh = async (refreshToken, metadata) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let payload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  if (payload.type !== "refresh" || !payload.jti) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokenHash = hashToken(refreshToken);

  const existingSession = await RefreshToken.findOne({
    user: payload.sub,
    jti: payload.jti,
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!existingSession) {
    throw new ApiError(401, "Session expired or revoked");
  }

  // Atomically consume the old refresh token
  const consumedSession = await RefreshToken.findOneAndUpdate(
    {
      _id: existingSession._id,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: { revokedAt: new Date() },
    },
    { new: true }
  );

  if (!consumedSession) {
    throw new ApiError(401, "Refresh token already used");
  }

  const user = await User.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new ApiError(401, "User account unavailable");
  }

  const tokens = await createSession(user, metadata);

  return { user, tokens };
};

// LOGOUT
const logout = async (refreshToken) => {
  if (!refreshToken) return;

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    await RefreshToken.findOneAndUpdate(
      {
        tokenHash: hashToken(refreshToken),
        revokedAt: null,
      },
      {
        $set: { revokedAt: new Date() },
      }
    );
  } catch {
    // Invalid or expired tokens need no further revocation
  }
};

export default {
  register,
  login,
  refresh,
  logout,
};
