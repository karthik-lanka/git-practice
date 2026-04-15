import axios from "axios";

// ─── Centralized Axios Instance ───
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach auth token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── AUTH API ───

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  const { _id, name, email, role, token } = res.data.data;
  return {
    data: {
      user: { _id, name, email, role },
      token,
    },
  };
};

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  const { _id, name, email, role, token } = res.data.data;
  return {
    data: {
      user: { _id, name, email, role },
      token,
    },
  };
};

export const getProfile = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

// ─── PRODUCTS API ───

export const getProducts = async (params = {}) => {
  const res = await api.get("/products", { params });
  return {
    data: res.data.data || [],
    pagination: res.data.pagination || null,
  };
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return { data: res.data.data };
};

export const createProduct = async (productData) => {
  const res = await api.post("/products", productData);
  return res.data;
};

export const updateProduct = async (id, productData) => {
  const res = await api.put(`/products/${id}`, productData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

// ─── ORDERS API ───

export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const getAllOrders = async (params = {}) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/orders/${id}`, { status });
  return res.data;
};

// ─── ADMIN API ───

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data;
};

// ─── HEALTH CHECK ───

export const healthCheck = async () => {
  const res = await api.get("/health");
  return res.data;
};

export default api;
