import React from 'react';
import {
  Database,
  FileCheck2,
  Building2,
  UserCheck,
} from 'lucide-react';

interface WhyChooseUsProps {
  onOpenEligibility?: (propertyName?: string) => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = () => {
  const features = [
    {
      icon: Database,
      title: 'Pangkalan Data Projek Terkini',
      description:
        'Info projek hartanah terkini di Klang Valley dan memastikan maklumat dan status harga sentiasa dikemaskini.',
    },
    {
      icon: FileCheck2,
      title: 'Semakan Kelayakan Percuma',
      description:
        'Ketahui kemampuan pinjaman perumahan anda terlebih dahulu secara PERCUMA tanpa sebarang komitmen kewangan.',
    },
    {
      icon: Building2,
      title: 'Liputan Luas Klang Valley',
      description:
        'Liputan projek utama merangkumi Shah Alam, Klang, Puncak Alam, Puchong, Jenjarom, Pulau Indah, Subang, & Petaling Jaya.',
    },
    {
      icon: UserCheck,
      title: 'Bantuan Pasukan Profesional',
      description:
        'Pasukan perunding kami bersedia membantu anda memilih projek bersesuaian dengan lokasi, jenis hartanah dan bajet bulanan.',
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
            Platform sehenti yang direka khas untuk memudahkan pembeli rumah pertama
            mahupun pelabur mencari hartanah ideal di seluruh Lembah Klang.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <div
                key={idx}
                className="
                  bg-slate-950
                  p-6
                  rounded-2xl
                  border border-slate-800/90
                  shadow-xl
                  hover:border-amber-500/40
                  transition-all
                  duration-300
                  space-y-4
                  group
                "
              >
                <div
                  className="
                    w-12 h-12
                    rounded-xl
                    bg-amber-500/10
                    border border-amber-500/20
                    text-amber-400
                    flex items-center
                    justify-center
                    group-hover:scale-110
                    transition-transform
                  "
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3
                  className="
                    text-lg
                    font-serif
                    font-bold
                    text-white
                    group-hover:text-amber-400
                    transition-colors
                  "
                >
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};