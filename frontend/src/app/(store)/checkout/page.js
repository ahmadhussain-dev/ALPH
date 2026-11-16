"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { createOrder } from "@/features/orders/order.service";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
export default function CheckoutPage() {
  const { cart, loading } = useCart();
const router = useRouter();
const [paymentMethod, setPaymentMethod] = useState(
  "cash_on_delivery"
);
const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    addressLine: "",
    postalCode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (paymentMethod !== "cash_on_delivery") {
    setMessage("Please select an available payment method.");
    return;
  }

  try {
    setSubmitting(true);
    setMessage("");

    const order = await createOrder({
      shippingAddress: address,
      paymentMethod,
    });

    router.push(`/orders/${order._id}`);
  } catch (error) {
    setMessage(
      error.response?.data?.message ||
      "Unable to place your order. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return <main className="p-10">Loading checkout...</main>;
  }

  if (!cart.items.length) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">
          Your cart is empty
        </h1>
        <Link href="/products" className="mt-6 inline-block underline">
          Browse Products
        </Link>
      </main>
    );
  }

  const fields = [
    { name: "fullName", label: "Full Name", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", required: true },
    { name: "city", label: "City", required: true },
    { name: "postalCode", label: "Postal Code" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-3 text-xs tracking-[0.3em] text-neutral-500">
        ALPH COLLECTION
      </p>

      <h1 className="mb-10 text-4xl font-semibold">
        Checkout
      </h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-xl font-medium">
            Shipping Information
          </h2>

          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block text-sm">
                {field.label}
              </label>

              <input
                name={field.name}
                type={field.type || "text"}
                value={address[field.name]}
                onChange={handleChange}
                required={field.required}
                className="w-full border border-neutral-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm">
              Complete Address
            </label>

            <textarea
              name="addressLine"
              value={address.addressLine}
              onChange={handleChange}
              required
              rows={4}
              placeholder="House number, street, area..."
              className="w-full border border-neutral-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
            />
          </div>
          <div className="border border-neutral-200 p-4">
  <p className="font-medium">Payment Method</p>
  <PaymentMethodSelector
  value={paymentMethod}
  onChange={setPaymentMethod}
/>
</div>

          <button
  type="submit"
  disabled={submitting}
  className="w-full bg-black px-6 py-4 text-white hover:bg-neutral-800 disabled:opacity-50"
>
  {submitting ? "Placing Order..." : "Place Order"}
</button>
          {message && (
            <p className="text-sm text-neutral-600" role="status">
              {message}
            </p>
          )}
        </form>

        <aside className="h-fit border border-neutral-200 p-6">
          <h2 className="mb-6 text-xl font-medium">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>

                <span className="whitespace-nowrap">
                  PKR {item.itemTotal.toLocaleString("en-PK")}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t border-neutral-200 pt-5 font-semibold">
            <span>Subtotal</span>
            <span>
              PKR {cart.subtotal.toLocaleString("en-PK")}
            </span>
          </div>

          <p className="mt-4 text-xs text-neutral-500">
            Shipping and payment options will be added in the next phases.
          </p>
        </aside>
      </div>
    </main>
  );
}