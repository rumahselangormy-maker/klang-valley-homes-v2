import React from 'react';
import { PhoneCall, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactSectionProps {
  onOpenEligibility: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenEligibility }) => {
  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <MessageSquare className="w-4 h-4" />
              <span>Sokongan & Pertanyaan</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Need help choosing a property?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Our team can help you explore suitable property options based on your preferred location, budget and eligibility.
            </p>

            {/* Quick Contact Options */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase block">Kawasan Liputan</span>
                <p className="text-sm font-semibold text-white">Seluruh Klang Valley & Selangor</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase block">Masa Respons</span>
                <p className="text-sm font-semibold text-white">Dalam Masa 24 Jam</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase block">Yuran Perkhidmatan</span>
                <p className="text-sm font-semibold text-white">100% PERCUMA</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenEligibility()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Hubungi Kami / Semak Kelayakan</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
