import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { POPULAR_AREAS } from '../data/placeholders';
import { Project } from '../types';
import { SafeImage } from './SafeImage';
import { normalizeArea } from '../services/propertyPresentation';

interface PopularAreasProps {
  projects: Project[];
  onSelectArea: (areaName: string) => void;
}

export const PopularAreas: React.FC<PopularAreasProps> = ({ projects, onSelectArea }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const updateScrollButtons = () => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      setCanScrollLeft(carousel.scrollLeft > 1);
      setCanScrollRight(carousel.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollButtons();
    carousel.addEventListener('scroll', updateScrollButtons, { passive: true });
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(carousel);

    return () => {
      carousel.removeEventListener('scroll', updateScrollButtons);
      observer.disconnect();
    };
  }, [projects]);

  // Calculate project count per area dynamically from real API projects
  const getCountForArea = (areaName: string) => {
    const normalizedName = normalizeArea(areaName).toLowerCase();
    return projects.filter((project) =>
      normalizeArea(project.AREA).toLowerCase().includes(normalizedName)
    ).length;
  };

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              CARI IKUT LOKASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Di Mana Rumah Pilihan Anda?
            </h2>
          </div>

          <p className="text-sm text-slate-400 max-w-md">
            Terokai rumah yang tersedia mengikut kawasan dan cari lokasi yang sesuai dengan keperluan anda.
          </p>
        </div>

        <div className="relative">
        {/* Areas Cards Carousel */}
        <div ref={carouselRef} className="flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth px-12 pb-4 touch-pan-x overscroll-x-contain [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {POPULAR_AREAS.map((area) => {
            const count = getCountForArea(area.name);

            return (
              <button
                key={area.name}
                onClick={() => onSelectArea(area.name)}
                className="group relative shrink-0 w-[88%] sm:w-[48%] lg:w-[31%] snap-start h-64 rounded-2xl overflow-hidden border border-slate-800 text-left shadow-lg hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 transform active:scale-98"
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

        {canScrollLeft && <button type="button" onClick={() => carouselRef.current?.scrollBy({ left: -carouselRef.current.clientWidth * 0.85, behavior: 'smooth' })} className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-lg transition-colors hover:border-amber-500/50 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:h-11 sm:w-11" aria-label="Previous area"><ChevronLeft className="h-5 w-5" /></button>}
        {canScrollRight && <button type="button" onClick={() => carouselRef.current?.scrollBy({ left: carouselRef.current.clientWidth * 0.85, behavior: 'smooth' })} className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-lg transition-colors hover:border-amber-500/50 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:h-11 sm:w-11" aria-label="Next area"><ChevronRight className="h-5 w-5" /></button>}
        </div>

      </div>
    </section>
  );
};
