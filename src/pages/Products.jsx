import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹2,000", min: 0, max: 2000 },
  { label: "₹2,000 – ₹5,000", min: 2000, max: 5000 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "Over ₹10,000", min: 10000, max: Infinity },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const priceRange = Number(searchParams.get("price")) || 0;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (sort && sort !== "newest") params.sort = sort;
        if (category !== "all") params.category = category;
        if (priceRanges[priceRange]) {
          if (priceRanges[priceRange].min > 0)
            params.minPrice = priceRanges[priceRange].min;
          if (priceRanges[priceRange].max < Infinity)
            params.maxPrice = priceRanges[priceRange].max;
        }
        const res = await getProducts(params);
        // res.data is already the normalized array from api.js
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, priceRange]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all" || value === "0" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const categoryLabel =
    category === "all"
      ? "All Products"
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div id="products-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
          Shop
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide">
          {categoryLabel}
        </h1>
      </div>

      <div className="flex gap-8">
        {/* ─── Sidebar Filters (Desktop) ─── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Category filter */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium mb-4">
                Category
              </h3>
              <div className="space-y-2">
                {["all", "men", "women", "kids"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => updateFilter("category", cat)}
                    className={`block w-full text-left text-sm py-1.5 transition-colors duration-200 ${
                      category === cat
                        ? "text-neutral-900 font-medium"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {cat === "all"
                      ? "All"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium mb-4">
                Price Range
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => updateFilter("price", String(i))}
                    className={`block w-full text-left text-sm py-1.5 transition-colors duration-200 ${
                      priceRange === i
                        ? "text-neutral-900 font-medium"
                        : "text-neutral-400 hover:text-neutral-600"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ─── Main content ─── */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
            <p className="text-sm text-neutral-400">
              {loading ? "..." : `${products.length} products`}
            </p>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                className="lg:hidden flex items-center gap-2 text-sm text-neutral-600 border border-neutral-200 rounded-lg px-3 py-2"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="text-sm text-neutral-600 bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-sm mb-2">No products found</p>
              <button
                onClick={() => setSearchParams({})}
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Filters Drawer ─── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h3 className="text-sm tracking-[0.15em] uppercase font-medium">
                Filters
              </h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Category */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium mb-4">
                  Category
                </h3>
                <div className="space-y-2">
                  {["all", "men", "women", "kids"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        updateFilter("category", cat);
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left text-sm py-2 transition-colors ${
                        category === cat
                          ? "text-neutral-900 font-medium"
                          : "text-neutral-400"
                      }`}
                    >
                      {cat === "all"
                        ? "All"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium mb-4">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRanges.map((range, i) => (
                    <button
                      key={range.label}
                      onClick={() => {
                        updateFilter("price", String(i));
                        setMobileFiltersOpen(false);
                      }}
                      className={`block w-full text-left text-sm py-2 transition-colors ${
                        priceRange === i
                          ? "text-neutral-900 font-medium"
                          : "text-neutral-400"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100">
              <button
                onClick={() => {
                  setSearchParams({});
                  setMobileFiltersOpen(false);
                }}
                className="w-full text-center py-3 text-sm tracking-[0.1em] uppercase border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
