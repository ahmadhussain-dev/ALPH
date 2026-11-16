
import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return next(
      new ApiError(400, "Validation failed", errors)
    );
  }

  req.validated = result.data;
  req.body = result.data.body ?? req.body;

  next();
};

export default validate;
