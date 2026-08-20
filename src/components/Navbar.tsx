import React, { useState, useEffect } from 'react';
import { Building2, Menu, X, CheckCircle, ChevronRight, PhoneCall } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenEligibility: (projectName?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenEligibility,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'properties', label: 'Properties' },
    { id: 'projects', label: 'Projects' },
    { id: 'calculator', label: 'Kalkulator Kelayakan' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tab: ActiveTab) => {
  setActiveTab(tab);
  setIsMobileMenuOpen(false);

  const pathMap: Record<ActiveTab, string> = {
  home: '/',
  properties: '/properties',
  projects: '/projects',
  calculator: '/kalkulator-loan',
  about: '/about',
  contact: '/contact',
  eligibility: '/semak-kelayakan',
};

  window.history.pushState({}, '', pathMap[tab]);

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg py-3'
          : 'bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <span className="block font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                Klang Valley <span className="text-amber-400">Homes</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Property Platform Malaysia
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === link.id
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Primary CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => {
  window.history.pushState({}, '', '/semak-kelayakan');
  onOpenEligibility();
}}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2 transform active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Semak Kelayakan Anda</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
  setIsMobileMenuOpen(false);
  window.history.pushState({}, '', '/semak-kelayakan');
  onOpenEligibility();
}}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1"
            >
              <span>Kelayakan</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-left transition-all ${
                  activeTab === link.id
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEligibility();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Semak Kelayakan Anda</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
