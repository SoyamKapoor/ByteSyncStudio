import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

const faqs: FAQItem[] = [
  {
    id: 'discovery-process',
    question: 'What happens during the initial Discovery Consultation?',
    answer:
      'We conduct a deep architectural review of your existing workflows, identify operational bottlenecks, and evaluate technical feasibility. Rather than a sales presentation, you receive direct engineering insights into whether AI, automation, or custom software will deliver measurable ROI, along with a high-level technical roadmap.',
    tag: 'Process',
  },
  {
    id: 'privacy-nda',
    question: 'How do you protect our proprietary data and business information?',
    answer:
      'Security and strict privacy are foundational to our engineering practice. We execute mutual Non-Disclosure Agreements (NDAs) before discovery discussions. Systems are deployed in isolated, dedicated cloud environments or directly within your existing AWS, GCP, or Azure tenants. We strictly enforce zero-retention policies so your business data is never used to train public AI models.',
    tag: 'Security & Privacy',
  },
  {
    id: 'timeline',
    question: 'What does a typical project timeline look like from scoping to launch?',
    answer:
      'Targeted automations and specialized AI workflows typically launch in 2 to 4 weeks. Full-scale custom web platforms, data extraction pipelines, and complex backend systems generally take 6 to 12 weeks. We operate with iterative weekly staging releases so you experience continuous working progress.',
    tag: 'Delivery',
  },
  {
    id: 'pricing-structure',
    question: 'How does ByteSync Studio structure engagement pricing?',
    answer:
      'Discovery sessions are 100% complimentary. Subsequent implementations are scoped on clear, fixed-price milestones or structured monthly engineering retainers. You receive full scope transparency and fixed deliverables before any contracts are executed—with zero surprise hourly billing.',
    tag: 'Investment',
  },
  {
    id: 'existing-systems',
    question: 'Can you integrate AI and automation into our existing software and CRM?',
    answer:
      'Yes. The majority of our client projects involve connecting modern AI models to established tools (such as HubSpot, Salesforce, specialized EHRs, Postgres databases, or proprietary legacy portals) via robust API webhooks and secure middleware microservices without requiring a disruptive rewrite.',
    tag: 'Integrations',
  },
  {
    id: 'maintenance-support',
    question: 'Do you provide ongoing support, monitoring, and MLOps after deployment?',
    answer:
      'Yes. We offer continuous SLA-backed maintenance, automated error monitoring, model drift detection, and cloud infrastructure optimization to ensure your systems remain fast, resilient, and secure as your transaction volume grows.',
    tag: 'Support & MLOps',
  },
];

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('discovery-process');

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 relative bg-[#050B14] border-t border-[rgba(100,160,220,0.18)]">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#00D9F5]/5 blur-[130px] pointer-events-none rounded-full animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#087BFF]/5 blur-[140px] pointer-events-none rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-mono font-medium tracking-widest text-[#00D9F5] uppercase mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Clarity & Engineering Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F7FB] leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base text-[#A8B5C7] leading-relaxed">
            Everything you need to know about partnering with ByteSync Studio on your next technical initiative.
          </p>
        </motion.div>

        {/* Accordion List with AnimatePresence */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0D1928] border-[#00D9F5]/50 shadow-lg shadow-[#087BFF]/10'
                    : 'bg-[#091321]/80 border-[rgba(100,160,220,0.18)] hover:border-[rgba(100,160,220,0.35)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 px-6 sm:px-7 flex items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#00D9F5] shrink-0 font-medium hidden sm:inline-block">
                      [{faq.tag}]
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-[#F4F7FB]">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`w-7 h-7 rounded-full bg-[#050B14] border border-[rgba(100,160,220,0.25)] flex items-center justify-center shrink-0 ${
                      isOpen ? 'border-[#00D9F5] text-[#00D9F5]' : 'text-[#A8B5C7]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-7 pb-6 pt-1 text-xs sm:text-sm text-[#A8B5C7] leading-relaxed border-t border-[rgba(100,160,220,0.1)]">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance Callout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 rounded-xl bg-[#091321]/90 border border-[rgba(100,160,220,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#00D9F5] shrink-0" />
            <p className="text-xs text-[#A8B5C7]">
              Have a specific technical architecture or privacy constraint not answered here?
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('consultation');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2 text-xs font-semibold text-[#00D9F5] hover:text-white bg-[#0D1928] hover:bg-[#087BFF] border border-[#00D9F5]/30 rounded-lg transition-colors whitespace-nowrap"
          >
            Ask During Discovery
          </button>
        </motion.div>
      </div>
    </section>
  );
};
