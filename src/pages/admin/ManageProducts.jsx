import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api";
import Loader from "../../components/Loader";

const emptyForm = {
  name: "", description: "", price: "", category: "men", brand: "",
  sizes: "S,M,L,XL", images: "", stock: "10",
};

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await getProducts({ limit: 100 });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const openEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price || ""),
      category: product.category || "men",
      brand: product.brand || "",
      sizes: (product.sizes || []).join(","),
      images: (product.images || []).join(","),
      stock: String(product.stock ?? "0"),
    });
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.brand) {
      setError("Name, description, price, and brand are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        stock: Number(form.stock) || 0,
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully!");
      }
      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      setSuccess("Product deleted.");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  if (loading) return <Loader />;

  return (
    <div id="manage-products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/admin" className="text-xs tracking-[0.15em] uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-light tracking-wide">Manage Products</h1>
        </div>
        <button
          onClick={openCreate}
          className="text-xs tracking-[0.15em] uppercase font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Feedback */}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {success}
        </div>
      )}
      {error && !showForm && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 animate-fade-in">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-light tracking-wide">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Product name"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="999"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="10"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Brand *</label>
                  <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand name"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Sizes (comma-separated)</label>
                <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S,M,L,XL"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium mb-1">Image URLs (comma-separated)</label>
                <input name="images" value={form.images} onChange={handleChange} placeholder="https://..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-neutral-900 text-white text-xs tracking-[0.15em] uppercase font-medium py-3.5 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-3.5 text-xs tracking-[0.15em] uppercase font-medium border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-sm mb-4">No products found</p>
          <button onClick={openCreate} className="text-sm text-neutral-900 underline underline-offset-4">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Product</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Category</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Price</th>
                <th className="text-left py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Stock</th>
                <th className="text-right py-3 px-4 text-xs tracking-[0.1em] uppercase text-neutral-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px]">—</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-neutral-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize text-neutral-500">{p.category}</td>
                  <td className="py-3 px-4 font-semibold">₹{p.price?.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 px-3 py-1.5 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
