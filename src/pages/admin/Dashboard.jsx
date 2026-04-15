import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, getAllOrders, getAllUsers } from "../../services/api";
import Loader from "../../components/Loader";

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, usersRes] = await Promise.all([
          getDashboardStats(),
          getAllOrders({ limit: 10 }),
          getAllUsers(),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data || []);
        setUsers(usersRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div id="admin-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">Administration</p>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="text-xs tracking-[0.15em] uppercase font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="text-xs tracking-[0.15em] uppercase font-medium border border-neutral-200 text-neutral-600 px-5 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Products", value: stats.totalProducts, icon: "📦", color: "bg-blue-50 text-blue-700" },
            { label: "Total Orders", value: stats.totalOrders, icon: "🛒", color: "bg-green-50 text-green-700" },
            { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "bg-purple-50 text-purple-700" },
            { label: "Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "bg-amber-50 text-amber-700" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-neutral-100 rounded-xl p-5 hover:border-neutral-200 transition-all animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${stat.color}`}>
                  {stat.icon}
                </span>
                <span className="text-xs tracking-[0.15em] uppercase text-neutral-400 font-medium">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-100 mb-6">
        {[
          { key: "overview", label: "Recent Orders" },
          { key: "users", label: `Users (${users.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recent Orders Tab */}
      {activeTab === "overview" && (
        <div className="animate-fade-in">
          {recentOrders.length === 0 ? (
            <p className="text-neutral-400 text-sm py-8 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Items</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Total</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-neutral-500">
                        {order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.user?.name || "—"}</p>
                        <p className="text-xs text-neutral-400">{order.user?.email || ""}</p>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">
                        {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? "s" : ""}
                      </td>
                      <td className="py-3 px-4 font-semibold">₹{order.totalPrice?.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-neutral-100"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="animate-fade-in">
          {users.length === 0 ? (
            <p className="text-neutral-400 text-sm py-8 text-center">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100">
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] tracking-[0.1em] uppercase font-semibold px-2.5 py-1 rounded-full ${
                          u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
