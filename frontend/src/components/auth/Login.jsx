import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userData = await login(email, password);
      navigate(userData.role === "admin" ? "/hr" : "/employee", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row">

        {/* Left Panel */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-10 text-white flex flex-col justify-between md:w-2/5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-extrabold text-xl backdrop-blur-sm">F</div>
              <span className="text-2xl font-extrabold tracking-wide">FactoHR</span>
            </div>
            <h2 className="text-3xl font-extrabold mb-3 leading-tight">Smart HR<br />Management</h2>
            <p className="text-orange-100 text-sm leading-relaxed">
              Manage attendance, leaves, and employee records — all in one place.
            </p>
          </div>

          <div className="relative z-10 space-y-3 mt-8">
            {["GPS-Based Attendance", "Leave Management", "Role-Based Access"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-orange-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-sm"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-sm pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            FactoHR · Smart HR & Employee Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
