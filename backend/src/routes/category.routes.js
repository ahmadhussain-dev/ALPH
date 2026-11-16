
import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js";

import {
  createCategorySchema,
  categoryListSchema,
} from "../validators/category.validator.js";

const router = express.Router();

router.get(
  "/",
  validate(categoryListSchema),
  getCategories
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  createCategory
);

export default router;
