import React from "react";
import {
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { number: "500+", label: "Businesses Served" },
  { number: "99.9%", label: "Accuracy Rate" },
  { number: "8+", label: "Years Experience" },
  { number: "24/7", label: "Dedicated Support" },
];

const values = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Trust & Compliance",
    desc: "We maintain tax-ready books and enterprise-level financial compliance.",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Growth Insights",
    desc: "Real-time reporting and CFO insights to guide better decisions.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Dedicated Experts",
    desc: "A team of finance professionals focused on your business growth.",
  },
];

export default function AboutUs() {
  return (
    <div className="bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative py-32 px-6 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl">
          <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
            About Our Company
          </p>
          <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight">
            The Financial Team Behind Smarter Business Growth
          </h1>
          <p className="text-slate-400 mt-8 text-lg leading-8 max-w-3xl">
            We provide modern accounting, bookkeeping, reporting, and financial
            systems for startups, agencies, and growing enterprises that need
            accuracy, compliance, and clarity.
          </p>
        </div>
      </section>

      {/* STORY */}
      <section className="px-6 lg:px-20 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-cyan-400 uppercase tracking-widest">Who We Are</p>
          <h2 className="text-4xl font-bold mt-4">
            Built For Businesses That Want Financial Confidence
          </h2>
          <p className="text-slate-400 mt-6 leading-8">
            Our mission is simple: remove the stress from accounting and replace
            it with systems that empower smarter growth. From monthly closes to
            cash flow forecasting, we become the finance backbone of ambitious
            businesses.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Dedicated finance specialists",
              "Real-time reporting dashboards",
              "Tax-ready bookkeeping",
              "Cash flow optimization",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400 w-5 h-5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
          <h3 className="text-2xl font-semibold mb-8">Company Snapshot</h3>
          <div className="grid grid-cols-2 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
              >
                <h3 className="text-3xl font-bold text-cyan-400">
                  {item.number}
                </h3>
                <p className="text-slate-400 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="px-6 lg:px-20 py-24 bg-slate-900/40">
        <div className="text-center mb-16">
          <p className="text-cyan-400 uppercase tracking-widest">Our Values</p>
          <h2 className="text-4xl font-bold mt-4">
            Finance Built On Trust, Precision & Growth
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8"
            >
              <div className="text-cyan-400 mb-6">{value.icon}</div>
              <h3 className="text-2xl font-semibold">{value.title}</h3>
              <p className="text-slate-400 mt-4 leading-7">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Ready To Build A Stronger Financial Future?
          </h2>
          <p className="mt-4 text-white/90 text-lg">
            Partner with a finance team that helps your business scale with clarity.
          </p>
          <button className="mt-8 bg-black text-white px-8 py-4 rounded-2xl font-semibold">
            Schedule a Consultation
          </button>
        </div>
      </section>
    </div>
  );
}