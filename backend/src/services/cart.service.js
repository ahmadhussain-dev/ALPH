import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import ApiError from "../utils/ApiError.js";

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "name slug images variants isActive",
    });

  if (!cart) {
    return {
      _id: null,
      items: [],
      subtotal: 0,
      totalItems: 0,
    };
  }

  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const product = item.product;

    if (!product || !product.isActive) {
      return null;
    }

    const variant = product.variants.id(item.variantId);

    if (!variant) {
      return null;
    }

    const itemTotal = variant.price * item.quantity;

    subtotal += itemTotal;
    totalItems += item.quantity;

    return {
      _id: item._id,
      product: {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
      },
      variant: {
        _id: variant._id,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
      },
      quantity: item.quantity,
      itemTotal,
    };
  }).filter(Boolean);

  return {
    _id: cart._id,
    items,
    subtotal,
    totalItems,
  };
};

const addToCart = async (userId, { productId, variantId, quantity }) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new ApiError(404, "Product variant not found");
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variantId.toString() === variantId
  );

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (newQuantity > variant.stock) {
    throw new ApiError(
      400,
      `Only ${variant.stock} items are available in stock`
    );
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      variantId,
      quantity,
    });
  }

  await cart.save();

  return getCart(userId);
};

const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  const product = await Product.findOne({
    _id: item.product,
    isActive: true,
  });

  if (!product) {
    throw new ApiError(404, "Product is no longer available");
  }

  const variant = product.variants.id(item.variantId);

  if (!variant) {
    throw new ApiError(404, "Selected variant is unavailable");
  }

  if (quantity > variant.stock) {
    throw new ApiError(
      400,
      `Only ${variant.stock} items are available in stock`
    );
  }

  item.quantity = quantity;

  await cart.save();

  return getCart(userId);
};

const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Cart item not found");
  }

  item.deleteOne();

  await cart.save();

  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    cart.items = [];
    await cart.save();
  }

  return getCart(userId);
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};