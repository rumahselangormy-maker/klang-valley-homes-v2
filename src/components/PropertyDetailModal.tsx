import React, { useState, useEffect } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, Layers, Calendar, Gift, CheckCircle2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { Project } from '../types';
import { getPropertyImage, parseImageUrls } from '../data/placeholders';
import { SafeImage } from './SafeImage';

interface PropertyDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onApplyEligibility: (projectName: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  project,
  onClose,
  onApplyEligibility,
}) => {
  if (!project) return null;

  const fallbackMain = getPropertyImage(project.MAIN_IMAGE, project.PROPERTY_TYPE, project.ID);

  // Parse all image URLs from MAIN_IMAGE and GALLERY_URLS (handles Google Drive URLs automatically)
  const mainImageUrls = parseImageUrls(project.MAIN_IMAGE);
  const galleryList = parseImageUrls(project.GALLERY_URLS);

  const allImages = Array.from(new Set([...mainImageUrls, ...galleryList])).filter(Boolean);
  if (allImages.length === 0) {
    allImages.push(fallbackMain);
  }

  const [selectedImg, setSelectedImg] = useState<string>(allImages[0] || fallbackMain);
  const [lightboxOpen, setLightboxOpen] = useState(false);
const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setSelectedImg(allImages[0] || fallbackMain);
  }, [project.ID]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container Modal */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] sm:max-h-[92vh] flex flex-col">
        
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 px-4 py-3 sm:px-5 sm:py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between">
          <div className="pr-3">
            <span className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              {project.AREA} • {project.PROPERTY_TYPE}
            </span>
            <h2 className="text-base sm:text-2xl font-serif font-bold text-white line-clamp-1">
              {project.PROJECT_NAME}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-5 sm:space-y-8 flex-1">
          
          {/* Main Visual Banner */}
          <div className="space-y-2.5 sm:space-y-3">
            <div
  className="relative h-60 sm:h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-zoom-in"
  onClick={() => {
    const index = allImages.indexOf(selectedImg);
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  }}
>
              <SafeImage
                src={selectedImg}
                propertyType={project.PROPERTY_TYPE}
                projectId={project.ID}
                alt={project.PROJECT_NAME}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-30 sm:opacity-70 pointer-events-none" />

              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-end justify-between gap-2 z-10">
                <div className="bg-transparent border-0 p-0 sm:bg-slate-950/85 sm:backdrop-blur-md sm:px-4 sm:py-2 sm:rounded-xl sm:border sm:border-slate-800/80">
                  <span className="text-[10px] sm:text-xs text-amber-300 block font-semibold leading-tight drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.9)] sm:drop-shadow-none">Harga Bermula / Price From</span>
                  <span className="text-base sm:text-2xl font-serif font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] sm:drop-shadow-none">
                    {project.PRICE_FROM || 'Hubungi Untuk Harga'}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap justify-end gap-1.5 sm:gap-2">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-amber-500 text-slate-950 font-bold text-[10px] sm:text-xs uppercase whitespace-nowrap shadow-md">
                    {project.STATUS || 'ON GOING'}
                  </span>
                  {project.TENURE && (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-slate-950/80 backdrop-blur-sm sm:bg-slate-900/90 text-slate-200 border border-slate-700/80 font-semibold text-[10px] sm:text-xs uppercase whitespace-nowrap shadow-md">
                      {project.TENURE}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails if available */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    className={`relative w-16 h-12 sm:w-20 sm:h-16 rounded-md sm:rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImg === img ? 'border-amber-400 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={img}
                      propertyType={project.PROPERTY_TYPE}
                      projectId={project.ID}
                      alt={`Gallery thumb ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-950 rounded-xl sm:rounded-2xl border border-slate-800/80">
            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50">
              <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 mb-0.5 sm:mb-1">
                <Bed className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Bilik Tidur</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{project.BEDROOMS || '-'}</p>
            </div>

            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50">
              <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 mb-0.5 sm:mb-1">
                <Bath className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Bilik Air</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{project.BATHROOMS || '-'}</p>
            </div>

            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50">
              <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 mb-0.5 sm:mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Built-up</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{project.BUILT_UP || '-'}</p>
            </div>

            <div className="p-2.5 sm:p-3 bg-slate-900/60 rounded-lg sm:rounded-xl border border-slate-800/50">
              <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1 mb-0.5 sm:mb-1">
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Land Size</span>
              </span>
              <p className="text-xs sm:text-sm font-bold text-white">{project.LAND_SIZE || '-'}</p>
            </div>
          </div>

          {/* Overview & Sales Package */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Description */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Maklumat & Penerangan Projek</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.DESCRIPTION ||
                  `${project.PROJECT_NAME} merupakan pembangunan hartanah ${project.PROPERTY_TYPE} eksklusif di kawasan strategik ${project.AREA}, Klang Valley. Menawarkan rekabentuk moden, persekitaran mesra keluarga serta kemudahan akses berhampiran lebuhraya utama.`}
              </p>
            </div>

            {/* Sales Package & Completion */}
            <div className="space-y-3 sm:space-y-4">
              {project.SALES_PACKAGE && (
                <div className="p-3 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 sm:space-y-2">
                  <h4 className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span>Pakej Jualan / Sales Package</span>
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-amber-100">
                    {project.SALES_PACKAGE}
                  </p>
                </div>
              )}

              {project.COMPLETION && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-400 flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                    <span>Jangkaan Siap:</span>
                  </span>
                  <span className="font-bold text-white">{project.COMPLETION}</span>
                </div>
              )}

              {project.GOOGLE_MAPS_URL && (
                <a
                  href={project.GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Buka Lokasi Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}
            </div>

          </div>

          {/* Key Features */}
          {project.KEY_FEATURES && (
            <div className="space-y-2 sm:space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                Ciri-Ciri Utama (Key Features)
              </h3>
              <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.KEY_FEATURES}
              </div>
            </div>
          )}

          {/* Facilities */}
          {project.FACILITIES && (
            <div className="space-y-2 sm:space-y-3 pt-2 border-t border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider">
                Kemudahan Pembangunan (Facilities)
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.FACILITIES.split(',').map((fac, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] sm:text-xs font-medium text-slate-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                    <span>{fac.trim()}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-3.5 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="text-center sm:text-left">
            <span className="text-[11px] sm:text-xs text-slate-400 block">Berminat dengan hartanah ini?</span>
            <span className="text-xs sm:text-sm font-bold text-white">Semak kelayakan pinjaman perumahan anda secara percuma</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onApplyEligibility(project.PROJECT_NAME);
            }}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Semak Kelayakan Untuk Property Ini</span>
          </button>
        </div>

      </div>
   
    {lightboxOpen && allImages.length > 0 && (
  <div
    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
    onClick={() => setLightboxOpen(false)}
  >
    <button
      type="button"
      onClick={() => setLightboxOpen(false)}
      className="absolute top-4 right-4 z-[110] w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center text-3xl"
      aria-label="Close image viewer"
    >
      ×
    </button>

    {allImages.length > 1 && (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex(
              (lightboxIndex - 1 + allImages.length) % allImages.length
            );
          }}
          className="absolute left-4 z-[110] w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-4xl flex items-center justify-center"
          aria-label="Previous image"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxIndex(
              (lightboxIndex + 1) % allImages.length
            );
          }}
          className="absolute right-4 z-[110] w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-4xl flex items-center justify-center"
          aria-label="Next image"
        >
          ›
        </button>
      </>
    )}

    <img
      src={allImages[lightboxIndex]}
      alt={`${project.PROJECT_NAME} - Image ${lightboxIndex + 1}`}
      className="max-w-[95vw] max-h-[92vh] w-auto h-auto object-contain"
      onClick={(e) => e.stopPropagation()}
    />

    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
      {lightboxIndex + 1} / {allImages.length}
    </div>
  </div>
)}
 </div>
 );
 };
