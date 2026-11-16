
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // MongoDB duplicate key error
  if (err.code === 11000) {
    error = new ApiError(
      409,
      "A record with this information already exists"
    );
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error = new ApiError(
      400,
      "Database validation failed",
      Object.values(err.errors).map((item) => item.message)
    );
  }

  // Mongoose invalid ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, "Invalid resource ID");
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Something went wrong",

    errors: error.errors || [],

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
