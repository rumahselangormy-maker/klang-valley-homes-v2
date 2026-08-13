import React, { useState, useEffect, useMemo } from 'react';
import { Project, FilterState, ActiveTab } from './types';
import { fetchProjects } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyFilter } from './components/PropertyFilter';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { EligibilityModal } from './components/EligibilityModal';
import { PopularAreas } from './components/PopularAreas';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessSteps } from './components/ProcessSteps';
import { CalculatorSection } from './components/CalculatorSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Building2, Loader2, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Selected project modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Eligibility Modal state
  const [isEligibilityOpen, setIsEligibilityOpen] = useState<boolean>(false);
  const [eligibilityProjectName, setEligibilityProjectName] = useState<string>('');

  // Global Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    area: '',
    propertyType: '',
    priceRange: '',
    bedrooms: '',
    tenure: '',
    status: '',
    sortBy: 'default',
  });

  // Load Projects on App Mount
  const loadData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setFetchError('Tidak dapat memuatkan senarai hartanah. Sila cuba sebentar lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Distinct available areas incorporating core Klang Valley areas and dynamic API projects
  const availableAreas = useMemo(() => {
    const PRIMARY_AREAS = [
      'SHAH ALAM',
      'KLANG',
      'PUNCAK ALAM',
      'PUCHONG',
      'JENJAROM',
      'PULAU INDAH',
      'SUBANG',
      'PETALING JAYA',
    ];
    const areas = new Set<string>(PRIMARY_AREAS);
    projects.forEach((p) => {
      if (p.AREA && p.AREA.trim()) {
        areas.add(p.AREA.trim().toUpperCase());
      }
    });
    return Array.from(areas).sort();
  }, [projects]);

  // Distinct project names for eligibility dropdown
  const availableProjectNames = useMemo(() => {
    return projects.map((p) => p.PROJECT_NAME).filter(Boolean);
  }, [projects]);

  // Helper to parse price string into clean numeric ringgit
  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(clean) || 0;
  };

  // Filter & Sort Logic applied on Real API Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = (p.PROJECT_NAME || '').toLowerCase().includes(query);
        const matchArea = (p.AREA || '').toLowerCase().includes(query);
        const matchType = (p.PROPERTY_TYPE || '').toLowerCase().includes(query);
        const matchDesc = (p.DESCRIPTION || '').toLowerCase().includes(query);
        if (!matchName && !matchArea && !matchType && !matchDesc) return false;
      }

      // 2. Area
      if (filters.area) {
        const filterAreaNorm = filters.area.toUpperCase();
        const projectAreaNorm = (p.AREA || '').toUpperCase();
        if (!projectAreaNorm.includes(filterAreaNorm) && !filterAreaNorm.includes(projectAreaNorm)) return false;
      }

      // 3. Property Type
      if (filters.propertyType) {
        const typeNorm = (p.PROPERTY_TYPE || '').toUpperCase();
        const filterTypeNorm = filters.propertyType.toUpperCase();
        if (!typeNorm.includes(filterTypeNorm)) return false;
      }

      // 4. Price Range
      if (filters.priceRange) {
        const priceNum = parsePrice(p.PRICE_FROM);
        if (priceNum > 0) {
          if (filters.priceRange === 'under-300k' && priceNum >= 300000) return false;
          if (filters.priceRange === '300k-500k' && (priceNum < 300000 || priceNum > 500000)) return false;
          if (filters.priceRange === '500k-800k' && (priceNum < 500000 || priceNum > 800000)) return false;
          if (filters.priceRange === 'above-800k' && priceNum < 800000) return false;
        }
      }

      // 5. Bedrooms
      if (filters.bedrooms) {
        const beds = parseInt(p.BEDROOMS || '0', 10);
        const minBeds = parseInt(filters.bedrooms, 10);
        if (beds < minBeds) return false;
      }

      // 6. Tenure
      if (filters.tenure) {
        if (!(p.TENURE || '').toUpperCase().includes(filters.tenure.toUpperCase())) return false;
      }

      // 7. Status
      if (filters.status) {
        if (!(p.STATUS || '').toUpperCase().includes(filters.status.toUpperCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') {
        return parsePrice(a.PRICE_FROM) - parsePrice(b.PRICE_FROM);
      }
      if (filters.sortBy === 'price-desc') {
        return parsePrice(b.PRICE_FROM) - parsePrice(a.PRICE_FROM);
      }
      if (filters.sortBy === 'name') {
        return a.PROJECT_NAME.localeCompare(b.PROJECT_NAME);
      }
      return 0;
    });
  }, [projects, filters]);

  // Handlers
  const handleOpenEligibility = (projectName?: string | unknown) => {
    if (typeof projectName === 'string') {
      setEligibilityProjectName(projectName);
    } else {
      setEligibilityProjectName('');
    }
    setIsEligibilityOpen(true);
  };

  const handleSelectArea = (areaName: string) => {
    setFilters((prev) => ({ ...prev, area: areaName.toUpperCase() }));
    setActiveTab('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroViewProperties = (initialFilters?: Partial<FilterState>) => {
    if (initialFilters) {
      setFilters((prev) => ({ ...prev, ...initialFilters }));
    }
    setActiveTab('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Fixed Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEligibility={handleOpenEligibility}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <Hero
              onOpenEligibility={handleOpenEligibility}
              onViewProperties={handleHeroViewProperties}
              availableAreas={availableAreas}
            />

            {/* Featured Property Section */}
            <section className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                      Pilihan Projek Teratas
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                      Featured Properties & Projects
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveTab('properties')}
                    className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>Lihat Semua ({projects.length}) Projek</span>
                    <span>→</span>
                  </button>
                </div>

                {/* API Loading State */}
                {isLoading && (
                  <div className="py-16 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                    <p className="text-sm text-slate-400">Memuatkan senarai hartanah dari pangkalan data API...</p>
                  </div>
                )}

                {/* API Error State */}
                {!isLoading && fetchError && (
                  <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                    <p className="text-sm text-rose-300 font-medium">{fetchError}</p>
                    <button
                      onClick={loadData}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Cuba Lagi</span>
                    </button>
                  </div>
                )}

                {/* Empty State from API */}
                {!isLoading && !fetchError && projects.length === 0 && (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                    <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                    <h3 className="text-lg font-serif font-bold text-white">Tiada property tersedia buat masa ini.</h3>
                    <p className="text-xs text-slate-400">Sila semak semula tidak lama lagi atau hubungi kami untuk maklumat lanjut.</p>
                  </div>
                )}

                {/* Projects Grid Display (Show top 6 on Home) */}
                {!isLoading && !fetchError && projects.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.slice(0, 6).map((project) => (
                      <PropertyCard
                        key={project.ID || project.PROJECT_NAME}
                        project={project}
                        onViewDetails={setSelectedProject}
                        onEnquire={handleOpenEligibility}
                      />
                    ))}
                  </div>
                )}

              </div>
            </section>

            {/* Popular Areas */}
            <PopularAreas projects={projects} onSelectArea={handleSelectArea} />

            {/* Why Choose Klang Valley Homes */}
            <WhyChooseUs onOpenEligibility={handleOpenEligibility} />

            {/* 3-Step Process */}
            <ProcessSteps onOpenEligibility={handleOpenEligibility} />

            {/* Eligibility Calculator */}
            <CalculatorSection onOpenEligibility={handleOpenEligibility} />

            {/* Contact Banner */}
            <ContactSection onOpenEligibility={handleOpenEligibility} />
          </>
        )}

        {(activeTab === 'properties' || activeTab === 'projects') && (
          <section className="pt-28 pb-20 bg-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Header Title */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  Senarai Terkini {activeTab === 'projects' ? 'Projek Perumahan' : 'Hartanah'}
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                  {activeTab === 'projects' ? 'New Property Projects in Klang Valley' : 'Properties for Sale in Klang Valley'}
                </h1>
                <p className="text-slate-400 text-sm max-w-2xl">
                  Teroka projek perumahan baru dan subsale terhubung secara automatik dari pangkalan data rasmi Google Sheets.
                </p>
              </div>

              {/* Dynamic Property Filters */}
              <PropertyFilter
                filters={filters}
                setFilters={setFilters}
                availableAreas={availableAreas}
                totalResults={filteredProjects.length}
              />

              {/* API Loading State */}
              {isLoading && (
                <div className="py-20 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
                  <p className="text-sm text-slate-400">Memuatkan data projek dari Google Sheets API...</p>
                </div>
              )}

              {/* API Empty Results State */}
              {!isLoading && filteredProjects.length === 0 && (
                <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                  <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-xl font-serif font-bold text-white">
                    {projects.length === 0
                      ? 'Tiada property tersedia buat masa ini.'
                      : 'Tiada carian hartanah padan dengan penapis anda.'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Cuba ubah syarat carian atau reset penapis untuk melihat semua hartanah Klang Valley.
                  </p>

                  <button
                    onClick={() =>
                      setFilters({
                        searchQuery: '',
                        area: '',
                        propertyType: '',
                        priceRange: '',
                        bedrooms: '',
                        tenure: '',
                        status: '',
                        sortBy: 'default',
                      })
                    }
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reset Semua Penapis
                  </button>
                </div>
              )}

              {/* Results Grid */}
              {!isLoading && filteredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <PropertyCard
                      key={project.ID || project.PROJECT_NAME}
                      project={project}
                      onViewDetails={setSelectedProject}
                      onEnquire={handleOpenEligibility}
                    />
                  ))}
                </div>
              )}

            </div>
          </section>
        )}

        {activeTab === 'calculator' && (
          <div className="pt-24">
            <CalculatorSection onOpenEligibility={handleOpenEligibility} />
            <ProcessSteps onOpenEligibility={handleOpenEligibility} />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="pt-24">
            <AboutSection onOpenEligibility={handleOpenEligibility} />
            <WhyChooseUs onOpenEligibility={handleOpenEligibility} />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-24">
            <ContactSection onOpenEligibility={handleOpenEligibility} />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <PropertyDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onApplyEligibility={handleOpenEligibility}
      />

      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() => setIsEligibilityOpen(false)}
        initialProjectName={eligibilityProjectName}
        availableProjects={availableProjectNames}
        availableAreas={availableAreas}
      />

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenEligibility={handleOpenEligibility}
      />

    </div>
  );
}
