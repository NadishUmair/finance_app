import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/reset-password/${token}`, {
        password,
      });

      setMessage("Password updated successfully");
    } catch (err) {
      setMessage("Invalid or expired link");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">

      <div className="w-full max-w-md p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        
        <h2 className="text-3xl font-bold mb-3">
          Set New Password
        </h2>

        <p className="text-slate-400 mb-6">
          Create a strong password for your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4"
          />

          <button className="w-full bg-cyan-500 py-4 rounded-2xl text-black font-bold">
            Update Password
          </button>

          {message && (
            <p className="text-center text-cyan-400">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}