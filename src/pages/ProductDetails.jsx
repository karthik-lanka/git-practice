import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductById(id);
        const p = res.data;
        setProduct(p);
        setSelectedSize(p.sizes?.[0] || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found or server unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Safe field access with fallbacks for backend products
  const rating = product?.rating || 0;
  const reviews = product?.reviews || 0;
  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  if (loading) return <Loader />;

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-light mb-4">{error || "Product not found"}</h2>
        <Link
          to="/products"
          className="text-sm text-neutral-500 underline underline-offset-4"
        >
          Back to products
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const images = product.images || [];

  return (
    <div id="product-details-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-8">
        <Link to="/" className="hover:text-neutral-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-neutral-600 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-neutral-600">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* ─── Image Gallery ─── */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[3/4]">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover animate-scale-in"
                key={selectedImage}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase font-medium px-3 py-1.5 rounded-full">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImage === i
                      ? "border-neutral-900"
                      : "border-transparent hover:border-neutral-300"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Product Info ─── */}
        <div className="lg:py-4">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-2">
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-400">
                {product.category}
              </p>
              {product.brand && (
                <>
                  <span className="text-neutral-300">·</span>
                  <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">
                    {product.brand}
                  </p>
                </>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-light tracking-wide">
              {product.name}
            </h1>

            {/* Rating (only show if available) */}
            {rating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? "text-amber-400"
                          : "text-neutral-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-neutral-400">
                  {rating} ({reviews} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-neutral-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock !== undefined && (
              <p className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            <hr className="border-neutral-100" />

            {/* Description */}
            <p className="text-sm text-neutral-500 leading-relaxed">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-neutral-400 font-medium mb-3">
                  Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] h-10 px-4 text-sm rounded-lg border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-3 pt-2">
              <button
                id="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock !== undefined && product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white"
                    : product.stock !== undefined && product.stock === 0
                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {added ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added
                  </>
                ) : product.stock !== undefined && product.stock === 0 ? (
                  "Out of Stock"
                ) : (
                  <>
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist button */}
              <button className="w-14 h-14 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-200 transition-all duration-200">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Extra info */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: "🚚", text: "Free delivery over ₹2,999" },
                { icon: "↩️", text: "30-day easy returns" },
                { icon: "📦", text: "Ships in 2-4 days" },
                { icon: "🔒", text: "Secure checkout" },
              ].map((info) => (
                <div
                  key={info.text}
                  className="flex items-center gap-2 text-xs text-neutral-400"
                >
                  <span>{info.icon}</span>
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
