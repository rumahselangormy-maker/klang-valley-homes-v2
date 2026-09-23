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
              <span>Tentang RumahSelangor.my</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Cari Rumah di Selangor Jadi Lebih Mudah
            </h2>

            <p className="text-slate-300 text-base leading-relaxed">
              RumahSelangor.my bantu anda cari rumah yang sesuai ikut lokasi, bajet dan kemampuan anda.
            </p>

            <p className="text-slate-300 text-base leading-relaxed">
              Tak pasti rumah mana sesuai atau layak beli pada harga berapa? Kami boleh bantu semak dulu sebelum anda buat keputusan.
            </p>

            {/* Core Commitments */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Pilihan Rumah Yang Mudah Dicari</strong><br />Lihat pilihan rumah mengikut kawasan, harga dan jenis rumah yang anda cari.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Semak Kelayakan Dulu</strong><br />Belum tahu bajet rumah yang sesuai? Buat semakan kelayakan percuma supaya anda tahu anggaran kemampuan sebelum memilih rumah.
                </span>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-300">
                  <strong>Kami Bantu Sampai Jelas</strong><br />Dari cari rumah, tanya tentang projek, semak kelayakan hingga langkah seterusnya — kami bantu anda sepanjang proses.
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

          {/* Existing property placeholder; real Ryna image pending. */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"
                alt="Ilustrasi hartanah — gambar sebenar Ryna akan ditambah kemudian"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-2 left-2 right-2 p-2.5 sm:bottom-3 sm:left-3 sm:right-3 sm:p-3 rounded-xl bg-slate-950/90 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-amber-400">Ada Soalan Tentang Rumah?</p>
                    <h4 className="font-serif font-bold text-white text-xs sm:text-sm">Bantuan Perunding Hartanah Berdaftar</h4>
                    <p className="text-[10px] sm:text-xs text-slate-300">Bantu anda cari rumah yang sesuai &amp; semak kelayakan.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-serif text-xl font-bold text-white">Ryna Arif</h3>
              <p className="text-sm text-amber-400">REN 62310 · Perunding Hartanah Berdaftar</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
