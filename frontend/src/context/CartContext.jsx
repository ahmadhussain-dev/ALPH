
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "@/features/cart/cart.service";

const CartContext = createContext(null);

const emptyCart = {
  items: [],
  subtotal: 0,
  totalItems: 0,
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(emptyCart);
  const [loading, setLoading] = useState(true);

  // Initial cart loading
  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      try {
        const data = await getCart();

        if (active) {
          setCart(data);
        }
      } catch (error) {
        if (active) {
          if (error.response?.status === 401) {
            setCart(emptyCart);
          } else {
            console.error("Unable to load cart:", error);
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, []);

  // Manual cart refresh
  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(emptyCart);
      } else {
        console.error("Unable to refresh cart:", error);
      }

      throw error;
    }
  }, []);

  // Add item
  const addItem = async (item) => {
    const updatedCart = await addCartItem(item);
    setCart(updatedCart);
    return updatedCart;
  };

  // Update quantity
  const updateItem = async (itemId, quantity) => {
    const updatedCart = await updateCartItem(itemId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  // Remove item
  const removeItem = async (itemId) => {
    const updatedCart = await removeCartItem(itemId);
    setCart(updatedCart);
    return updatedCart;
  };

  const value = {
    cart,
    loading,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
