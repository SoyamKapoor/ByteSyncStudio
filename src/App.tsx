import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Capabilities } from './components/sections/Capabilities';
import { Services } from './components/sections/Services';
import { Industries } from './components/sections/Industries';
import { Process } from './components/sections/Process';
import { Portfolio } from './components/sections/Portfolio';
import { WhyByteSync } from './components/sections/WhyByteSync';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ } from './components/sections/FAQ';
import { Consultation } from './components/sections/Consultation';
import { Contact } from './components/sections/Contact';

import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { AdminLogin } from './components/pages/AdminLogin';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { IndustryType, ServiceType } from './types';
import { Loader2 } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { CommandPalette } from './components/ui/CommandPalette';
import { TelemetryBar } from './components/ui/TelemetryBar';

type RouteType = 'home' | 'privacy' | 'terms' | 'admin-login' | 'admin-dashboard';

function getRouteFromPath(pathname: string, hash: string = ''): RouteType {
  // Check hash first for deep-linking on static hosts (e.g. #/privacy, #/admin)
  const hashClean = hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if (hashClean === 'privacy') return 'privacy';
  if (hashClean === 'terms') return 'terms';
  if (hashClean === 'admin/login' || hashClean === 'login') return 'admin-login';
  if (hashClean === 'admin' || hashClean === 'admin-dashboard') return 'admin-dashboard';

  // Strip baseUrl if running under a repository subpath (e.g. /ByteSyncStudio/)
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  let clean = pathname.replace(/\/+$/, '') || '/';
  if (baseUrl && clean.startsWith(baseUrl)) {
    clean = clean.slice(baseUrl.length) || '/';
  }
  clean = clean.replace(/\/+$/, '') || '/';

  if (clean === '/privacy') return 'privacy';
  if (clean === '/terms') return 'terms';
  if (clean === '/admin/login') return 'admin-login';
  if (clean === '/admin') return 'admin-dashboard';
  return 'home';
}

