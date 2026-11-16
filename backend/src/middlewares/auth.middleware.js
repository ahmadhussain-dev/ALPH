
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import RefreshToken from "../models/RefreshToken.model.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    throw new ApiError(401, "Authentication required");
  }

  let payload;

  try {
    payload = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET
    );
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }

  if (payload.type !== "access" || !payload.sid) {
    throw new ApiError(401, "Invalid access token");
  }

  const [user, session] = await Promise.all([
    User.findById(payload.sub),

    RefreshToken.findOne({
      user: payload.sub,
      jti: payload.sid,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    }),
  ]);

  if (!user || !session || !user.isActive) {
    throw new ApiError(401, "Session is no longer valid");
  }

  req.user = user;

  next();
});

export default authenticate;
