import asyncHandler from "../utils/asyncHandler.js";

import {
  getCart as getCartService,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart.service.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  res.status(200).json({
    success: true,
    data: { cart },
  });
});

export const addItem = asyncHandler(async (req, res) => {
  const cart = await addToCart(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: { cart },
  });
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(
    req.user._id,
    req.params.itemId,
    req.body.quantity
  );

  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: { cart },
  });
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(
    req.user._id,
    req.params.itemId
  );

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: { cart },
  });
});

export const emptyCart = asyncHandler(async (req, res) => {
  const cart = await clearCart(req.user._id);

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: { cart },
  });
});