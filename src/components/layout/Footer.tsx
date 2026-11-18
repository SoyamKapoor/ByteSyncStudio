import React from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { siteConfig } from '../../config/site';
import { Instagram, Mail, Linkedin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050B14] border-t border-[rgba(100,160,220,0.18)] pt-16 pb-12 text-[#A8B5C7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[rgba(100,160,220,0.12)]">
          {/* Brand & Description (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline />
            <p className="text-xs sm:text-sm text-[#A8B5C7] max-w-sm leading-relaxed">
              AI engineering, custom software, and intelligent automation for businesses ready to grow
              digitally.
            </p>
            <div className="text-xs text-[#00D9F5] font-mono">
              {siteConfig.taglineSecondary}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] flex items-center justify-center text-[#A8B5C7] hover:text-[#00D9F5] hover:border-[#00D9F5]/40 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-8 h-8 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] flex items-center justify-center text-[#A8B5C7] hover:text-[#087BFF] hover:border-[#087BFF]/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              {/* LinkedIn: Coming Soon */}
              <div
                className="relative group w-8 h-8 rounded-lg bg-[#091321] border border-[rgba(100,160,220,0.2)] flex items-center justify-center text-[#A8B5C7]/70 hover:text-[#00D9F5] hover:border-[#00D9F5]/40 transition-colors cursor-default"
                aria-label="LinkedIn (Coming Soon)"
                title="LinkedIn (Coming Soon)"
              >
                <Linkedin className="w-4 h-4" />
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-mono bg-[#0D1928] text-[#00D9F5] border border-[rgba(100,160,220,0.3)] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold uppercase text-[#F4F7FB] tracking-wider">
              Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('solutions')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('work')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Our Work
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold uppercase text-[#F4F7FB] tracking-wider">
              Core Services
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  AI & Machine Learning
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Custom Web Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Backend & APIs
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  Business Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-[#F4F7FB] transition-colors"
                >
                  MLOps Engineering
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Operations */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-semibold uppercase text-[#F4F7FB] tracking-wider">
              Governance & Admin
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-[#00D9F5] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-[#00D9F5] transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="hover:text-[#087BFF] transition-colors text-left font-mono"
                >
                  Administrator Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8B5C7]/70">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-[#A8B5C7]/50">
              Instagram: {siteConfig.instagramHandle}
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[#00D9F5] transition-colors"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
