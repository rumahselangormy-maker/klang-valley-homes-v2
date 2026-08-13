import React from 'react';
import { MapPin, Bed, Bath, Maximize2, Tag, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Project } from '../types';
import { getPropertyImage } from '../data/placeholders';
import { SafeImage } from './SafeImage';

interface PropertyCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onEnquire: (projectName: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  project,
  onViewDetails,
  onEnquire,
}) => {
  const imageUrl = getPropertyImage(project.MAIN_IMAGE, project.PROPERTY_TYPE, project.ID);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 flex flex-col group">
      
      {/* Image Showcase */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <SafeImage
          src={imageUrl}
          propertyType={project.PROPERTY_TYPE}
          projectId={project.ID}
          alt={project.PROJECT_NAME}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          {/* Status Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950/80 text-amber-400 border border-amber-500/30 backdrop-blur-md">
            {project.STATUS || 'ON GOING'}
          </span>

          {/* Tenure Badge */}
          {project.TENURE && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase bg-slate-900/90 text-slate-300 border border-slate-700/60 backdrop-blur-md">
              {project.TENURE}
            </span>
          )}
        </div>

        {/* Price Tag Overlay at Bottom of Image */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <span className="text-xs text-amber-300/90 font-medium block">Price From / Harga Bermula</span>
          <span className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            {project.PRICE_FROM || 'Hubungi Untuk Harga'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Location Area */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{project.AREA || 'Klang Valley'}</span>
          </div>

          {/* Project Name */}
          <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {project.PROJECT_NAME}
          </h3>

          {/* Property Type Subtitle */}
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400/80" />
            <span>{project.PROPERTY_TYPE || 'Residential Property'}</span>
          </p>
        </div>

        {/* Features Grid Icons */}
        <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
          {/* Bedrooms */}
          <div className="flex flex-col items-center justify-center p-1">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.BEDROOMS || '-'}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Bilik</span>
          </div>

          {/* Bathrooms */}
          <div className="flex flex-col items-center justify-center p-1 border-x border-slate-800">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
              <Bath className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.BATHROOMS || '-'}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Bilik Air</span>
          </div>

          {/* Built-Up */}
          <div className="flex flex-col items-center justify-center p-1">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate">{project.BUILT_UP || '-'}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase font-medium">Keluasan</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onViewDetails(project)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700/70 transition-all flex items-center justify-center gap-1"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={() => onEnquire(project.PROJECT_NAME)}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </button>
        </div>

      </div>
    </div>
  );
};
