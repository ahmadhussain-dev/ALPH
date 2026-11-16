"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
export default function CartPage() {
  const {
    cart,
    loading,
    updateItem,
    removeItem,
  } = useCart();

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-20">
        Loading your cart...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-xs tracking-[0.3em] text-neutral-500">
        ALPH COLLECTION
      </p>

      <h1 className="mb-10 text-4xl font-semibold">
        Your Shopping Cart
      </h1>

      {cart.items.length === 0 ? (
        <div className="border-t border-neutral-200 py-20 text-center">
          <h2 className="text-2xl font-medium">
            Your cart is empty
          </h2>

          <p className="mt-3 text-neutral-500">
            Discover something you love.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block bg-black px-8 py-4 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex gap-5 border-b border-neutral-200 pb-6"
              >
                <Image
                  src={item.product.images?.[0]?.url || "/placeholder.png"}
                  alt={item.product.name}
                  className="h-36 w-28 bg-neutral-100 object-cover"
                />

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.product.name}
                  </Link>

                  <p className="mt-2 text-sm text-neutral-500">
                    Size: {item.variant.size}
                  </p>

                  <p className="text-sm text-neutral-500">
                    Color: {item.variant.color}
                  </p>

                  <p className="mt-2 font-medium">
                    PKR {item.variant.price.toLocaleString("en-PK")}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label
                      htmlFor={`quantity-${item._id}`}
                      className="text-sm text-neutral-600"
                    >
                      Quantity
                    </label>

                    <select
                      id={`quantity-${item._id}`}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item._id, Number(e.target.value))
                      }
                      className="border border-neutral-300 bg-white px-3 py-2 text-black"
                    >
                      {Array.from(
                        { length: Math.min(item.variant.stock, 20) },
                        (_, index) => index + 1
                      ).map((quantity) => (
                        <option key={quantity} value={quantity}>
                          {quantity}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="text-sm text-neutral-500 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="font-medium">
                  PKR {item.itemTotal.toLocaleString("en-PK")}
                </p>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-neutral-200 p-6">
            <h2 className="text-xl font-medium">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-sm">
              <span>Items ({cart.totalItems})</span>
              <span>
                PKR {cart.subtotal.toLocaleString("en-PK")}
              </span>
            </div>

            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-semibold">
              <span>Subtotal</span>
              <span>
                PKR {cart.subtotal.toLocaleString("en-PK")}
              </span>
            </div>

            <p className="mt-3 text-xs text-neutral-500">
              Shipping charges will be calculated during checkout.
            </p>

            <Link
              href="/checkout"
              className="mt-7 block bg-black px-6 py-4 text-center text-white hover:bg-neutral-800"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="mt-4 block text-center text-sm underline"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}