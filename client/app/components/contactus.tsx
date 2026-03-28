import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
} from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    value: "hello@finflow.com",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    value: "+1 (800) 123-4567",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Office",
    value: "Dubai • Riyadh • New York",
  },
  {
    icon: <Clock3 className="w-6 h-6" />,
    title: "Working Hours",
    value: "Mon - Fri, 9AM - 6PM",
  },
];

export default function ContactUs() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      {/* HERO */}
      <section className="relative py-28 px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
            Contact Us
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight">
            Let’s Build A Smarter Financial System For Your Business
          </h1>
          <p className="text-slate-400 mt-8 text-lg leading-8 max-w-3xl">
            Talk with our bookkeeping and finance experts to streamline your
            reporting, tax readiness, and growth strategy.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="px-6 lg:px-20 py-20 grid lg:grid-cols-2 gap-12">
        {/* LEFT INFO */}
        <div className="space-y-6">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5"
            >
              <div className="text-cyan-400">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-slate-400">{item.value}</p>
              </div>
            </div>
          ))}

          <div className="mt-10 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8">
            <h3 className="text-2xl font-bold">
              Free 30-Min Strategy Consultation
            </h3>
            <p className="mt-3 text-white/90">
              Discuss your bookkeeping, reporting, and tax workflow challenges
              with our finance specialists.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <h2 className="text-3xl font-bold mb-8">
            Schedule Your Consultation
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <input
              type="email"
              placeholder="Business Email"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <input
              type="text"
              placeholder="Company Name"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <textarea
              rows={5}
              placeholder="Tell us about your bookkeeping or finance needs..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition"
            >
              Book Consultation <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}