"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/callbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, loanType: "general-inquiry", source: "contact-form" }),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you shortly.");
        setForm({ name: "", phone: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px flex-1 max-w-20 bg-gold" />
            <span className="section-subtitle">CONTACT US</span>
            <div className="h-px flex-1 max-w-20 bg-gold" />
          </div>
          <h2 className="section-title">Get in Touch</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-navy mb-6">We're Here to Help</h3>
            <div className="space-y-5">
              {[
                { icon: Phone, label: "Phone", value: "8306445333", href: "tel:8306445333" },
                {
                  icon: Mail,
                  label: "Email",
                  value: "srivastavaassociates01@gmail.com",
                  href: "mailto:srivastavaassociates01@gmail.com",
                },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Opp. Private Bus Stand, Ramganj Mandi, Kota, Rajasthan",
                  href: "https://maps.app.goo.gl/RXf9yuhxCwou6iEm6?g_st=iw",
                },
                { icon: Clock, label: "Hours", value: "Mon–Sat: 9 AM – 7 PM" },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
                    {href ? (
                      <a href={href} className="text-navy font-medium hover:text-gold transition-colors text-sm">
                        {value}
                      </a>
                    ) : (
                      <span className="text-navy font-medium text-sm">{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 space-y-5">
            <h3 className="text-lg font-bold text-navy">Send a Message</h3>
            <div>
              <label className="label">Your Name</label>
              <input
                className="input-field"
                placeholder="Amit Sharma"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                className="input-field"
                placeholder="9876543210"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input-field resize-none"
                rows={4}
                placeholder="Tell us about your loan requirement..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
