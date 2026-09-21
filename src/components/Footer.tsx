import React from 'react';
import { Building2, Phone, ShieldCheck, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab?: (tab: ActiveTab) => void;
  onOpenEligibility?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-8 border-b border-slate-800/80">

          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>

              <h3 className="font-serif text-lg font-bold text-white tracking-wide uppercase">
                HOME <span className="text-amber-400">BEGINS HERE</span>
              </h3>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pl-10">
              Find what fits your life.
            </p>

            {/* Social Media */}
            <div className="pt-2 pl-10 flex items-center gap-2">
              <a
                href="https://www.facebook.com/ryna.rumahselangor.my"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M13.5 8H16V5h-2.5C10.8 5 9 6.7 9 9.5V11H7v3h2v5h3v-5h2.5l.5-3H12V9.7c0-1.1.4-1.7 1.5-1.7Z" /></svg>
              </a>

              <a
                href="https://www.tiktok.com/@rumahselangor.my"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M14 4h3c.3 1.5 1.2 2.7 3 3.2v3.1c-1.1-.1-2.1-.4-3-.9V14a6 6 0 1 1-5-5.9v3.1a3 3 0 1 0 2 2.8V4Z" /></svg>
              </a>

              <a
                href="https://www.instagram.com/klang_valley_homes?igsh=d3liZzZ2M2JrcXp6&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" /></svg>
              </a>
            </div>
          </div>

          {/* Property Services Info */}
          <div className="space-y-1.5 md:border-l md:border-slate-800/60 md:pl-6">
            <p className="text-xs font-semibold text-amber-400/90 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Agency Registration</span>
            </p>

            <h4 className="text-sm font-bold text-white font-serif">
              Affirm Plus Properties Sdn Bhd
            </h4>

            <p className="text-xs text-slate-400">Registered with LPPEH</p>
            <p className="text-xs text-slate-400 font-mono">
              E (1) 1693
            </p>
          </div>

          {/* Agent & Contact Details */}
          <div className="space-y-1.5 md:border-l md:border-slate-800/60 md:pl-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400/90 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Agent Contact</span>
            </div>

            <h4 className="text-sm font-bold text-white font-serif">
              Ryna Arif
            </h4>

            <p className="text-xs text-slate-300">
              Senior Real Estate Negotiator
            </p>

            <p className="text-xs text-slate-400 font-mono">
              REN 62310
            </p>

            <div className="pt-2 flex flex-col sm:flex-row md:flex-col gap-2">
              <a
                href="tel:+60178399316"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Phone: 017-8399316</span>
              </a>

              <a
                href="tel:+601114863480"
                className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit"
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Phone: 011-14863480</span>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright Section */}
        <div className="pt-6 text-center text-xs text-slate-500 font-medium">
          <p>© 2026 HOME BEGINS HERE. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};