function getPathFromRoute(route: RouteType): string {
  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  if (route === 'home') return baseUrl ? `${baseUrl}/` : '/';
  if (route === 'admin-login') return `${baseUrl}/admin/login`;
  if (route === 'admin-dashboard') return `${baseUrl}/admin`;
  return `${baseUrl}/${route}`;
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<RouteType>(() => {
    return typeof window !== 'undefined'
      ? getRouteFromPath(window.location.pathname, window.location.hash)
      : 'home';
  });

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('bytesync_admin_token') : null;
  });

  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);

  // Preselection state for booking form
  const [selectedService, setSelectedService] = useState<ServiceType | undefined>(undefined);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | undefined>(undefined);

  // Command Palette open state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Synchronize browser history, back/forward, and hash navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromPath(window.location.pathname, window.location.hash));
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleNavigate = (route: string) => {
    let targetRoute: RouteType = 'home';
    if (route === 'home' || route === 'privacy' || route === 'terms') {
      targetRoute = route;
    } else if (route === 'admin-login' || route === 'login') {
      targetRoute = 'admin-login';
    } else if (route === 'admin' || route === 'admin-dashboard') {
      targetRoute = 'admin-dashboard';
    }

    setCurrentRoute(targetRoute);
    const newPath = getPathFromRoute(targetRoute);
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated server-side authorization check whenever admin routes are accessed
  useEffect(() => {
    const verifyServerSession = async () => {
      // If we are not on an admin route, no need to verify admin token immediately
      if (currentRoute !== 'admin-dashboard' && currentRoute !== 'admin-login') {
        return;
      }

      if (!adminToken) {
        setIsAuthenticatedAdmin(false);
        setIsVerifyingAuth(false);
        if (currentRoute === 'admin-dashboard') {
          // Unauthenticated visitors trying to access /admin are redirected to dedicated /admin/login
          handleNavigate('admin-login');
        }
        return;
      }

      setIsVerifyingAuth(true);
      try {
        const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
        const endpoint = apiUrl ? `${apiUrl}/api/admin/verify` : '/api/admin/verify';
        const res = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          throw new Error('Non-JSON response from server');
        }

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user?.role === 'administrator') {
            setIsAuthenticatedAdmin(true);
            if (currentRoute === 'admin-login') {
              // Already authenticated administrator visiting /admin/login is redirected to protected /admin dashboard
              handleNavigate('admin-dashboard');
            }
          } else {
            // Not authorized or invalid role
            sessionStorage.removeItem('bytesync_admin_token');
            setAdminToken(null);
            setIsAuthenticatedAdmin(false);
            if (currentRoute === 'admin-dashboard') {
              handleNavigate('admin-login');
            }
          }
        } else {
          // Invalid or expired token on server
          sessionStorage.removeItem('bytesync_admin_token');
          setAdminToken(null);
          setIsAuthenticatedAdmin(false);
          if (currentRoute === 'admin-dashboard') {
            handleNavigate('admin-login');
          }
        }
      } catch (err) {
        console.warn('[Admin Verification Error]', err);
        // On connection error or failed check, reject protected access
        setIsAuthenticatedAdmin(false);
        if (currentRoute === 'admin-dashboard') {
          handleNavigate('admin-login');
        }
      } finally {
        setIsVerifyingAuth(false);
      }
    };

    verifyServerSession();
  }, [currentRoute, adminToken]);

  const handleLoginSuccess = (token: string) => {
    sessionStorage.setItem('bytesync_admin_token', token);
    setAdminToken(token);
    setIsAuthenticatedAdmin(true);
    handleNavigate('admin-dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('bytesync_admin_token');
    setAdminToken(null);
    setIsAuthenticatedAdmin(false);
    handleNavigate('admin-login');
  };

  const handleSelectService = (service: ServiceType) => {
    setSelectedService(service);
  };

  const handleSelectIndustry = (industry: IndustryType) => {
    setSelectedIndustry(industry);
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F7FB] flex flex-col font-sans selection:bg-[#087BFF]/30 selection:text-[#00D9F5]">
      {/* Precision Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#087BFF] via-[#00D9F5] to-[#087BFF] origin-left z-50 shadow-[0_0_12px_rgba(0,217,245,0.7)] pointer-events-none"
        style={{ scaleX }}
      />

      {/* Developer Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Global Navigation */}
      <Navbar
        onNavigate={handleNavigate}
        activeRoute={currentRoute}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <>
            <Hero onSelectService={handleSelectService} />
            <TelemetryBar />
            <Capabilities />
            <Services onSelectService={handleSelectService} />
            <Industries onSelectIndustry={handleSelectIndustry} />
            <Process />
            <Portfolio />
            <WhyByteSync />
            <Testimonials />
            <FAQ />
            <Consultation
              initialService={selectedService}
              initialIndustry={selectedIndustry}
            />
            <Contact />
          </>
        )}

        {currentRoute === 'privacy' && (
          <PrivacyPolicy onBack={() => handleNavigate('home')} />
        )}

        {currentRoute === 'terms' && (
          <TermsOfService onBack={() => handleNavigate('home')} />
        )}

        {currentRoute === 'admin-login' && (
          <AdminLogin
            onLoginSuccess={handleLoginSuccess}
            onBackToSite={() => handleNavigate('home')}
          />
        )}

        {currentRoute === 'admin-dashboard' && (
          <>
            {isVerifyingAuth || !isAuthenticatedAdmin || !adminToken ? (
              <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <Loader2 className="w-8 h-8 text-[#00D9F5] animate-spin mb-4" />
                <p className="text-sm text-[#A8B5C7] font-mono">
                  Verifying administrator authorization...
                </p>
              </div>
            ) : (
              <AdminDashboard
                token={adminToken}
                onLogout={handleLogout}
                onBackToSite={() => handleNavigate('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer (shown on public routes) */}
      {currentRoute !== 'admin-dashboard' && currentRoute !== 'admin-login' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
