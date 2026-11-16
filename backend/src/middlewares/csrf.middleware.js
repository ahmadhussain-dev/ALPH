
import ApiError from "../utils/ApiError.js";

const requireTrustedOrigin = (req, res, next) => {
  const origin = req.get("origin");
  const trustedOrigin = new URL(
    process.env.CLIENT_URL
  ).origin;

  // Permit origin-less tools during local development
  if (!origin && process.env.NODE_ENV !== "production") {
    return next();
  }

  if (!origin || origin !== trustedOrigin) {
    return next(
      new ApiError(403, "Untrusted request origin")
    );
  }

  next();
};

export default requireTrustedOrigin;
