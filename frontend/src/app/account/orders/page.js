
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyOrders } from "@/features/orders/order.service";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const result = await getMyOrders();

        if (active) setOrders(result.orders);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load orders."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <main className="p-10">Loading orders...</main>;

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold">My Orders</h1>

      {error && <p className="mb-5 text-red-600">{error}</p>}

      {!error && orders.length === 0 && (
        <div className="border-t py-12 text-center">
          <p>You havenot placed any orders yet.</p>
          <Link href="/products" className="mt-5 inline-block underline">
            Start shopping
          </Link>
        </div>
      )}

      <div className="space-y-5">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block border border-neutral-200 p-6 transition hover:border-black"
          >
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="mt-2 text-sm text-neutral-500">
                  {new Date(order.createdAt).toLocaleDateString("en-PK")}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  PKR {order.total.toLocaleString("en-PK")}
                </p>
                <p className="mt-2 text-sm capitalize text-neutral-500">
                  {order.status}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-neutral-500">
              {order.items.length} product line(s)
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
