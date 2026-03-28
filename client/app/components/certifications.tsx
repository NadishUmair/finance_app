import React from "react";

// Example images — replace these URLs with real certificate images you upload or find
const certImages = {
  CPA: "/certificates/cpa.jpg",
  CFA: "/certificates/cfa.jpg",
  ACCA: "/certificates/acca.jpg",
  CMA: "/certificates/cma.jpg",
  FMVA: "/certificates/fmva.jpg",
};

const certifications = [
  {
    name: "Certified Public Accountant (CPA)",
    subtitle: "Gold Standard in Accounting",
    desc: "One of the most prestigious accounting certifications. CPAs are experts in financial reporting, audit, tax and compliance, and are highly valued by top firms worldwide.",
    img: certImages.CPA,
  },
  {
    name: "Chartered Financial Analyst (CFA)",
    subtitle: "Elite Finance & Investment Credential",
    desc: "Highly respected in investment analysis, portfolio management, and corporate finance. CFA holders are often found in asset management and investment banking roles.",
    img: certImages.CFA,
  },
  {
    name: "Association of Chartered Certified Accountants (ACCA)",
    subtitle: "Global Accounting Qualification",
    desc: "Recognized internationally, ACCA focuses on all aspects of accounting, financial management, and strategy. A powerful credential for global practitioners.",
    img: certImages.ACCA,
  },
  {
    name: "Certified Management Accountant (CMA)",
    subtitle: "Strategic Financial Leadership",
    desc: "Focuses on management accounting, financial planning and analysis — ideal for corporate finance professionals and strategic decision roles.",
    img: certImages.CMA,
  },
  {
    name: "Financial Modeling & Valuation Analyst (FMVA)",
    subtitle: "Practical Corporate Finance Skillset",
    desc: "Hands‑on training in real financial models used in valuation, corporate finance, and FP&A. This certification bridges theoretical finance and workplace needs.",
    img: certImages.FMVA,
  },
];

export default function CertificationsPage() {
  return (
    <div className="bg-slate-950 text-white">
      <section className="text-center py-20 px-6 lg:px-20">
        <h1 className="text-5xl font-bold mb-4">Top Accounting & Finance Certifications</h1>
        <p className="text-slate-300 max-w-3xl mx-auto text-lg">
          Earn credentials that elevate your career in accounting, auditing, financial analysis, and strategic decision‑making. Certifications highlight expertise and professional excellence.:contentReference[oaicite:1]{index=1}
        </p>
      </section>

      {certifications.map((cert, idx) => (
        <section key={idx} className="flex flex-col lg:flex-row items-center gap-12 py-16 px-6 lg:px-20 border-b border-slate-700">
          {/* Certificate Image */}
          <div className="flex‑1">
            <img
              src={cert.img}
              alt={cert.name}
              className="w‑full rounded‑2xl shadow‑2xl object‑cover h‑64 lg:h‑80"
            />
          </div>

          {/* Text */}
          <div className="flex‑1">
            <h2 className="text‑4xl font‑bold mb‑2">{cert.name}</h2>
            <h4 className="text‑xl text‑cyan‑400 mb‑4">{cert.subtitle}</h4>
            <p className="text‑lg text‑slate‑300 leading‑relaxed">
              {cert.desc}
            </p>
          </div>
        </section>
      ))}

      {/* CTA AT BOTTOM */}
      <section className="text‑center py‑20 px‑6 lg:px‑20 bg‑gradient‑to‑r from‑cyan‑500 to‑blue‑600 rounded‑2xl mx‑6 lg:mx‑20 mt‑12">
        <h2 className="text‑4xl font‑bold mb‑4">Become Certified & Advance Your Career</h2>
        <p className="text‑lg text‑white/90 mb‑8">
          Choosing the right certification can unlock leadership roles, salary growth and international opportunities.
        </p>
        <button className="bg‑black text‑white px‑8 py‑4 rounded‑2xl font‑semibold text‑lg hover:bg‑gray‑900 transition">
          Explore Courses & Apply
        </button>
      </section>
    </div>
  );
}