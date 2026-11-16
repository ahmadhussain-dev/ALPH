
import express from "express";

import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createOrderSchema,
  orderIdSchema,
  adminOrderListSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator.js";

import {
  placeOrder,
  getMyOrders,
  getMyOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// Customer routes
router.use(authenticate);

router.post(
  "/",
  validate(createOrderSchema),
  placeOrder
);

router.get("/my-orders", getMyOrders);

router.get(
  "/my-orders/:orderId",
  validate(orderIdSchema),
  getMyOrder
);

// Admin routes
router.get(
  "/admin",
  authorize("admin"),
  validate(adminOrderListSchema),
  getAllOrders
);

router.patch(
  "/admin/:orderId/status",
  authorize("admin"),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

export default router;
