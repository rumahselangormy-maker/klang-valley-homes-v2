import React from 'react';
import { Building2, Users, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenEligibility: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEligibility }) => {
  return (
    <section className="py-20 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <Building2 className="w-4 h-4" />
              <span>Tentang Klang Valley Homes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Platform Hartanah Pilihan Di Klang Valley
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              Klang Valley Homes is a property platform designed to make it easier for buyers and property seekers to discover suitable homes and projects around Klang Valley.
            </p>

            <p className="text-slate-300 text-base leading-relaxed">
              Our team will assist you throughout the property enquiry process.
            </p>

            {/* Core Commitments */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Maklumat Telus & Sah:</strong> Pangkalan data terhubung terus ke senarai projek perumahan terkini.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Khidmat Nasihat Mesra Pembeli:</strong> Semakan kelayakan pinjaman percuma sebelum membuat tempahan.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Bantuan Lengkap:</strong> Daripada pemilihan lokasi sehingga urusan pengesahan kelayakan bank.
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenEligibility()}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all inline-flex items-center gap-2"
              >
                <span>Hubungi Pasukan Kami</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column Visual Graphic Card */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Klang Valley Homes Team & Properties"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">Bantuan Pasukan Klang Valley Homes</h4>
                    <p className="text-xs text-slate-300">Bersedia membimbing permohonan & pilihan rumah anda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
