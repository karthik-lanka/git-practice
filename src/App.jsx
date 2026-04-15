import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import InfoPage from "./pages/InfoPage";
import Dashboard from "./pages/admin/Dashboard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Redirect admin away from shopping pages */
function ShopRoute({ children }) {
  const { user } = useAuth();
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return children;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public routes (shopping — blocked for admin) */}
          <Route path="/" element={<ShopRoute><Home /></ShopRoute>} />
          <Route path="/products" element={<ShopRoute><Products /></ShopRoute>} />
          <Route path="/product/:id" element={<ShopRoute><ProductDetails /></ShopRoute>} />
          <Route path="/cart" element={<ShopRoute><Cart /></ShopRoute>} />
          <Route path="/login" element={<Login />} />

          {/* Info pages */}
          <Route path="/faq" element={<InfoPage title="FAQ" />} />
          <Route path="/shipping" element={<InfoPage title="Shipping Info" />} />
          <Route path="/returns" element={<InfoPage title="Returns & Exchange" />} />
          <Route path="/size-guide" element={<InfoPage title="Size Guide" />} />
          <Route path="/about" element={<InfoPage title="About Us" />} />
          <Route path="/contact" element={<InfoPage title="Contact" />} />
          <Route path="/privacy" element={<InfoPage title="Privacy Policy" />} />
          <Route path="/terms" element={<InfoPage title="Terms of Service" />} />

          {/* Protected routes (logged-in users only, not admin) */}
          <Route path="/profile" element={
            <ProtectedRoute><ShopRoute><Profile /></ShopRoute></ProtectedRoute>
          } />

          {/* Admin-only routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
