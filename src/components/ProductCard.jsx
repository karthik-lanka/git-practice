import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const productId = product._id || product.id;

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const rating = product.rating || 0;
  const reviews = product.reviews || 0;

  return (
    <div
      id={`product-card-${productId}`}
      className="product-card group cursor-pointer"
      onClick={() => navigate(`/product/${productId}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg bg-neutral-100 aspect-[3/4] mb-3">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
          alt={product.name}
          className="product-card-img w-full h-full object-cover"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.15em] uppercase font-medium px-3 py-1.5 rounded-full">
            {product.badge}
          </span>
        )}

        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] tracking-wide uppercase font-semibold px-2.5 py-1 rounded-full">
            −{discount}%
          </span>
        )}

        {/* Stock indicator */}
        {product.stock !== undefined && product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-neutral-900 text-xs tracking-[0.15em] uppercase font-medium px-4 py-2 rounded-md">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            className="w-full bg-primary text-white text-xs tracking-[0.15em] uppercase py-3 rounded-md hover:bg-secondary transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${productId}`);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-neutral-900">
            ₹{product.price.toLocaleString()}
          </p>
          {product.originalPrice && (
            <p className="text-xs text-neutral-400 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </p>
          )}
        </div>
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
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
            <span className="text-[10px] text-neutral-400">
              ({reviews})
            </span>
          </div>
        )}
        {/* Brand for backend products */}
        {product.brand && (
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
            {product.brand}
          </p>
        )}
      </div>
    </div>
  );
}
