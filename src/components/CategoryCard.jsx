import { useNavigate } from "react-router-dom";

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  return (
    <div
      id={`category-${category.id}`}
      className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[3/4] md:aspect-[4/5]"
      onClick={() => navigate(`/products?category=${category.id}`)}
    >
      {/* Image */}
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className="text-white text-xl md:text-2xl font-light tracking-wide mb-1">
          {category.name}
        </h3>
        <p className="text-white/70 text-xs md:text-sm tracking-wide mb-4">
          {category.description}
        </p>
        <div className="flex items-center gap-2 text-white/90 text-xs tracking-[0.2em] uppercase font-medium group-hover:gap-3 transition-all duration-300">
          <span>Explore</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
        </div>
      </div>
    </div>
  );
}
