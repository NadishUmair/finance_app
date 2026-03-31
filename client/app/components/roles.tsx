import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

const roles = [
  {
    title: "Super Admin",
    subtitle: "The company owner / founder",
    color: "text-cyan-400",
    features: [
      { text: "Invite & remove users", allowed: true },
      { text: "Set company settings, region, currency", allowed: true },
      { text: "Create & edit all transactions", allowed: true },
      { text: "Create & send invoices", allowed: true },
      { text: "Approve or reject expenses", allowed: true },
      { text: "View all reports", allowed: true },
      { text: "Delete data", allowed: true },
      { text: "Connect bank / payment gateway", allowed: true },
    ],
  },
  {
    title: "Accountant",
    subtitle: "Your hired accountant or finance team",
    color: "text-indigo-400",
    features: [
      { text: "Cannot invite users", allowed: false },
      { text: "Cannot change company settings", allowed: false },
      { text: "Create & edit transactions", allowed: true },
      { text: "Create & send invoices", allowed: true },
      { text: "Approve expenses", allowed: true },
      { text: "View & export all reports", allowed: true },
      { text: "Cannot delete data", allowed: false },
      { text: "Cannot connect bank", allowed: false },
    ],
  },
  {
    title: "Viewer / Employee",
    subtitle: "Staff who submit expenses",
    color: "text-slate-300",
    features: [
      { text: "Cannot invite users", allowed: false },
      { text: "Cannot edit transactions", allowed: false },
      { text: "Cannot create invoices", allowed: false },
      { text: "Submit own expenses only", allowed: true },
      { text: "View dashboard (read only)", allowed: true },
      { text: "Cannot see reports", allowed: false },
      { text: "Cannot delete anything", allowed: false },
      { text: "Cannot connect bank", allowed: false },
    ],
  },
];

export default function RolesSection() {
  return (
    <section className="px-6 lg:px-20 py-24 relative">
      {/* Heading */}
      <div className="text-center mb-16">
        <p className="text-cyan-400 uppercase tracking-widest">
          Permissions
        </p>
        <h2 className="text-4xl font-bold mt-4">
          Role Based Access Control
        </h2>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {roles.map((role, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-all"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <h3 className={`text-2xl font-semibold ${role.color}`}>
                {role.title}
              </h3>
              <p className="text-slate-400 mt-1 text-sm">
                {role.subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="p-6 space-y-4">
              {role.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  {feature.allowed ? (
                    <CheckCircle className="text-cyan-400 mt-1" size={18} />
                  ) : (
                    <XCircle className="text-slate-500 mt-1" size={18} />
                  )}
                  <p
                    className={`text-sm ${
                      feature.allowed
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}