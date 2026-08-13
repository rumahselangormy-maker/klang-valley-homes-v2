import React from 'react';
import { Search, Filter, RotateCcw, MapPin, Home, Banknote, Bed, ShieldCheck, Tag, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types';

interface PropertyFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableAreas: string[];
  totalResults: number;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filters,
  setFilters,
  availableAreas,
  totalResults,
}) => {

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      area: '',
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      tenure: '',
      status: '',
      sortBy: 'default',
    });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.area ||
    filters.propertyType ||
    filters.priceRange ||
    filters.bedrooms ||
    filters.tenure ||
    filters.status;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <h2 className="text-base font-serif font-bold text-white">
            Penapis Hartanah (Filter Properties)
          </h2>
          <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold text-xs">
            {totalResults} {totalResults === 1 ? 'Hartanah' : 'Hartanah'}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Penapis</span>
          </button>
        )}
      </div>

      {/* Main Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Search input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Cari Nama / Lokasi</span>
          </label>
          <input
            type="text"
            placeholder="Cari nama projek..."
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Area filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Kawasan (Area)</span>
          </label>
          <select
            value={filters.area}
            onChange={(e) => setFilters((prev) => ({ ...prev, area: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Kawasan</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Jenis Hartanah</span>
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => setFilters((prev) => ({ ...prev, propertyType: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
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

        {/* Price Range filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Banknote className="w-3.5 h-3.5 text-amber-400" />
            <span>Julat Harga</span>
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Harga</option>
            <option value="under-300k">Di bawah RM 300,000</option>
            <option value="300k-500k">RM 300,000 - RM 500,000</option>
            <option value="500k-800k">RM 500,000 - RM 800,000</option>
            <option value="above-800k">Atas RM 800,000</option>
          </select>
        </div>

      </div>

      {/* Secondary Row: Bedrooms, Tenure, Status, Sort */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Bedrooms */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Bed className="w-3 h-3 text-amber-400" />
            <span>Bilik Tidur</span>
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Bilik</option>
            <option value="1">1+ Bilik</option>
            <option value="2">2+ Bilik</option>
            <option value="3">3+ Bilik</option>
            <option value="4">4+ Bilik</option>
          </select>
        </div>

        {/* Tenure */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            <span>Pegangan (Tenure)</span>
          </label>
          <select
            value={filters.tenure}
            onChange={(e) => setFilters((prev) => ({ ...prev, tenure: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Tenure</option>
            <option value="FREEHOLD">Freehold</option>
            <option value="LEASEHOLD">Leasehold</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-400" />
            <span>Status Pembangunan</span>
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="">Semua Status</option>
            <option value="ON GOING">On Going / Dalam Pembinaan</option>
            <option value="COMPLETED">Completed / Siap</option>
            <option value="NEW LAUNCH">New Launch / Pelancaran Baru</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <span>Susunan (Sort)</span>
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="default">Default API Order</option>
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
            <option value="name">Nama Projek (A-Z)</option>
          </select>
        </div>
      </div>

    </div>
  );
};
