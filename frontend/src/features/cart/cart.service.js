import api from "@/lib/api";

export const getCart = async () => {
  const response = await api.get("/cart");
    console.log("CART API RESPONSE:", response.data);

  return response.data.data?.cart ?? response.data.cart ?? response.data.data;
};

export const addCartItem = async (item) => {
  const response = await api.post("/cart/items", item);
  return response.data.data.cart;
};

export const updateCartItem = async (itemId, quantity) => {
  const response = await api.patch(`/cart/items/${itemId}`, {
    quantity,
  });

  return response.data.cart;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data.data.cart;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data.data.cart;
};