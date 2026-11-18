import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { siteConfig } from '../../config/site';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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
          <FileText className="w-4 h-4" />
          <span>Terms of Service · Draft</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F7FB] mb-4">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-[#A8B5C7] mb-8 pb-6 border-b border-[rgba(100,160,220,0.15)]">
          Last Updated: October 2026 · ByteSync Studio
        </p>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-lg bg-[#091321] border border-[#087BFF]/30 text-xs text-[#A8B5C7] leading-relaxed mb-8">
          <strong className="text-[#00D9F5] block mb-1">Notice:</strong>
          These terms govern website usage and initial consultation inquiries. Full enterprise client
          engagements are governed by a separate Master Services Agreement (MSA) and Statement of Work (SOW).
        </div>

        <div className="space-y-8 text-sm text-[#A8B5C7] leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">
              1. Consultation Requests & Confirmation
            </h2>
            <p>
              Submitting a consultation booking form via this website registers a request for technical
              review. It does not constitute a legally binding agreement to deliver software services or
              a confirmed calendar reservation until written confirmation is issued by ByteSync Studio.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">
              2. Rescheduling & Cancellations
            </h2>
            <p>
              Either party may reschedule or cancel a discovery session with at least 24 hours prior
              notice by replying to the confirmation correspondence.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">
              3. Scope & Feasibility Assessments
            </h2>
            <p>
              Preliminary architectural opinions or high-level estimates discussed during discovery
              calls are non-binding technical evaluations. Formal engineering quotes and warranties are
              only established through mutually executed contracts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">
              4. Intellectual Property
            </h2>
            <p>
              All proprietary brand marks, site architecture, and demonstration materials on this
              website remain the intellectual property of ByteSync Studio. Materials submitted by the
              client during inquiries remain the exclusive property of the respective client.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-[#F4F7FB] mb-2">
              5. Governing Contact
            </h2>
            <p>
              Inquiries regarding these terms:
              <br />
              ByteSync Studio · Email: {siteConfig.email} · Instagram: {siteConfig.instagramHandle}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
