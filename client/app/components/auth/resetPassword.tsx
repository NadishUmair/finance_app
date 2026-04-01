import React, { useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import { nav } from "framer-motion/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ResetPasswordFlow() {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isTyping = password.length > 0;

  // OTP handlers
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      setMessage("Enter complete OTP");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/verify-otp`, {
        email,
        otp: finalOtp,
      });
      setMessage("");
      setStep(2);
    } catch {
      setMessage("Invalid or expired OTP");
    }
  };

  // Reset Password
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.patch(`${BASE_URL}/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword: password,
      });

      setMessage("Password updated successfully");
      setTimeout(()=>{
        navigate("/login");
      },1000)
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white relative overflow-hidden">

      {/* Background Glow */}
      <motion.div
        className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl top-10 left-10"
        animate={{ x: [0, 80, 0] }}
        transition={{ repeat: Infinity, duration: 20 }}
      />

      <div className="w-full max-w-md p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl z-10 relative">

      

        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-2 text-center">
          {step === 1 ? "Verify Code" : "Set New Password"}
        </h2>

        <p className="text-slate-400 mb-6 text-center text-sm">
          {step === 1
            ? "Enter the verification code sent to your email"
            : "Choose a secure password"}
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el: HTMLInputElement | null) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-14 h-14 text-center text-lg font-medium rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 outline-none transition"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-cyan-500 py-3 rounded-xl text-black font-medium hover:bg-cyan-400 transition"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:border-cyan-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-cyan-400"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:border-cyan-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-cyan-400"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>

            <button className="w-full bg-cyan-500 py-3 rounded-xl text-black font-medium hover:bg-cyan-400 transition">
              Update Password
            </button>
          </form>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="text-center text-cyan-400 mt-4 text-sm">{message}</p>
        )}

        {/* STEP INDICATOR */}
        <div className="flex justify-center gap-2 mt-6">
          <div className={`w-2 h-2 rounded-full ${step === 1 ? "bg-cyan-400" : "bg-white/20"}`} />
          <div className={`w-2 h-2 rounded-full ${step === 2 ? "bg-cyan-400" : "bg-white/20"}`} />
        </div>

      </div>
    </div>
  );
}