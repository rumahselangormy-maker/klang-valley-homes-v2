import React from 'react';
import { ShieldCheck, Database, FileCheck2, Building2, UserCheck, Home, ArrowRight, MapPin } from 'lucide-react';

interface WhyChooseUsProps {
  onOpenEligibility?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenEligibility }) => {
  const features = [
    {
      icon: Database,
      title: 'Pangkalan Data Projek Terkini',
      description: 'Disambung terus ke pangkalan data projek hartanah Klang Valley untuk memastikan maklumat dan status harga sentiasa dikemaskini.',
    },
    {
      icon: FileCheck2,
      title: 'Semakan Kelayakan Percuma',
      description: 'Ketahui kemampuan pinjaman perumahan anda terlebih dahulu secara PERCUMA tanpa sebarang komitmen kewangan.',
    },
    {
      icon: Building2,
      title: 'Liputan Luas Klang Valley',
      description: 'Liputan projek utama merangkumi Shah Alam, Klang, Puncak Alam, Puchong, Jenjarom, Pulau Indah, Subang, & Petaling Jaya.',
    },
    {
      icon: UserCheck,
      title: 'Bantuan Pasukan Profesional',
      description: 'Pasukan perunding kami bersedia membantu anda memilih projek bersesuaian dengan lokasi, jenis hartanah dan bajet bulanan.',
    },
  ];

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            Keutamaan & Komitmen Kami
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Why Choose Klang Valley Homes
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Platform sehenti yang direka khas untuk memudahkan pembeli rumah pertama mahupun pelabur mencari hartanah ideal di seluruh Lembah Klang.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 shadow-xl hover:border-amber-500/40 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dedicated Subsale Property Services Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2.5 max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" />
              <span>Perkhidmatan Subsale (Rumah Sedia Ada)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Khidmat Ejen Subsale Professional
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Klang Valley Homes turut membantu pelanggan yang mencari atau ingin menjual hartanah subsale (rumah terpakai/sedia ada). <strong>Perkhidmatan subsale kami tertumpu bagi kawasan dalam lingkungan approximately 10 km dari Shah Alam.</strong>
            </p>

            <div className="flex items-start gap-2 pt-1 text-xs text-amber-400/90 font-medium">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Nota: Had lingkungan 10 km dari Shah Alam ini terpakai untuk <strong>hartanah subsale sahaja</strong>. Bagi projek perumahan baru, liputan kami meliputi seluruh kawasan tumpuan Klang Valley.
              </span>
            </div>
          </div>

          {onOpenEligibility && (
            <button
              onClick={() => onOpenEligibility()}
              className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-2 relative z-10 transform active:scale-98"
            >
              <span>Pertanyaan Subsale</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
