import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/api";
import Loader from "../components/Loader";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div id="profile-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
            <span className="text-xl text-white font-medium">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-light tracking-wide">{user.name}</h1>
            <p className="text-sm text-neutral-400">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-1 text-[10px] tracking-[0.15em] uppercase font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="text-xs tracking-[0.15em] uppercase font-medium border border-neutral-200 text-neutral-600 px-5 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-xs tracking-[0.15em] uppercase font-medium border border-neutral-200 text-neutral-600 px-5 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <div className="mb-6">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Purchase History
          </p>
          <h2 className="text-2xl font-light tracking-wide">Your Orders</h2>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-neutral-400 text-sm">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
              <svg className="w-7 h-7 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-neutral-400 text-sm mb-4">No orders yet</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white text-xs tracking-[0.15em] uppercase font-medium px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-neutral-100 rounded-xl p-5 md:p-6 hover:border-neutral-200 transition-colors animate-fade-in"
              >
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[10px] tracking-[0.1em] uppercase font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-neutral-100 text-neutral-600"}`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-neutral-400">
                      ID: {order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="text-sm font-semibold">
                      ₹{order.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div className="space-y-3">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs">—</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-neutral-400">
                          Qty: {item.quantity}
                          {item.size && ` · Size: ${item.size}`}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
