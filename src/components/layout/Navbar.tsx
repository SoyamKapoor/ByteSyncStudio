import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onNavigate?: (route: string) => void;
  activeRoute?: string;
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeRoute = 'home',
  onOpenCommandPalette,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (activeRoute !== 'home') {
      if (onNavigate) onNavigate('home');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConsultation = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (activeRoute !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('consultation');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('consultation');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-[#050B14]/90 backdrop-blur-md border-[rgba(100,160,220,0.18)] shadow-lg shadow-black/30 py-2'
          : 'bg-[#050B14]/75 backdrop-blur-md border-[rgba(100,160,220,0.12)] py-2 sm:py-2.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: 3 Zones with gap-8 */}
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark / Logo */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, 'hero')}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5] rounded-md shrink-0"
            aria-label="ByteSync Studio Home"
          >
            <BrandLogo size="md" />
          </a>

          {/* Zone 2: Navigation Links (single-line, concise) */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-[#A8B5C7]">
            <a
              href="#hero"
              onClick={(e) => handleLinkClick(e, 'hero')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Home
            </a>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, 'services')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Services
            </a>
            <a
              href="#solutions"
              onClick={(e) => handleLinkClick(e, 'solutions')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Solutions
            </a>
            <a
              href="#work"
              onClick={(e) => handleLinkClick(e, 'work')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Our Work
            </a>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, 'about')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              About
            </a>
            <a
              href="#faq"
              onClick={(e) => handleLinkClick(e, 'faq')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 'contact')}
              className="hover:text-[#00D9F5] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Command Palette shortcut button & Primary Action CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {onOpenCommandPalette && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#091321] hover:bg-[#0D1928] border border-[rgba(100,160,220,0.2)] hover:border-[#00D9F5]/40 text-[#A8B5C7] hover:text-[#F4F7FB] text-xs font-mono transition-colors"
                title="Command Palette (Cmd + K / Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-[#00D9F5]" />
                <span className="text-[11px] text-[#A8B5C7]">Quick Actions</span>
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-[#050B14] border border-white/10 text-[#00D9F5]">
                  ⌘K
                </kbd>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={scrollToConsultation}
              className="px-4 py-1.5 text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] hover:to-[#00D9F5] rounded-lg transition-all duration-200 shadow-sm shadow-[#087BFF]/20 hover:shadow-md hover:shadow-[#00D9F5]/25 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
            >
              Book a Consultation
            </motion.button>
          </div>

          {/* Mobile Search & Hamburger Buttons */}
          <div className="md:hidden flex items-center gap-1.5">
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="p-2 text-[#00D9F5] hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
                aria-label="Open quick actions palette"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A8B5C7] hover:text-[#F4F7FB] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9F5]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#091321] border-b border-[rgba(100,160,220,0.2)] px-6 py-6 space-y-4 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col space-y-3 text-base font-medium text-[#A8B5C7]">
              <a
                href="#hero"
                onClick={(e) => handleLinkClick(e, 'hero')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                Home
              </a>
              <a
                href="#services"
                onClick={(e) => handleLinkClick(e, 'services')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                Services
              </a>
              <a
                href="#solutions"
                onClick={(e) => handleLinkClick(e, 'solutions')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                Solutions
              </a>
              <a
                href="#work"
                onClick={(e) => handleLinkClick(e, 'work')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                Our Work
              </a>
              <a
                href="#about"
                onClick={(e) => handleLinkClick(e, 'about')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                About
              </a>
              <a
                href="#faq"
                onClick={(e) => handleLinkClick(e, 'faq')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, 'contact')}
                className="hover:text-[#00D9F5] py-1 border-b border-white/5 transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={scrollToConsultation}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#087BFF] to-[#0098f5] rounded-lg shadow-md shadow-[#087BFF]/20"
              >
                Book a Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
