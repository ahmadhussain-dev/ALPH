
"use client";

export default function ProductFilters({
  categories,
  filters,
  setFilters,
}) {
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

      <input
        type="search"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
        className="border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
      />

      <select
        value={filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
      >
        <option value="">All categories</option>

        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={(e) => updateFilter("sort", e.target.value)}
        className="border border-gray-300 bg-white px-4 py-3 text-sm outline-none"
      >
        <option value="newest">Newest first</option>
        <option value="price-asc">Price: Low to high</option>
        <option value="price-desc">Price: High to low</option>
      </select>

      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          placeholder="Min PKR"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
          className="w-1/2 min-w-0 border border-gray-300 px-3 py-3 text-sm outline-none"
        />

        <input
          type="number"
          min="0"
          placeholder="Max PKR"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
          className="w-1/2 min-w-0 border border-gray-300 px-3 py-3 text-sm outline-none"
        />
      </div>

    </div>
  );
}
