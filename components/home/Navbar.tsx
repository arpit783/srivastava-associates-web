"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Home Loan", href: "/services/home-loan" },
      { label: "Mortgage Loan", href: "/services/mortgage-loan" },
      { label: "Business Loan", href: "/services/business-loan" },
      { label: "Car Loan (New)", href: "/services/new-car-loan" },
      { label: "Car Loan (Used)", href: "/services/used-car-loan" },
      { label: "MSME Loan", href: "/services/msme-loan" },
      { label: "Personal Loan", href: "/services/personal-loan" },
      { label: "CC / OD Limit", href: "/services/cc-od-limit" },
      { label: "HCV Loan", href: "/services/hcv-loan" },
      { label: "Equipment Loan", href: "/services/equipment-loan" },
      { label: "General Insurance", href: "/services/general-insurance" },
      { label: "Life Insurance", href: "/services/life-insurance" },
    ],
  },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Loan Process", href: "/loan-process" },
  { label: "Calculator", href: "/emi-calculator" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact Us", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy shadow-lg"
          : "bg-navy"
      )}
    >
      {/* Top bar */}
      <div className="bg-navy-950 border-b border-navy-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center text-xs text-gray-300">
          <div className="flex items-center gap-4">
            <span>Since 1998</span>
            <span className="text-gold">•</span>
            <span>30+ Banks & NBFC Tie-ups</span>
            <span className="text-gold">•</span>
            <span>1000+ Happy Clients</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:8306445333" className="flex items-center gap-1 hover:text-gold transition-colors">
              <Phone className="w-3 h-3" /> 8306445333
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 relative flex-shrink-0 bg-white rounded-lg overflow-hidden">
              <Image
                src="/images/logo.png"
                alt="Srivastava Associates Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">SRIVASTAVA</div>
              <div className="text-gold font-bold text-sm leading-tight">ASSOCIATES</div>
              <div className="text-gray-400 text-[9px] leading-none">Easy Loan, Happy Life</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button
                    className="flex items-center gap-1 text-gray-200 hover:text-gold transition-colors text-sm px-3 py-2"
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    {link.label} <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute top-full left-0 bg-navy-950 shadow-xl rounded-lg py-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-navy-800">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-200 hover:text-gold hover:bg-navy-800 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-200 hover:text-gold transition-colors text-sm px-3 py-2"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/apply"
              className="bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gold-400 transition-colors"
            >
              APPLY NOW
            </Link>
          </div>

          {/* Mobile menu btn */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-950 border-t border-navy-800 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label}>
                <div className="text-gray-300 font-medium text-sm py-2">{link.label}</div>
                <div className="pl-4 space-y-1">
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block text-gray-400 hover:text-gold text-sm py-1.5 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-200 hover:text-gold text-sm py-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            href="/apply"
            className="block bg-gold text-navy font-bold text-sm text-center px-5 py-3 rounded-lg mt-4"
            onClick={() => setOpen(false)}
          >
            APPLY NOW
          </Link>
        </div>
      )}
    </nav>
  );
}
