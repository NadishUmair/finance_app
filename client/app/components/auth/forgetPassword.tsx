import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, { email });
      setMessage("Reset link sent to your email");
    } catch (err) {
      setMessage("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">

      {/* Background */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-10 left-10"
        animate={{ x: [0, 120, 0] }}
        transition={{ repeat: Infinity, duration: 14 }}
      />

      <div className="w-full max-w-md p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl z-10">
        
        <h2 className="text-3xl font-bold mb-3">
          Forgot Password
        </h2>

        <p className="text-slate-400 mb-6">
          Enter your email to receive reset link
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Business email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:border-cyan-400 outline-none"
          />

          <button className="w-full bg-cyan-500 py-4 rounded-2xl font-bold text-black">
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <p className="text-center text-cyan-400">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}