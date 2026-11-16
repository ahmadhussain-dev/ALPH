
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrder } from "@/features/orders/order.service";
import Image from "next/image";
export default function OrderDetails({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrder = async () => {
      try {
        const data = await getMyOrder(orderId);

        if (active) setOrder(data);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load order."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  if (loading) {
    return <main className="p-10">Loading order...</main>;
  }

  if (error || !order) {
    return (
      <main className="p-10 text-center">
        {error || "Order not found"}
        <div className="mt-5">
          <Link href="/products" className="underline">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-neutral-500">
        ALPH ORDER CONFIRMATION
      </p>

      <h1 className="mt-4 text-3xl font-semibold">
        Thank you for your order
      </h1>

      <p className="mt-3 text-neutral-600">
        Your order has been placed successfully.
      </p>

      <section className="mt-10 border border-neutral-200 p-6">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Order number</p>
            <p className="mt-1 font-semibold">{order.orderNumber}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Order status</p>
            <p className="mt-1 font-semibold capitalize">
              {order.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Payment Method</p>
            <p className="mt-1 font-semibold">
              Cash on Delivery
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Pay when your order is delivered
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_300px]">
        <section>
          <h2 className="mb-5 text-xl font-semibold">
            Items ordered
          </h2>

          <div className="space-y-5">
            {order.items.map((item, index) => (
              <div
                key={`${item.variantId}-${index}`}
                className="flex gap-4 border-b border-neutral-200 pb-5"
              >
                <div className="relative h-28 w-24 shrink-0 bg-neutral-100">
  <Image
    src={item.image || "/placeholder.png"}
    alt={item.name}
    fill
    sizes="96px"
    className="object-cover"
  />
</div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Size: {item.size} · Color: {item.color}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Quantity: {item.quantity}
                  </p>
                  <p className="mt-2 font-medium">
                    PKR {item.lineTotal.toLocaleString("en-PK")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit border border-neutral-200 p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-5 flex justify-between text-sm">
            <span>Subtotal</span>
            <span>PKR {order.subtotal.toLocaleString("en-PK")}</span>
          </div>

          <div className="mt-3 flex justify-between text-sm">
            <span>Shipping</span>
            <span>PKR {order.shippingFee.toLocaleString("en-PK")}</span>
          </div>

          <div className="mt-5 flex justify-between border-t pt-5 font-semibold">
            <span>Total</span>
            <span>PKR {order.total.toLocaleString("en-PK")}</span>
          </div>

          <div className="mt-7 border-t pt-5">
            <h3 className="font-medium">Delivery address</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.phone}<br />
              {order.shippingAddress.addressLine}<br />
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode &&
                `, ${order.shippingAddress.postalCode}`}
            </p>
          </div>
        </aside>
      </div>

      <Link
        href="/products"
        className="mt-10 inline-block bg-black px-8 py-4 text-white"
      >
        Continue Shopping
      </Link>
    </main>
  );
}
