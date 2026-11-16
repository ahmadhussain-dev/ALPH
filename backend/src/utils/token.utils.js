
import jwt from "jsonwebtoken";
import { createHash, randomUUID } from "node:crypto";

export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const hashToken = (token) => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};

export const generateTokens = (userId, sessionId) => {
  const accessToken = jwt.sign(
    {
      sub: userId,
      sid: sessionId,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    {
      sub: userId,
      jti: sessionId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const generateSessionId = () => randomUUID();
