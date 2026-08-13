import React, { useState } from 'react';
import { Search, MapPin, Home, Banknote, ShieldCheck, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { FilterState } from '../types';

interface HeroProps {
  onOpenEligibility: () => void;
  onViewProperties: (initialFilters?: Partial<FilterState>) => void;
  availableAreas: string[];
}

export const Hero: React.FC<HeroProps> = ({
  onOpenEligibility,
  onViewProperties,
  availableAreas,
}) => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onViewProperties({
      area: selectedArea,
      propertyType: selectedType,
      priceRange: selectedBudget,
      searchQuery: searchTerm,
    });
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Decorative Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')`,
        }}
      />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Platform Hartanah Terpercaya Klang Valley</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Find Your Next Home in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Klang Valley</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Discover homes and property projects that match your lifestyle, location and budget. Our team is here to guide you every step of the way.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onOpenEligibility()}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Semak Kelayakan Anda</span>
            </button>

            <button
              onClick={() => onViewProperties()}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-100 hover:text-white font-semibold text-base border border-slate-700/80 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Lihat Property</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Semakan Percuma</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Projek Baru & Subsale</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Bantuan Pinjaman Bank</span>
            </div>
          </div>
        </div>

        {/* Quick Search Overlay Card */}
        <div className="mt-10 sm:mt-12 bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span>Carian Nama Projek / Kawasan</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Shah Alam, Terrace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Area Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Pilih Kawasan (Area)</span>
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Semua Kawasan</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-amber-400" />
                <span>Jenis Hartanah</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="">Semua Jenis</option>
                <option value="TERRACE">Terrace / Teres</option>
                <option value="CONDO">Condo / Serviced Residence</option>
                <option value="APARTMENT">Apartment / Flat</option>
                <option value="SEMI-D">Semi-Detached (Semi-D)</option>
                <option value="BUNGALOW">Bungalow</option>
                <option value="TOWNHOUSE">Townhouse</option>
              </select>
            </div>

            {/* Budget Dropdown & Search CTA */}
            <div className="flex flex-col justify-end gap-1.5">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5 text-amber-400" />
                <span>Anggaran Bajet</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="">Semua Harga</option>
                  <option value="under-300k">Di bawah RM 300,000</option>
                  <option value="300k-500k">RM 300,000 - RM 500,000</option>
                  <option value="500k-800k">RM 500,000 - RM 800,000</option>
                  <option value="above-800k">Atas RM 800,000</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors flex items-center justify-center shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
};
