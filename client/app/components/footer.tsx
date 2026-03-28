import React from "react";
// import { Mail, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 relative overflow-hidden">
      
      {/* Optional floating background circles for subtle movement */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16 grid lg:grid-cols-4 gap-12 relative z-10">
        
        {/* Logo and description */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-4">FinancePro</h2>
          <p className="text-slate-400 leading-relaxed">
            Premium accounting and finance solutions for modern businesses. Accurate books, insightful reporting, and expert financial advice to help you grow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-cyan-400 transition">Home</a></li>
            <li><a href="/about-us" className="hover:text-cyan-400 transition">About Us</a></li>
            <li><a href="/services" className="hover:text-cyan-400 transition">Services</a></li>
            <li><a href="/contact" className="hover:text-cyan-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
          <ul className="space-y-2">
            <li><a href="/services#bookkeeping" className="hover:text-cyan-400 transition">Bookkeeping</a></li>
            <li><a href="/services#financial-reporting" className="hover:text-cyan-400 transition">Financial Reporting</a></li>
            <li><a href="/services#tax-compliance" className="hover:text-cyan-400 transition">Tax & Compliance</a></li>
            <li><a href="/services#consulting" className="hover:text-cyan-400 transition">Financial Consulting</a></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-slate-400 mb-4">
            123 Finance Street, Suite 100<br/>
            New York, NY 10001<br/>
            info@financepro.com
          </p>

          <div className="flex gap-4 mb-4">
            {/* <a href="#" className="hover:text-cyan-400 transition"><Facebook size={20} /></a>
            <a href="#" className="hover:text-cyan-400 transition"><Twitter size={20} /></a>
            <a href="#" className="hover:text-cyan-400 transition"><Linkedin size={20} /></a> */}
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
            />
            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-r-2xl flex items-center gap-2 transition">
              {/* <Mail size={16} />  */}
              Subscribe
            </button>
          </div>
        </div>

      </div>

      <div className="mt-16 border-t border-slate-700 py-6 text-center text-slate-500 text-sm relative z-10">
        &copy; {new Date().getFullYear()} FinancePro. All rights reserved.
      </div>
    </footer>
  );
}