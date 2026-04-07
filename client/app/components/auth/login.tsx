import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Lock, CheckCircle2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react"; // Add this at the top with other imports
import { useNavigate } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/user-login`, {
        email,
        password,
      });

      console.log("response", response);
      localStorage.setItem("token", response.data.accessToken);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.log("error", error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen  bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Animated Finance Background */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-10 left-10"
        animate={{ x: [0, 120, 0], y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 14 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl bottom-10 right-10"
        animate={{ x: [0, -100, 0], y: [0, -60, 0] }}
        transition={{ repeat: Infinity, duration: 18 }}
      />

      <div className="grid lg:grid-cols-2 max-w-6xl w-full mx-6 rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/5 relative z-10">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-r border-white/10">
          <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-4">
            Secure Finance Access
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Welcome Back To Your Financial Command Center
          </h1>

          <p className="text-slate-300 mt-6 leading-8">
            Access real-time reports, bookkeeping dashboards, tax-ready records,
            and strategic financial insights.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "24/7 secure dashboard access",
              "Live profit & loss insights",
              "Tax and compliance reports",
              "Dedicated accounting experts",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="bg-white/5 rounded-2xl p-5">
              <ShieldCheck className="text-cyan-400 mb-3" />
              <h3 className="font-semibold">Protected</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <BarChart3 className="text-cyan-400 mb-3" />
              <h3 className="font-semibold">Insights</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <Lock className="text-cyan-400 mb-3" />
              <h3 className="font-semibold">Encrypted</h3>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 lg:p-14">
          <h2 className="text-4xl font-bold mb-3">Login To Dashboard</h2>

          <p className="text-slate-400 mb-8">
            Securely access your financial workspace.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Business email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              {errors.email && (
                <p className="text-red-400 mt-2">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-2xl font-bold transition"
            >
              {isLoading ? "Signing In..." : "Secure Login"}
            </button>
            <p className="text-right text-sm text-slate-400">
              <Link
                to="/forgot-password"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Forgot Password?
              </Link>
            </p>

            <p className="text-center text-slate-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
