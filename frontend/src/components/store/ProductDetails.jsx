
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import StoreHeader from "@/components/store/StoreHeader";
import ProductGallery from "@/components/store/ProductGallery";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { getProductBySlug } from "@/features/products/product.service";

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
const [cartMessage, setCartMessage] = useState("");
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleAddToCart = async () => {
  if (!selectedVariant) {
    setCartMessage("Please select a product variant.");
    return;
  }

  if (selectedVariant.stock < 1) {
    setCartMessage("This variant is out of stock.");
    return;
  }

  try {
    setAdding(true);
    setCartMessage("");

    await addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      quantity: 1,
    });

    setCartMessage("Product added to cart.");
  } catch (error) {
    setCartMessage(
      error.response?.data?.message ||
      "Unable to add product to cart."
    );
  } finally {
    setAdding(false);
  }
};

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductBySlug(slug);
        const result = response.data.product;

        if (!cancelled) {
          setProduct(result);
          setSelectedVariant(
            result.variants?.find((variant) => variant.stock > 0) ||
            result.variants?.[0] ||
            null
          );
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
            "Unable to load this product."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (slug) loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="p-10 text-center">
        Loading product...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="p-10 text-center">
        {error || "Product not found"}
      </main>
    );
  }

  const price = selectedVariant?.price;
  const availableSizes = [
    ...new Set(product.variants.map((variant) => variant.size)),
  ];

  const availableColors = [
    ...new Set(product.variants.map((variant) => variant.color)),
  ];

  const selectVariant = (size, color) => {
    const variant = product.variants.find(
      (item) => item.size === size && item.color === color
    );

    if (variant) {
      setSelectedVariant(variant);
    }
  };

  return (
    <>
      <StoreHeader />

      <main className="mx-auto max-w-7xl px-5 py-12">

        <div className="grid gap-12 md:grid-cols-2">

          <ProductGallery
            images={product.images}
            productName={product.name}
          />

          <section className="py-4">

            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
              {product.category?.name || "Collection"}
            </p>

            <h1 className="mt-4 text-3xl font-semibold">
              {product.name}
            </h1>

            <p className="mt-4 text-xl">
              {price !== undefined
                ? `PKR ${price.toLocaleString("en-PK")}`
                : "Price unavailable"}
            </p>

            <div className="my-8 border-t" />

            <p className="text-sm leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="mb-4 text-sm font-medium">
                Select size
              </p>

              <div className="flex flex-wrap gap-3">
                {availableSizes.map((size) => {
                  const hasStock = product.variants.some(
                    (variant) =>
                      variant.size === size &&
                      variant.color === selectedVariant?.color &&
                      variant.stock > 0
                  );

                  const selected = selectedVariant?.size === size;

                  return (
                    <button
                      type="button"
                      key={size}
                      disabled={!hasStock}
                      onClick={() =>
                        selectVariant(size, selectedVariant?.color)
                      }
                      className={`min-w-12 border px-4 py-3 text-sm ${
                        selected
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-4 text-sm font-medium">
                Select color
              </p>

              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const hasStock = product.variants.some(
                    (variant) =>
                      variant.color === color &&
                      variant.size === selectedVariant?.size &&
                      variant.stock > 0
                  );

                  return (
                    <button
                      type="button"
                      key={color}
                      disabled={!hasStock}
                      onClick={() =>
                        selectVariant(selectedVariant?.size, color)
                      }
                      className={`border px-4 py-3 text-sm ${
                        selectedVariant?.color === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm">
                {selectedVariant?.stock > 0
                  ? `${selectedVariant.stock} available`
                  : "Out of stock"}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                SKU: {selectedVariant?.sku || "Unavailable"}
              </p>
            </div>

            <button
  type="button"
  onClick={handleAddToCart}
  disabled={adding || !selectedVariant || selectedVariant.stock < 1}
  className="w-full bg-black px-6 py-4 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {adding
    ? "Adding..."
    : selectedVariant?.stock > 0
      ? "Add to Cart"
      : "Out of Stock"}
</button>

{cartMessage && (
  <p className="mt-3 text-sm text-neutral-600" role="status">
    {cartMessage}
  </p>
)}

<button
  type="button"
  onClick={() => router.push("/cart")}
  className="mt-3 w-full border border-neutral-300 px-6 py-4 text-black hover:bg-neutral-100"
>
  View Cart
</button>

          </section>
        </div>
      </main>
    </>
  );
}
