import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, CheckCircle2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Signup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/user_signup`,
        formData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
      
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
        
        {/* LEFT SIDE BRANDING */}
        <div className="p-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-r border-white/10 hidden lg:flex flex-col justify-center">
          <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-4">
            FinancePro Secure Access
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Start Growing With Smarter Financial Systems
          </h1>

          <p className="text-slate-300 mt-6 leading-8">
            Join hundreds of businesses using premium bookkeeping,
            CFO insights, tax-ready reporting, and real-time financial dashboards.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Tax-ready monthly books",
              "Real-time financial reports",
              "Cash flow forecasting",
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
              <h3 className="font-semibold">Secure</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <BarChart3 className="text-cyan-400 mb-3" />
              <h3 className="font-semibold">Reports</h3>
            </div>
            <div className="bg-white/5 rounded-2xl p-5">
              <CheckCircle2 className="text-cyan-400 mb-3" />
              <h3 className="font-semibold">Trusted</h3>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 lg:p-14">
          <h2 className="text-4xl font-bold mb-3">
            Create Your Account
          </h2>

          <p className="text-slate-400 mb-8">
            Access your finance dashboard and scale with confidence.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Business email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-2xl font-bold transition"
            >
              {isLoading ? "Creating..." : "Create Secure Account"}
            </button>

            <p className="text-center text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}