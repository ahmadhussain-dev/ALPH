
import asyncHandler from "../utils/asyncHandler.js";

import {
  createOrder as createOrderService,
  getMyOrders as getMyOrdersService,
  getMyOrderById as getMyOrderByIdService,
  getAllOrders as getAllOrdersService,
  updateOrderStatus as updateOrderStatusService,
} from "../services/order.service.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await createOrderService(
    req.user._id,
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: { order },
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const result = await getMyOrdersService(
    req.user._id,
    page,
    limit
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await getMyOrderByIdService(
    req.user._id,
    req.params.orderId
  );

  res.status(200).json({
    success: true,
    data: { order },
  });
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const result = await getAllOrdersService(req.validated.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await updateOrderStatusService(
    req.params.orderId,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: { order },
  });
});
