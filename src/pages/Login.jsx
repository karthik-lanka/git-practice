import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register, loading, error, user, clearError } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError("");
    if (clearError) clearError();
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setFormError("");
    if (clearError) clearError();
    setForm({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setFormError("Please fill in all fields");
      return;
    }
    if (isRegister && !form.name.trim()) {
      setFormError("Please enter your name");
      return;
    }
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }
    try {
      let loggedInUser;
      if (isRegister) {
        loggedInUser = await register({ name: form.name, email: form.email, password: form.password });
      } else {
        loggedInUser = await login({ email: form.email, password: form.password });
      }
      // Redirect based on role
      if (loggedInUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch {
      // error is set in context
    }
  };

  if (user) return null;

  return (
    <div
      id="login-page"
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link
            to="/"
            className="text-2xl font-light tracking-[0.3em] uppercase text-neutral-900"
          >
            Voguè
          </Link>
          <h1 className="text-xl font-light tracking-wide mt-6 mb-2">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-neutral-400">
            {isRegister
              ? "Join us to start shopping"
              : "Sign in to access your account"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {(formError || error) && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg animate-scale-in">
              {formError || error}
            </div>
          )}

          {/* Name field (register only) */}
          {isRegister && (
            <div className="animate-fade-in">
              <label
                htmlFor="name"
                className="block text-xs tracking-[0.15em] uppercase text-neutral-400 font-medium mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all"
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-xs tracking-[0.15em] uppercase text-neutral-400 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-[0.15em] uppercase text-neutral-400 font-medium mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent transition-all"
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white text-xs tracking-[0.15em] uppercase font-medium py-4 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRegister ? "Creating account..." : "Signing in..."}
              </span>
            ) : isRegister ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="text-center text-sm text-neutral-400 mt-8">
          {isRegister ? "Already have an account?" : "Don\u0027t have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-neutral-900 font-medium hover:underline underline-offset-4"
          >
            {isRegister ? "Sign In" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
