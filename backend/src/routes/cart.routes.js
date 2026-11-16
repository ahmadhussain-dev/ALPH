import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemIdSchema,
} from "../validators/cart.validator.js";

import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  emptyCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/", getCart);


router.post(
  "/items",
  validate(addCartItemSchema),
  addItem
);

router.patch(
  "/items/:itemId",
  validate(updateCartItemSchema),
  updateItem
);

router.delete(
  "/items/:itemId",
  validate(cartItemIdSchema),
  removeItem
);

router.delete("/clear", emptyCart);

export default router;