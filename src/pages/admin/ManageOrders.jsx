import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllOrders, updateOrderStatus } from "../../services/api";
import Loader from "../../components/Loader";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ALL_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const params = { limit: 100 };
      if (filterStatus) params.status = filterStatus;
      const res = await getAllOrders(params);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError(null);
    setSuccess(null);
    try {
      await updateOrderStatus(orderId, newStatus);
      setSuccess(`Order updated to "${newStatus}"`);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div id="manage-orders" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <Link to="/admin" className="text-xs tracking-[0.15em] uppercase text-neutral-400 hover:text-neutral-600 transition-colors mb-2 inline-block">
            ← Dashboard
          </Link>
          <h1 className="text-2xl font-light tracking-wide">Manage Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-400 uppercase tracking-wider">Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <option value="">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback */}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6 animate-fade-in">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 animate-fade-in">{error}</div>
      )}

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-sm">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-neutral-100 rounded-xl p-5 md:p-6 hover:border-neutral-200 transition-colors animate-fade-in"
            >
              {/* Order header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-neutral-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">₹{order.totalPrice?.toLocaleString()}</span>

                  {/* Status update dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingId === order._id}
                    className={`text-xs font-semibold tracking-[0.05em] uppercase px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-200 disabled:opacity-50 ${
                      statusColors[order.status] || "bg-neutral-100"
                    }`}
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">
                  {order.user?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium">{order.user?.name || "Unknown user"}</p>
                  <p className="text-xs text-neutral-400">{order.user?.email || ""}</p>
                </div>
              </div>

              {/* Order items */}
              <div className="space-y-2">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <div className="w-8 h-10 rounded overflow-hidden bg-neutral-100 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-200 text-[8px]">—</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.name}</p>
                    </div>
                    <p className="text-xs text-neutral-400 shrink-0">
                      {item.quantity} × ₹{item.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (order.shippingAddress.address || order.shippingAddress.city) && (
                <div className="mt-4 pt-3 border-t border-neutral-50">
                  <p className="text-xs text-neutral-400">
                    📍 {[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode, order.shippingAddress.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
