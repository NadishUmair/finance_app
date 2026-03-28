import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "Do you handle taxes for small businesses?",
    a: "Absolutely! We provide end-to-end tax compliance services for small businesses, including quarterly filings, year-end reports, and advisory services. Our team ensures your books are always ready for tax season, minimizing errors and avoiding penalties. We also offer guidance on deductions and credits to optimize your tax savings."
  },
  {
    q: "Can I see real-time financial reports?",
    a: "Yes! Our cloud-based dashboard lets you access live financial reports anytime. You can track cash flow, revenue, expenses, and profits in real-time. Additionally, you can export reports in multiple formats and customize views for different stakeholders or departments."
  },
  {
    q: "How do you ensure accuracy in bookkeeping?",
    a: "Our accounting experts follow strict protocols including double-entry bookkeeping, cross-checks, and monthly reconciliations. Every transaction is reviewed to ensure correctness. We also use automated tools that minimize human error and provide alerts for any discrepancies."
  },
  {
    q: "Do you offer financial consulting?",
    a: "Yes! Beyond bookkeeping, we provide strategic financial consulting. This includes budgeting, cash flow management, forecasting, and KPI tracking. Our goal is to help businesses not just manage finances but also make smarter growth decisions backed by data insights."
  },
  {
    q: "How secure is my financial data?",
    a: "Data security is our top priority. All financial information is encrypted both in transit and at rest. We use secure cloud servers, multi-factor authentication, and strict access controls. You can trust that your sensitive data is protected against unauthorized access at all times."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-6 lg:px-20 py-24 z-10 relative">
      <div className="text-center mb-16">
        <p className="text-cyan-400 uppercase tracking-widest">FAQs</p>
        <h2 className="text-4xl font-bold mt-4">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
            >
              <h3 className="text-xl font-semibold">{faq.q}</h3>
              {openIndex === idx ? <ChevronUp className="text-cyan-400" /> : <ChevronDown className="text-cyan-400" />}
            </button>

            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="px-6 pb-6 text-slate-300 leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}