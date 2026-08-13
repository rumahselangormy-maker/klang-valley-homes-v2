import React from 'react';
import { Search, FileCheck2, Key, ArrowRight, CheckCircle } from 'lucide-react';

interface ProcessStepsProps {
  onOpenEligibility: () => void;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ onOpenEligibility }) => {
  const steps = [
    {
      num: '01',
      title: 'Pilih & Teroka Projek',
      desc: 'Semak senarai hartanah dan projek perumahan terkini mengikut kawasan, jenis rumah serta bajet impian anda.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Semakan Kelayakan Loan',
      desc: 'Isi borang semakan kelayakan pantas untuk mengetahui anggaran margin pinjaman bank dan komitmen bulanan.',
      icon: FileCheck2,
    },
    {
      num: '03',
      title: 'Lawatan Tapak & Tempahan',
      desc: 'Pasukan kami akan membantu anda membuat temujanji galeri jualan, urusan dokumen dan proses tempahan rumah.',
      icon: Key,
    },
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            Langkah Mudah & Pantas
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Simple 3-Step Process
          </h2>
          <p className="text-slate-400 text-sm">
            Proses memiliki rumah di Klang Valley kini lebih mudah, jelas dan berstruktur.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 p-8 rounded-2xl border border-slate-800 relative space-y-5 hover:border-amber-500/40 transition-all shadow-xl group"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-slate-700 group-hover:text-amber-500/30 transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenEligibility()}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all transform active:scale-98"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Mula Semak Kelayakan Sekarang</span>
          </button>
        </div>

      </div>
    </section>
  );
};
