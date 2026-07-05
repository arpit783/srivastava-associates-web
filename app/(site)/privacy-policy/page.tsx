import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-navy mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: January 2024</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6 text-gray-700 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-navy text-base mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you fill out loan application forms, callback requests, or contact us. This includes your name, phone number, email address, PAN card details, and financial information.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy text-base mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process your loan application and connect you with appropriate lenders</li>
              <li>To communicate with you about your application status</li>
              <li>To send you relevant loan offers and information (with your consent)</li>
              <li>To comply with regulatory requirements</li>
            </ul>
          </section>
          <section>
            <h2 className="font-bold text-navy text-base mb-2">3. Information Sharing</h2>
            <p>We share your information with banks and NBFCs only for the purpose of processing your loan application. We do not sell or rent your personal information to third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy text-base mb-2">4. WhatsApp Communication</h2>
            <p>By contacting us on WhatsApp or providing your number, you consent to receive loan-related communications on WhatsApp. You can opt out anytime by replying "STOP".</p>
          </section>
          <section>
            <h2 className="font-bold text-navy text-base mb-2">5. Data Security</h2>
            <p>We use industry-standard security measures to protect your information. Documents you upload are stored securely on Firebase Storage with restricted access.</p>
          </section>
          <section>
            <h2 className="font-bold text-navy text-base mb-2">6. Contact Us</h2>
            <p>For privacy concerns, contact us at: srivastavaassociates01@gmail.com or call 8306445333.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
