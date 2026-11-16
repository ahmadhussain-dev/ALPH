
"use client";

import { useEffect, useState } from "react";

import StoreHeader from "@/components/store/StoreHeader";
import ProductGrid from "@/components/store/ProductGrid";
import ProductFilters from "@/components/store/ProductFilters";

import {
  getProducts,
  getCategories,
} from "@/features/products/product.service";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    getCategories()
      .then((response) => {
        setCategories(response.data.categories || []);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          page,
          limit: 12,
          sort: filters.sort,
        };

        if (filters.search.trim()) {
          params.search = filters.search.trim();
        }

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.minPrice !== "") {
          params.minPrice = filters.minPrice;
        }

        if (filters.maxPrice !== "") {
          params.maxPrice = filters.maxPrice;
        }

        const response = await getProducts(params);

        if (!cancelled) {
          setProducts(response.data.products || []);
          setPagination(response.data.pagination || null);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error.response?.data?.message ||
            "Unable to load products."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [filters, page]);

  const handleFilterChange = (update) => {
    setPage(1);
    setFilters(update);
  };

  return (
    <>
      <StoreHeader />

      <main className="mx-auto max-w-7xl px-5 py-12">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            ALPH Collection
          </p>

          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            All Products
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Explore our latest clothing collection.
          </p>
        </div>

        <ProductFilters
          categories={categories}
          filters={filters}
          setFilters={handleFilterChange}
        />

        <div className="mb-6 mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {pagination
              ? `${pagination.total} products`
              : "Loading products..."}
          </p>
        </div>

        {error ? (
          <div className="py-16 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
          />
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-5">
            <button
              disabled={!pagination.hasPreviousPage || loading}
              onClick={() => setPage((current) => current - 1)}
              className="border px-5 py-3 text-sm disabled:opacity-30"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={!pagination.hasNextPage || loading}
              onClick={() => setPage((current) => current + 1)}
              className="border px-5 py-3 text-sm disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}

      </main>
    </>
  );
}
