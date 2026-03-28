import React from "react";
import {
  BarChart3,
  Wallet,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const services = [
  {
    title: "Monthly Bookkeeping",
    desc: "Accurate, up-to-date financial records every month with complete reconciliation and reporting.",
    icon: <Wallet className="w-8 h-8" />,
  },
  {
    title: "Catch-Up Bookkeeping",
    desc: "Behind on your books? We clean, organize, and bring everything up-to-date fast.",
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    title: "AR/AP Management",
    desc: "Streamline invoices, payments, and vendor management for better cash flow.",
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    title: "Financial Reporting",
    desc: "Clear insights with Profit & Loss, Balance Sheet, and Cash Flow reports.",
    icon: <BarChart3 className="w-8 h-8" />,
  },
  {
    title: "Tax-Ready Books",
    desc: "Stay compliant with clean, audit-ready financial records all year round.",
    icon: <ShieldCheck className="w-8 h-8" />,
  },
  {
    title: "CFO Advisory",
    desc: "Strategic financial guidance to help you scale smarter and faster.",
    icon: <Wallet className="w-8 h-8" />,
  },
];

const process = [
  "Discovery & Onboarding",
  "Secure Document Collection",
  "Monthly Bookkeeping",
  "Bank Reconciliation",
  "Reports & Insights",
];

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 text-white">

      {/* HERO */}
      <section className="py-28 px-6 lg:px-20">
        <p className="text-cyan-400 uppercase tracking-[0.3em] text-sm">
          Our Services
        </p>
        <h1 className="text-5xl lg:text-7xl font-bold mt-6 leading-tight max-w-4xl">
          Premium Financial Services Built For Growing Businesses
        </h1>
        <p className="text-slate-400 mt-6 text-lg max-w-2xl">
          From bookkeeping to CFO-level insights, we provide everything you need
          to stay compliant, organized, and ready to scale.
        </p>
      </section>

      {/* SERVICES GRID */}
      <section className="px-6 lg:px-20 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:translate-y-[-6px] transition"
            >
              <div className="text-cyan-400 mb-6">{service.icon}</div>
              <h3 className="text-2xl font-semibold">{service.title}</h3>
              <p className="text-slate-400 mt-4 leading-7">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS (VERY IMPORTANT TRUST SECTION) */}
      <section className="px-6 lg:px-20 py-24 bg-slate-900/40">
        <div className="text-center mb-16">
          <p className="text-cyan-400 uppercase tracking-widest">
            Our Process
          </p>
          <h2 className="text-4xl font-bold mt-4">
            Simple, Transparent, And Scalable
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {process.map((step, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-cyan-400">
                {index + 1}
              </h3>
              <p className="mt-2 text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="px-6 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold">
              Why Businesses Trust Our Services
            </h2>
            <p className="text-slate-400 mt-6 leading-8">
              We combine financial expertise with modern tools to deliver
              accurate, scalable, and stress-free bookkeeping systems.
            </p>
          </div>

          <div className="space-y-5">
            {[
              "Dedicated accounting experts",
              "Cloud-based real-time dashboards",
              "Tax-ready compliance system",
              "Transparent pricing with no hidden fees",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400 w-5 h-5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="px-6 lg:px-20 py-24 bg-slate-900/40">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Industries We Serve
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            "E-Commerce",
            "Real Estate",
            "Startups",
            "Agencies",
            "Healthcare",
            "Freelancers",
          ].map((item, index) => (
            <span
              key={index}
              className="bg-white/5 border border-white/10 px-6 py-3 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-center">
          <h2 className="text-4xl font-bold">
            Ready To Upgrade Your Financial System?
          </h2>
          <p className="mt-4 text-white/90">
            Get expert bookkeeping and financial insights today.
          </p>
          <button className="mt-8 bg-black text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto">
            Get Free Consultation <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}