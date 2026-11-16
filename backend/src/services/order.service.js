
import mongoose from "mongoose";
import crypto from "node:crypto";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import Order from "../models/Order.model.js";
import ApiError from "../utils/ApiError.js";

const generateOrderNumber = () => {
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ALPH-${Date.now()}-${random}`;
};

export const createOrder = async (userId, orderData) => {
  const session = await mongoose.startSession();

  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty");
      }

      const orderItems = [];
      let subtotal = 0;

      for (const cartItem of cart.items) {
        const product = await Product.findOne({
          _id: cartItem.product,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new ApiError(400, "A product in your cart is unavailable");
        }

        const variant = product.variants.id(cartItem.variantId);

        if (!variant) {
          throw new ApiError(400, "A selected product variant is unavailable");
        }

        // Atomically check stock and reduce it.
        // The price condition also prevents charging a stale cart price.
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: product._id,
            isActive: true,
            variants: {
              $elemMatch: {
                _id: variant._id,
                price: variant.price,
                stock: { $gte: cartItem.quantity },
              },
            },
          },
          {
            $inc: {
              "variants.$.stock": -cartItem.quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new ApiError(
            400,
            `Insufficient stock or price changed for ${product.name}. Please review your cart.`
          );
        }

        const itemTotal = variant.price * cartItem.quantity;

        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          variantId: variant._id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.url || "",
          size: variant.size,
          color: variant.color,
          sku: variant.sku || "",
          unitPrice: variant.price,
          quantity: cartItem.quantity,
          lineTotal: itemTotal,
        });
      }

      // Development placeholder: shipping is currently free.
      // Add a configurable shipping fee before production.
      const shippingFee = 0;
      const total = subtotal + shippingFee;

      const [order] = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            user: userId,
            items: orderItems,
            shippingAddress: orderData.shippingAddress,
            subtotal,
            shippingFee,
            total,
            paymentMethod: orderData.paymentMethod ||"cash_on_delivery",
            paymentStatus: "pending",
            status: "pending",
          },
        ],
        { session }
      );

      await Cart.updateOne(
        { user: userId },
        { $set: { items: [] } },
        { session }
      );

      createdOrder = order;
    });

    return createdOrder;
  } finally {
    await session.endSession();
  }
};

export const getMyOrders = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments({ user: userId }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMyOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).lean();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

export const getAllOrders = async ({ page = 1, limit = 10, status }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (["cancelled", "returned"].includes(order.status)) {
    throw new ApiError(400, "This order is already closed");
  }

  order.status = status;

  if (status === "cancelled") {
    throw new ApiError(
      400,
      "Use the cancellation workflow to cancel and restock an order"
    );
  }

  if (status === "delivered" && order.paymentMethod === "cash_on_delivery") {
    order.paymentStatus = "paid";
  }

  await order.save();

  return order;
};
