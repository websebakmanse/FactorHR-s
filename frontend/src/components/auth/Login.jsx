import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await login(email, password);
      // Redirect based on role
      navigate(userData.role === "admin" ? "/hr" : "/employee", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden p-4">
      {/* Background Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-screen filter blur-[128px] opacity-70"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-600 rounded-full mix-blend-screen filter blur-[128px] opacity-40"></div>

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border-t border-l border-white/30 border-r border-b border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-20 rounded-3xl pointer-events-none"></div>

        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 text-center mb-8 relative z-10">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm text-center relative z-10">
            {error}
          </div>
        )}

        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 focus:bg-black/40 focus:ring-1 focus:ring-yellow-400 transition-all duration-300 backdrop-blur-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 border border-white/10 shadow-lg hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
