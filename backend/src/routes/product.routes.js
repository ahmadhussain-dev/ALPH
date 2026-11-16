
import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductBySlug,
} from "../controllers/product.controller.js";

import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  productSlugSchema,
  productIdSchema,
} from "../validators/product.validator.js";

const router = express.Router();

// Public routes
router.get(
  "/",
  validate(productQuerySchema),
  getProducts
);

router.get(
  "/:slug",
  validate(productSlugSchema),
  getProductBySlug
);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(productIdSchema),
  deleteProduct
);

export default router;
