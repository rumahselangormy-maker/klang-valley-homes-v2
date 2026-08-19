import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { POPULAR_AREAS } from '../data/placeholders';
import { Project } from '../types';
import { SafeImage } from './SafeImage';

interface PopularAreasProps {
  projects: Project[];
  onSelectArea: (areaName: string) => void;
}

export const PopularAreas: React.FC<PopularAreasProps> = ({ projects, onSelectArea }) => {
  
  // Calculate project count per area dynamically from real API projects
  const getCountForArea = (areaName: string) => {
    const normName = areaName.toLowerCase();
    return projects.filter((p) => (p.AREA || '').toLowerCase().includes(normName)).length;
  };

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Kawasan Tumpuan Utama
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Popular Areas in Klang Valley
            </h2>
          </div>

          <p className="text-sm text-slate-400 max-w-md">
            Explore homes in top townships with excellent connectivity, amenities, and lifestyle convenience.
          </p>
        </div>

        {/* Areas Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_AREAS.map((area) => {
            const count = getCountForArea(area.name);

            return (
              <button
                key={area.name}
                onClick={() => onSelectArea(area.name)}
                className="group relative h-64 rounded-2xl overflow-hidden border border-slate-800 text-left shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 transform active:scale-98"
              >
                {/* Background Image */}
                <SafeImage
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />

                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                      {count > 0 ? `${count} Projek Tersedia` : 'Teroka Kawasan'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-white group-hover:text-amber-400 transition-colors">
                      <MapPin className="w-5 h-5 text-amber-400" />
                      <h3 className="text-xl font-serif font-bold">{area.name}</h3>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {area.tagline}
                    </p>

                    <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <span>Lihat Projek {area.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
