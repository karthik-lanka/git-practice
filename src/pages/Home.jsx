import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import Loader from "../components/Loader";

const categories = [
  {
    id: "men",
    name: "Men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    description: "Refined essentials for the modern man",
  },
  {
    id: "women",
    name: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    description: "Effortless elegance, every day",
  },
  {
    id: "kids",
    name: "Kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80",
    description: "Playful styles for little ones",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProducts({ limit: 8 });
        // res.data is already the products array (normalized in api.js)
        setFeatured(Array.isArray(res.data) ? res.data.slice(0, 8) : []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Unable to load products. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div id="home-page">
      {/* ═══ Hero Section ═══ */}
      <section className="relative h-[85vh] md:h-[92vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt="Fashion collection hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
          <div className="max-w-xl animate-fade-in">
            <p className="text-white/70 text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
              Spring / Summer 2026
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6">
              Redefine
              <br />
              Your Style
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Discover curated collections that blend timeless elegance with
              contemporary flair. Premium fabrics, sustainable choices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-white text-neutral-900 text-xs tracking-[0.2em] uppercase font-medium px-8 py-4 rounded-md hover:bg-neutral-100 transition-colors duration-200"
              >
                Shop Now
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                to="/products?category=women"
                className="inline-flex items-center gap-3 border border-white/30 text-white text-xs tracking-[0.2em] uppercase font-medium px-8 py-4 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                Explore Women
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-[1px] h-8 bg-white/30" />
        </div>
      </section>

      {/* ═══ Categories ═══ */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">
            Collections
          </p>
          <h2 className="text-2xl md:text-3xl font-light tracking-wide">
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section id="featured-section" className="bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-3">
                Curated for You
              </p>
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              View All
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-sm mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-400 text-sm mb-2">No products yet</p>
              <p className="text-neutral-300 text-xs">
                Add products via the backend admin API
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              View All Products
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Promotional Banner ═══ */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
              alt="Seasonal promotion"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-transparent flex items-center">
              <div className="px-8 md:px-16 max-w-lg">
                <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-3">
                  Limited Time
                </p>
                <h3 className="text-2xl md:text-4xl font-light text-white leading-tight mb-4">
                  Up to 40% Off
                  <br />
                  Season Essentials
                </h3>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-3 bg-white text-neutral-900 text-xs tracking-[0.2em] uppercase font-medium px-6 py-3 rounded-md hover:bg-neutral-100 transition-colors duration-200"
                >
                  Shop Sale
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Trust badges ═══ */}
      <section className="border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🚚",
                title: "Free Shipping",
                desc: "On orders over ₹2,999",
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                desc: "30-day return policy",
              },
              {
                icon: "🔒",
                title: "Secure Payment",
                desc: "SSL encrypted checkout",
              },
              {
                icon: "💬",
                title: "24/7 Support",
                desc: "Dedicated help center",
              },
            ].map((badge) => (
              <div key={badge.title} className="text-center">
                <div className="text-2xl mb-3">{badge.icon}</div>
                <h4 className="text-sm font-medium mb-1">{badge.title}</h4>
                <p className="text-xs text-neutral-400">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
