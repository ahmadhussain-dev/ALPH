
"use client";

export default function PaymentMethodSelector({
  value,
  onChange,
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">
        Payment Method
      </h2>

      <div className="space-y-4">

        {/* Cash on Delivery */}
        <button
          type="button"
          onClick={() => onChange("cash_on_delivery")}
          className={`w-full border p-5 text-left transition ${
            value === "cash_on_delivery"
              ? "border-black bg-neutral-50"
              : "border-neutral-200 hover:border-neutral-400"
          }`}
        >
          <div className="flex items-start gap-4">

            <span
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                value === "cash_on_delivery"
                  ? "border-black"
                  : "border-neutral-400"
              }`}
            >
              {value === "cash_on_delivery" && (
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
              )}
            </span>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium">
                  Cash on Delivery
                </h3>

                <span className="bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Available
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Pay in cash when your order arrives at your
                delivery address.
              </p>
            </div>
          </div>
        </button>

        {/* Online Payments */}
        <div className="w-full border border-neutral-200 bg-neutral-50 p-5 opacity-80">
          <div className="flex items-start gap-4">
            <span className="mt-1 h-5 w-5 shrink-0 rounded-full border border-neutral-300" />

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-neutral-700">
                  Online Payments
                </h3>

                <span className="bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  Coming Soon
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Secure online payments will be available soon.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "JazzCash", "Easypaisa", "Bank Transfer"].map(
                  (method) => (
                    <span
                      key={method}
                      className="border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-500"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
