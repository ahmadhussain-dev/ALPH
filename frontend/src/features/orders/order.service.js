
import api from "@/lib/api";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data.data.order;
};

export const getMyOrders = async (params = {}) => {
  const response = await api.get("/orders/my-orders", { params });
  return response.data.data;
};

export const getMyOrder = async (orderId) => {
  const response = await api.get(`/orders/my-orders/${orderId}`);
  return response.data.data.order;
};

export const getAdminOrders = async (params = {}) => {
  const response = await api.get("/orders/admin", { params });
  return response.data.data;
};

export const updateAdminOrderStatus = async (orderId, status) => {
  const response = await api.patch(
    `/orders/admin/${orderId}/status`,
    { status }
  );

  return response.data.data.order;
};
