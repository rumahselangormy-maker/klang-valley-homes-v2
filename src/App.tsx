import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Project, FilterState, ActiveTab } from './types';
import { fetchProjects } from './services/api';
import { getAreaOptions, matchesArea, normalizeArea } from './services/propertyPresentation';
import {
  createPublicListingSlug,
  findPublicListingBySlug,
} from './services/publicListingVisibility';

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyFilter } from './components/PropertyFilter';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { EligibilityModal } from './components/EligibilityModal';

import { PopularAreas } from './components/PopularAreas';
import { SubsaleSection } from './components/SubsaleSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessSteps } from './components/ProcessSteps';
import { CalculatorSection } from './components/CalculatorSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

import {
  Building2,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const getInitialTab = (): ActiveTab => {
    const path = window.location.pathname;

    if (path === '/properties') return 'properties';
    if (path === '/projects') return 'projects';
    if (path === '/kalkulator-loan') return 'calculator';
    if (path === '/about') return 'about';
    if (path === '/contact') return 'contact';
    if (path === '/semak-kelayakan') return 'eligibility';

    if (path.startsWith('/area/')) return 'properties';
    if (path.startsWith('/property/')) return 'properties';

    return 'home';
  };

  const [activeTab, setActiveTab] =
    useState<ActiveTab>(getInitialTab);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [fetchError, setFetchError] =
    useState<string | null>(null);

  const featuredCarouselRef = useRef<HTMLDivElement>(null);

  // Selected project modal state
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const createPropertySlug = (project: Project) =>
    createPublicListingSlug(project.PROJECT_NAME);

  const openProperty = (project: Project) => {
    setSelectedProject(project);

    window.history.pushState(
      {},
      '',
      `/property/${createPropertySlug(project)}`
    );
  };

  // Eligibility Modal state
  const [isEligibilityOpen, setIsEligibilityOpen] =
    useState<boolean>(false);

  const [eligibilityProjectName, setEligibilityProjectName] =
    useState<string>('');

  // Global Filter State
  const [filters, setFilters] =
    useState<FilterState>({
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

      const pathname = window.location.pathname;

      if (pathname.startsWith('/property/')) {
        const slug = pathname
          .replace('/property/', '')
          .replace(/\/$/, '');

        const matchedProject = findPublicListingBySlug<Project>(
          data,
          slug,
          (project) => project.PROJECT_NAME,
        );

        if (matchedProject) {
          setSelectedProject(matchedProject);
        }
      }
    } catch (err: any) {
      console.error(
        'Failed to load projects:',
        err
      );

      setFetchError(
        'Tidak dapat memuatkan senarai hartanah. Sila cuba sebentar lagi.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const path = window.location.pathname;

    if (path === '/semak-kelayakan') {
      setIsEligibilityOpen(true);
    }

    if (path.startsWith('/area/')) {
      const areaSlug = path
        .replace('/area/', '')
        .replace(/\/$/, '');

      const areaMap: Record<string, string> = {
        'shah-alam': 'SHAH ALAM',
        'klang': 'KLANG',
        'puncak-alam': 'PUNCAK ALAM',
        'puchong': 'PUCHONG',
        'jenjarom': 'JENJAROM',
        'pulau-indah': 'PULAU INDAH',
        'telok-panglima-garang': 'TELOK PANGLIMA GARANG',
        'petaling-jaya': 'PETALING JAYA',
      };

      const selectedArea =
        areaMap[areaSlug];

      if (selectedArea) {
        setFilters((prev) => ({
          ...prev,
          area: normalizeArea(selectedArea),
        }));
      }
    }
  }, []);

  // Available areas
  const availableAreas = useMemo(() => {
    const PRIMARY_AREAS = [
      'SHAH ALAM',
      'KLANG',
      'PUNCAK ALAM',
      'PUCHONG',
      'JENJAROM',
      'PULAU INDAH',
      'TELOK PANGLIMA GARANG',
      'PETALING JAYA',
    ];

    return getAreaOptions([...PRIMARY_AREAS, ...projects.map((p) => p.AREA)]);
  }, [projects]);

  // Available project names
  const availableProjectNames = useMemo(() => {
    return projects
      .map((p) => p.PROJECT_NAME)
      .filter(Boolean);
  }, [projects]);

  // Parse price
  const parsePrice = (
    priceStr: string
  ): number => {
    if (!priceStr) return 0;

    const clean =
      priceStr.replace(/[^0-9.]/g, '');

    return parseFloat(clean) || 0;
  };

  // Filter & Sort Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {

        // Search
        if (filters.searchQuery.trim()) {
          const query =
            filters.searchQuery.toLowerCase();

          const matchName =
            (p.PROJECT_NAME || '')
              .toLowerCase()
              .includes(query);

          const matchArea =
            normalizeArea(p.AREA)
              .toLowerCase()
              .includes(query);

          const matchType =
            (p.PROPERTY_TYPE || '')
              .toLowerCase()
              .includes(query);

          const matchDesc =
            (p.DESCRIPTION || '')
              .toLowerCase()
              .includes(query);

          if (
            !matchName &&
            !matchArea &&
            !matchType &&
            !matchDesc
          ) {
            return false;
          }
        }

        // Area
        if (!matchesArea(p.AREA, filters.area)) {
          return false;
        }

        // Property Type
        if (filters.propertyType) {
          const typeNorm =
            (p.PROPERTY_TYPE || '')
              .toUpperCase();

          const filterTypeNorm =
            filters.propertyType.toUpperCase();

          if (
            !typeNorm.includes(
              filterTypeNorm
            )
          ) {
            return false;
          }
        }

        // Price Range
        if (filters.priceRange) {
          const priceNum =
            parsePrice(p.PRICE_FROM);

          if (priceNum > 0) {
            if (
              filters.priceRange ===
                'under-300k' &&
              priceNum >= 300000
            ) {
              return false;
            }

            if (
              filters.priceRange ===
                '300k-500k' &&
              (
                priceNum < 300000 ||
                priceNum > 500000
              )
            ) {
              return false;
            }

            if (
              filters.priceRange ===
                '500k-800k' &&
              (
                priceNum < 500000 ||
                priceNum > 800000
              )
            ) {
              return false;
            }

            if (
              filters.priceRange ===
                'above-800k' &&
              priceNum < 800000
            ) {
              return false;
            }
          }
        }

        // Bedrooms
        if (filters.bedrooms) {
          const beds = parseInt(
            p.BEDROOMS || '0',
            10
          );

          const minBeds = parseInt(
            filters.bedrooms,
            10
          );

          if (beds < minBeds) {
            return false;
          }
        }

        // Tenure
        if (filters.tenure) {
          if (
            !(p.TENURE || '')
              .toUpperCase()
              .includes(
                filters.tenure.toUpperCase()
              )
          ) {
            return false;
          }
        }

        // Status
        if (filters.status) {
          if (
            !(p.STATUS || '')
              .toUpperCase()
              .includes(
                filters.status.toUpperCase()
              )
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (
          filters.sortBy === 'price-asc'
        ) {
          return (
            parsePrice(a.PRICE_FROM) -
            parsePrice(b.PRICE_FROM)
          );
        }

        if (
          filters.sortBy === 'price-desc'
        ) {
          return (
            parsePrice(b.PRICE_FROM) -
            parsePrice(a.PRICE_FROM)
          );
        }

        if (
          filters.sortBy === 'name'
        ) {
          return a.PROJECT_NAME.localeCompare(
            b.PROJECT_NAME
          );
        }

        return 0;
      });
  }, [projects, filters]);

  // Eligibility Handler
  const handleOpenEligibility = (
    projectName?: string | unknown
  ) => {
    if (
      typeof projectName === 'string'
    ) {
      setEligibilityProjectName(
        projectName
      );
    } else {
      setEligibilityProjectName('');
    }

    setIsEligibilityOpen(true);
  };

  // Area Handler
  const handleSelectArea = (
    areaName: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      area: normalizeArea(areaName),
    }));

    setActiveTab('properties');

    const areaSlug = areaName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    window.history.pushState(
      {},
      '',
      `/area/${areaSlug}`
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Hero View Properties
  const handleHeroViewProperties = (
    initialFilters?: Partial<FilterState>
  ) => {
    if (initialFilters) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));
    }

    setActiveTab('properties');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenEligibility={
          handleOpenEligibility
        }
      />

      {/* Main Router */}
      <main className="flex-1">

        {/* ================= HOME ================= */}
        {activeTab === 'home' && (
          <>

            {/* 1. HERO */}
            <Hero
              onOpenEligibility={
                handleOpenEligibility
              }
              onViewProperties={
                handleHeroViewProperties
              }
              availableAreas={
                availableAreas
              }
            />

            {/* 2. FEATURED PROPERTIES */}
            <section className="py-16 sm:py-20 bg-slate-950 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">

                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                      MUNGKIN RUMAH ANDA ADA DI SINI
                    </span>

                    <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                      Hartanah & Projek Pilihan
                    </h2>
                  </div>

                  <button
                    onClick={() =>
                      setActiveTab(
                        'properties'
                      )
                    }
                    className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                  >
                    <span>
                      Lihat Semua Projek
                    </span>

                    <span>→</span>
                  </button>
                </div>

                {/* Loading */}
                {isLoading && (
                  <div className="py-16 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />

                    <p className="text-sm text-slate-400">
                      Memuatkan senarai hartanah dari pangkalan data API...
                    </p>
                  </div>
                )}

                {/* Error */}
                {!isLoading &&
                  fetchError && (
                    <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center space-y-3">

                      <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />

                      <p className="text-sm text-rose-300 font-medium">
                        {fetchError}
                      </p>

                      <button
                        onClick={loadData}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>
                          Cuba Lagi
                        </span>
                      </button>
                    </div>
                  )}

                {/* Empty */}
                {!isLoading &&
                  !fetchError &&
                  projects.length === 0 && (
                    <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">

                      <Building2 className="w-12 h-12 text-slate-600 mx-auto" />

                      <h3 className="text-lg font-serif font-bold text-white">
                        Tiada property tersedia buat masa ini.
                      </h3>

                      <p className="text-xs text-slate-400">
                        Sila semak semula tidak lama lagi atau hubungi kami untuk maklumat lanjut.
                      </p>
                    </div>
                  )}

                {/* Featured Carousel */}
                {!isLoading &&
                  !fetchError &&
                  projects.length > 0 && (
                    <div className="relative">

                      <div
                        ref={featuredCarouselRef}
                        id="featured-projects-carousel"
                        className="flex flex-nowrap gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth px-12 pb-4 touch-pan-x overscroll-x-contain [&::-webkit-scrollbar]:hidden"
                        style={{
                          scrollbarWidth:
                            'none',
                        }}
                      >
                        {projects
                          .slice(0, 6)
                          .map(
                            (project) => (
                              <div
                                key={
                                  project.ID ||
                                  project.PROJECT_NAME
                                }
                                className="min-w-0 shrink-0 w-[88%] sm:w-[48%] lg:w-[32%] snap-start"
                              >
                                <PropertyCard
                                  project={
                                    project
                                  }
                                  onViewDetails={
                                    openProperty
                                  }
                                  onEnquire={
                                    handleOpenEligibility
                                  }
                                />
                              </div>
                            )
                          )}
                      </div>

                      {/* Arrows */}
                      {projects.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => featuredCarouselRef.current?.scrollBy({ left: -featuredCarouselRef.current.clientWidth * 0.85, behavior: 'smooth' })}
                            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-lg transition-colors hover:border-amber-500/50 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:h-11 sm:w-11"
                            aria-label="Previous featured property"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => featuredCarouselRef.current?.scrollBy({ left: featuredCarouselRef.current.clientWidth * 0.85, behavior: 'smooth' })}
                            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-white shadow-lg transition-colors hover:border-amber-500/50 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:h-11 sm:w-11"
                            aria-label="Next featured property"
                          >
                            ›
                          </button>
                        </>
                      )}

                      {/* Mobile Hint */}
                      {projects.length >
                        1 && (
                        <div className="sm:hidden flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
                          <span>
                            Lihat projek lain
                          </span>

                          <span className="text-amber-400">
                            →
                          </span>
                        </div>
                      )}

                    </div>
                  )}
              </div>
            </section>

            {/* 3. SUBSALE */}
            <SubsaleSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />

            {/* 4. LOAN CALCULATOR */}
            <CalculatorSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />

            {/* 5. 3-STEP PROCESS */}
            <section className="pt-20 bg-slate-950 border-b border-slate-800">
              <div className="text-center max-w-2xl mx-auto px-4 space-y-3 mb-16">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">MUDAHKAN CARIAN RUMAH ANDA</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">3 Langkah Untuk Cari Rumah Anda</h2>
                <p className="text-slate-400 text-sm">Kami mudahkan proses anda daripada mencari rumah yang sesuai hingga ke langkah seterusnya.</p>
              </div>
              <div className="[&>section]:py-0 [&>section]:border-0 [&>section>div>div:first-child]:hidden [&>section>div>div:last-child]:hidden">
                <ProcessSteps onOpenEligibility={handleOpenEligibility} />
              </div>
              <div className="pb-20 text-center">
                <button id="eligibility-process" data-cta="semak-kelayakan" onClick={() => handleOpenEligibility()} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all transform active:scale-98">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Semak Kelayakan Saya</span>
                </button>
              </div>
            </section>

            {/* 6. AREAS */}
            <PopularAreas projects={projects} onSelectArea={handleSelectArea} />

            {/* 7. CONTACT */}
            <ContactSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />
          </>
        )}

        {/* ================= PROPERTIES ================= */}
        {(activeTab === 'properties' ||
          activeTab === 'projects') && (
          <section className="pt-28 pb-20 bg-slate-950 min-h-screen">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

              <div className="space-y-2">

                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  Senarai Terkini{' '}
                  {activeTab ===
                  'projects'
                    ? 'Projek Perumahan'
                    : 'Hartanah'}
                </span>

                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                  {activeTab ===
                  'projects'
                    ? 'New Property Projects in Klang Valley'
                    : 'Properties for Sale in Klang Valley'}
                </h1>

                <p className="text-slate-400 text-sm max-w-2xl">
                  Teroka projek perumahan baru dan subsale terhubung secara automatik dari pangkalan data rasmi Google Sheets.
                </p>

              </div>

              <PropertyFilter
                filters={filters}
                setFilters={setFilters}
                availableAreas={
                  availableAreas
                }
                totalResults={
                  filteredProjects.length
                }
              />

              {isLoading && (
                <div className="py-20 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">

                  <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />

                  <p className="text-sm text-slate-400">
                    Memuatkan data projek dari Google Sheets API...
                  </p>

                </div>
              )}

              {!isLoading &&
                filteredProjects.length ===
                  0 && (
                  <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">

                    <Building2 className="w-12 h-12 text-slate-600 mx-auto" />

                    <h3 className="text-xl font-serif font-bold text-white">
                      {projects.length ===
                      0
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
                          sortBy:
                            'default',
                        })
                      }
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Reset Semua Penapis
                    </button>

                  </div>
                )}

              {!isLoading &&
                filteredProjects.length >
                  0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {filteredProjects.map(
                      (project) => (
                        <PropertyCard
                          key={
                            project.ID ||
                            project.PROJECT_NAME
                          }
                          project={
                            project
                          }
                          onViewDetails={
                            openProperty
                          }
                          onEnquire={
                            handleOpenEligibility
                          }
                        />
                      )
                    )}

                  </div>
                )}

            </div>
          </section>
        )}

        {/* ================= CALCULATOR ================= */}
        {activeTab === 'calculator' && (
          <div className="pt-24">

            <CalculatorSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />

            <ProcessSteps
              onOpenEligibility={
                handleOpenEligibility
              }
            />

          </div>
        )}

        {/* ================= ABOUT ================= */}
        {activeTab === 'about' && (
          <div className="pt-24">

            <AboutSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />

            <WhyChooseUs
              onOpenEligibility={
                handleOpenEligibility
              }
            />

          </div>
        )}

        {/* ================= CONTACT ================= */}
        {activeTab === 'contact' && (
          <div className="pt-24">

            <ContactSection
              onOpenEligibility={
                handleOpenEligibility
              }
            />

          </div>
        )}

      </main>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        project={selectedProject}
        onClose={() => {
          setSelectedProject(null);

          window.history.replaceState(
            {},
            '',
            '/'
          );
        }}
        onApplyEligibility={
          handleOpenEligibility
        }
      />

      {/* Eligibility Modal */}
      <EligibilityModal
        isOpen={isEligibilityOpen}
        onClose={() =>
          setIsEligibilityOpen(false)
        }
        initialProjectName={
          eligibilityProjectName
        }
        availableProjects={
          availableProjectNames
        }
        availableAreas={
          availableAreas
        }
      />

      {/* Footer */}
      <Footer
        setActiveTab={
          setActiveTab
        }
        onOpenEligibility={
          handleOpenEligibility
        }
      />

    </div>
  );
}
