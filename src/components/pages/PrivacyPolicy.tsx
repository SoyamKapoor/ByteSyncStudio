import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      <div className="rounded-2xl bg-[#0D1928] border border-[rgba(100,160,220,0.2)] p-8 sm:p-12 shadow-2xl">
        <div className="flex items-center gap-3 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-3">
          <Shield className="w-4 h-4" />
          <span>Legal Documentation · Draft</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7FB] mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-[#A8B5C7] mb-8 pb-6 border-b border-[rgba(100,160,220,0.15)]">
          Last Updated: October 2026 · ByteSync Studio
        </p>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-lg bg-[#091321] border border-[#087BFF]/30 text-xs text-[#A8B5C7] leading-relaxed mb-8">
          <strong className="text-[#00D9F5] block mb-1">Notice:</strong>
          This document represents the operational draft policy for ByteSync Studio consultation
          intakes and digital interactions. Prior to commercial deployment, consult licensed legal
          counsel in your operating jurisdiction.
        </div>

        <div className="space-y-8 text-sm text-[#A8B5C7] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">1. Information We Collect</h2>
            <p>
              When you submit a consultation request or communicate with ByteSync Studio, we collect:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>Contact details: Full Name and Work Email Address.</li>
              <li>Business context: Company Name, Industry Sector, and Project Scope.</li>
              <li>Operational preferences: Preferred consultation schedule and estimated budget.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">2. How Information is Used</h2>
            <p>
              Information collected through our consultation workflows is utilized solely to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs">
              <li>Evaluate engineering feasibility and prepare customized technical recommendations.</li>
              <li>Schedule, confirm, and conduct discovery video calls.</li>
              <li>Transmit direct correspondence regarding your inquiry.</li>
            </ul>
            <p className="mt-2 text-xs">
              We never sell, lease, or monetize your contact details or project specifications to third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">3. Storage & Data Security</h2>
            <p>
              Consultation records are stored in PostgreSQL instances protected by Row-Level Security (RLS)
              policies. Public web visitors cannot query or harvest submission records. All network
              transmissions use TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">4. Data Subject Rights & Deletion</h2>
            <p>
              You maintain the right to inspect, rectify, or request permanent deletion of your
              consultation intake records at any time. Direct deletion requests to{' '}
              <a href={`mailto:${siteConfig.email}`} className="text-[#00D9F5] hover:underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">5. Contact Information</h2>
            <p>
              For privacy and data governance questions:
              <br />
              ByteSync Studio · Instagram: {siteConfig.instagramHandle} · Email: {siteConfig.email}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
