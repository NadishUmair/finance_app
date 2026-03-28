import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Wallet, DollarSign, TrendingUp, PieChart } from "lucide-react";
import FAQSection from "./faqs";
import Footer from "./footer";

// Services
const services = [
  { title: "Bookkeeping", desc: "Accurate monthly books, reconciliations, and clean financial records.", icon: <Wallet className="w-8 h-8" /> },
  { title: "Financial Reporting", desc: "Real-time dashboards, cash flow, profit & loss, and KPI insights.", icon: <BarChart3 className="w-8 h-8" /> },
  { title: "Tax & Compliance", desc: "Stay compliant with tax-ready books and year-end reporting.", icon: <ShieldCheck className="w-8 h-8" /> },
  { title: "Cash Flow Management", desc: "Forecast and manage cash flow efficiently.", icon: <DollarSign className="w-8 h-8" /> },
  { title: "Investment Insights", desc: "Smart analytics for better investment decisions.", icon: <TrendingUp className="w-8 h-8" /> },
  { title: "Financial Analytics", desc: "Data-driven insights for scaling your business.", icon: <PieChart className="w-8 h-8" /> },
];

// Client Reviews
const reviews = [
  { name: "Sarah J.", role: "CEO, TechStart", text: "Rocket-level bookkeeping! Their insights helped us scale and manage cash flow with clarity.", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Ali R.", role: "Founder, EcomX", text: "Professional, responsive, and accurate. We never worry about compliance or reporting.", avatar: "https://i.pravatar.cc/150?img=15" },
  { name: "Maya K.", role: "Owner, Marketing Studio", text: "They transformed our messy books into organized financial dashboards. Highly recommend!", avatar: "https://i.pravatar.cc/150?img=17" },
];

// Stats
const stats = [
  { label: "Clients", value: "500+" },
  { label: "Accuracy", value: "99.9%" },
  { label: "Support", value: "24/7" },
];

// FAQ
const faqs = [
  { q: "Do you handle taxes for small businesses?", a: "Yes, we provide full tax compliance services tailored to small businesses." },
  { q: "Can I see real-time financial reports?", a: "Absolutely! Our dashboards allow you to track finances in real-time." },
  { q: "How do you ensure accuracy?", a: "We have dedicated accounting experts and double-check all reports to maintain 99.9% accuracy." },
];

// Floating Object Component
const FloatingObject = ({ children, size, initialX, initialY, duration }) => (
  <motion.div
    className="absolute"
    style={{ width: size, height: size }}
    initial={{ x: initialX, y: initialY }}
    animate={{ x: [initialX, initialX + 200, initialX - 100, initialX], y: [initialY, initialY + 100, initialY - 50, initialY] }}
    transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="relative bg-slate-950 text-white overflow-x-hidden">

      {/* FLOATING BACKGROUND */}
      <FloatingObject size={80} initialX={-100} initialY={50} duration={20}>
        <DollarSign className="text-green-400 opacity-40 w-full h-full" />
      </FloatingObject>
      <FloatingObject size={60} initialX={400} initialY={200} duration={18}>
        <TrendingUp className="text-blue-400 opacity-30 w-full h-full" />
      </FloatingObject>
      <FloatingObject size={50} initialX={200} initialY={400} duration={22}>
        <PieChart className="text-yellow-400 opacity-40 w-full h-full" />
      </FloatingObject>
      <FloatingObject size={70} initialX={-50} initialY={300} duration={25}>
        <ArrowRight className="text-cyan-400 opacity-20 w-full h-full rotate-12" />
      </FloatingObject>
      <FloatingObject size={90} initialX={-150} initialY={500} duration={30}>
        <BarChart3 className="text-purple-400 opacity-25 w-full h-full" />
      </FloatingObject>

      {/* HERO */}
      <section className="relative min-h-screen px-6 lg:px-20 flex items-center z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-cyan-400 mb-4 font-medium tracking-widest uppercase">Finance That Fuels Growth</p>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">Premium Accounting & Finance Solutions</h1>
            <p className="text-slate-300 mt-6 text-lg leading-8 max-w-xl">
              We help startups, agencies, and enterprises manage books, reporting, and tax workflows with precision so you can focus on growth.
            </p>
            <div className="flex gap-4 mt-10">
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-7 py-4 rounded-2xl font-semibold flex items-center gap-2 transition">
                Get Free Consultation <ArrowRight size={18} />
              </button>
            </div>
            <div className="flex gap-8 mt-12 text-sm text-slate-400">
              {stats.map((stat, idx) => (
                <span key={idx}>✔ {stat.value} {stat.label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 lg:px-20 py-24 z-10 relative">
        <div className="text-center mb-16">
          <p className="text-cyan-400 uppercase tracking-widest">Services</p>
          <h2 className="text-4xl font-bold mt-4">Built For Scaling Companies</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:translate-y-[-6px] transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-cyan-400 mb-6">{service.icon}</div>
              <h3 className="text-2xl font-semibold">{service.title}</h3>
              <p className="text-slate-400 mt-4 leading-7">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 lg:px-20 py-24 z-10 relative">
        <div className="text-center mb-16">
          <p className="text-cyan-400 uppercase tracking-widest">Testimonials</p>
          <h2 className="text-4xl font-bold mt-4">What Clients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:shadow-lg transition"
              whileHover={{ y: -5 }}
            >
              <p className="text-slate-300 italic">"{review.text}"</p>
              <div className="flex items-center gap-4 mt-6">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h4 className="font-semibold">{review.name}</h4>
                  <p className="text-slate-400 text-sm">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      < FAQSection/>

      {/* CTA */}
      <section className="px-6 lg:px-20 py-24 z-10 relative">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 p-12 text-center">
          <h2 className="text-4xl font-bold">Let Your Numbers Drive Smarter Decisions</h2>
          <p className="mt-4 text-lg text-white/90">
            Get enterprise-grade accounting support without hiring an in-house team.
          </p>
          <button className="mt-8 bg-black text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto">
            Schedule a Strategy Call <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer/>

    </div>
  );
}