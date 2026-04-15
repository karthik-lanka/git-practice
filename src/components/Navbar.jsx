import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Shopping nav links (for regular users)
const shopLinks = [
  { to: "/", label: "Home" },
  { to: "/products?category=men", label: "Men" },
  { to: "/products?category=women", label: "Women" },
  { to: "/products?category=kids", label: "Kids" },
];

// Admin nav links
const adminLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const isAdminPage = location.pathname.startsWith("/admin");
  const navLinks = isAdmin ? adminLinks : shopLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Mobile menu button */}
            <button
              id="mobile-menu-btn"
              className="md:hidden p-2 -ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-[1.5px] bg-neutral-900 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                <span className={`block h-[1.5px] bg-neutral-900 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-[1.5px] bg-neutral-900 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>

            {/* Logo */}
            <Link
              to={isAdmin ? "/admin" : "/"}
              className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-neutral-900"
            >
              Voguè
              {isAdmin && (
                <span className="ml-2 text-[10px] tracking-[0.1em] align-middle bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Admin
                </span>
              )}
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link text-[13px] tracking-[0.15em] uppercase transition-colors duration-200 ${
                      isActive ? "text-neutral-900 font-medium" : "text-neutral-600 hover:text-neutral-900"
                    }`
                  }
                  end={link.to === "/" || link.to === "/admin"}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Search (only for shoppers) */}
              {!isAdmin && (
                <button
                  id="search-btn"
                  className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}

              {/* Profile / Account */}
              {user ? (
                <div className="relative group">
                  <button className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors" aria-label="Profile">
                    <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                      <span className="text-[9px] text-white font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-xs font-medium text-neutral-700 truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                    </div>
                    {!isAdmin && (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors border-t border-neutral-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  id="profile-btn"
                  className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => navigate("/login")}
                  aria-label="Login"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {/* Cart (only for shoppers) */}
              {!isAdmin && (
                <button
                  id="cart-btn"
                  className="relative p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
                  onClick={() => navigate("/cart")}
                  aria-label="Cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-neutral-900 text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search bar (shoppers only) */}
        {searchOpen && !isAdmin && (
          <div className="border-t border-neutral-100 animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full bg-neutral-50 border-0 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  autoFocus
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-right flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <span className="text-lg font-light tracking-[0.3em] uppercase">Voguè</span>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 py-6">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-3.5 text-sm tracking-[0.15em] uppercase text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAdmin && user && (
                <>
                  <div className="h-px bg-neutral-100 mx-6 my-3" />
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-3.5 text-sm tracking-[0.15em] uppercase text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    My Orders
                  </NavLink>
                </>
              )}
            </div>
            <div className="p-6 border-t border-neutral-100">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full text-center py-3 text-sm tracking-[0.1em] uppercase border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 text-sm tracking-[0.1em] uppercase bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16 md:h-18" />
    </>
  );
}
