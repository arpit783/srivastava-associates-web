import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Loan Process", href: "/loan-process" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const SERVICES = [
  { label: "Home Loan", href: "/services/home-loan" },
  { label: "Mortgage Loan", href: "/services/mortgage-loan" },
  { label: "Business Loan", href: "/services/business-loan" },
  { label: "MSME Loan", href: "/services/msme-loan" },
  { label: "New Car Loan", href: "/services/new-car-loan" },
  { label: "Used Car Loan", href: "/services/used-car-loan" },
  { label: "CC / OD Limit", href: "/services/cc-od-limit" },
  { label: "Personal Loan", href: "/services/personal-loan" },
  { label: "Loan Against Property", href: "/services/mortgage-loan" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 relative flex-shrink-0 bg-white rounded-lg overflow-hidden">
                <Image
                  src="/images/logo.png"
                  alt="Srivastava Associates Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <div className="text-white font-bold text-sm">SRIVASTAVA ASSOCIATES</div>
                <div className="text-gold text-xs">Easy Loan, Happy Life</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Srivastava Associates is a trusted financial advisory firm since
              1998. We check your loan solutions from 30+ banks & NBFCs to help
              you achieve your dreams.
            </p>
            <div className="flex gap-3 mt-5">
              {/* Facebook */}
              <a href="https://www.facebook.com/share/17PBVRqj96/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center hover:bg-[#1877F2] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/srivastavaassociates_loan?igsh=eXEyY2NlZDNlcWE5&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center hover:bg-[#E1306C] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* Google Maps */}
              <a href="https://maps.app.goo.gl/RXf9yuhxCwou6iEm6?g_st=iw" target="_blank" rel="noopener noreferrer" aria-label="Google Maps"
                className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center hover:bg-[#EA4335] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/message/FMB4BVPRQLMUC1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center hover:bg-[#25D366] transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gold rounded-full" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Our Services</h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-gray-400 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gold rounded-full" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:8306445333" className="flex items-start gap-3 text-sm text-gray-400 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  8306445333
                </a>
              </li>
              <li>
                <a href="mailto:srivastavaassociates01@gmail.com" className="flex items-start gap-3 text-sm text-gray-400 hover:text-gold transition-colors">
                  <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                  srivastavaassociates01@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                Opp. Private Bus Stand, Ramganj Mandi, Kota, Rajasthan
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/apply"
                className="bg-gold text-navy font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-gold-400 transition-colors inline-block text-center"
              >
                Apply for Loan →
              </Link>
              <a
                href="https://wa.me/message/FMB4BVPRQLMUC1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#1ebe5d] transition-colors text-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2024 Srivastava Associates. All Rights Reserved.</p>
          <p>
            Designed with ♥ for your financial growth
          </p>
        </div>
      </div>
    </footer>
  );
}
