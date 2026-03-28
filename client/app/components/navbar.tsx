import React, { useState } from "react";
import { Link as RouterLink } from "react-router"; // assuming react-router
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const services = [
    { title: "Bookkeeping", link: "#bookkeeping" },
    { title: "Financial Reporting", link: "#financial-reporting" },
    { title: "Tax & Compliance", link: "#tax-compliance" },
  ];

  return (
    <nav className="flex justify-between items-center p-6 bg-slate-900 text-white  w-full z-50 shadow">
      <div className="text-2xl font-bold">Logo</div>

      <div className="flex items-center gap-6">
        <RouterLink to="/">Home</RouterLink>

        {/* Services Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 hover:text-cyan-400 transition"
          >
            Services <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute top-full left-0 bg-slate-800 rounded-lg shadow-lg mt-2 w-64 py-4 px-2 grid gap-2">
              {services.map((service, index) => (
                <a
                  key={index}
                  href={service.link}
                  className="hover:bg-slate-700 rounded px-3 py-2 transition"
                  onClick={() => setOpen(false)}
                >
                  {service.title}
                </a>
              ))}
            </div>
          )}
        </div>

        <RouterLink to="/about-us">About Us</RouterLink>
        <RouterLink to="/contact-us">Contact</RouterLink>
        <RouterLink to="/login" className="bg-cyan-500 text-black px-4 py-2 rounded-lg">Login</RouterLink>
        <RouterLink to="/signup" className="bg-cyan-500 text-black px-4 py-2 rounded-lg">Signup</RouterLink>
      </div>
    </nav>
  );
};

export default Navbar;