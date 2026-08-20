import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Home,
  MapPin,
} from 'lucide-react';
import { fetchSubsale, SubsaleListing } from '../services/api';
import {
  transformImageUrl,
  getFallbackPlaceholder,
} from '../data/placeholders';
import { SubsaleDetailModal } from './SubsaleDetailModal';

interface SubsaleSectionProps {
  onOpenEligibility?: (propertyName?: string) => void;
}

/**
 * Create a clean URL slug for a subsale listing.
 *
 * Example:
 * "Kelana Impian Apartment, Kelana Jaya"
 * =>
 * "kelana-impian-apartment-kelana-jaya"
 */
const createSubsaleSlug = (listing: SubsaleListing): string => {
  return (listing.PROPERTY_NAME || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const SubsaleSection: React.FC<SubsaleSectionProps> = ({
  onOpenEligibility,
}) => {
  const [subsaleListings, setSubsaleListings] = useState<SubsaleListing[]>([]);
  const [isLoadingSubsale, setIsLoadingSubsale] = useState(true);
  const [selectedSubsale, setSelectedSubsale] =
    useState<SubsaleListing | null>(null);

  /**
   * Open a subsale listing and update browser URL.
   */
  const openSubsale = (listing: SubsaleListing) => {
    setSelectedSubsale(listing);

    const slug = createSubsaleSlug(listing);

    if (slug) {
      window.history.pushState(
        {},
        '',
        `/subsale/${slug}`
      );
    }
  };

  /**
   * Close modal and return to homepage URL.
   */
  const closeSubsale = () => {
    setSelectedSubsale(null);

    if (window.location.pathname.startsWith('/subsale/')) {
      window.history.pushState(
        {},
        '',
        '/'
      );
    }
  };

  /**
   * Load subsale listings.
   *
   * Also checks whether the current URL is:
   *
   * /subsale/{slug}
   *
   * If yes, automatically opens the matching listing.
   */
  useEffect(() => {
    let isMounted = true;

    const loadSubsale = async () => {
      try {
        const listings = await fetchSubsale();

        if (!isMounted) {
          return;
        }

        setSubsaleListings(listings);

        const pathname = window.location.pathname;

        if (pathname.startsWith('/subsale/')) {
          const slug = pathname
            .replace('/subsale/', '')
            .replace(/\/$/, '');

          const matchedListing = listings.find(
            (listing) =>
              createSubsaleSlug(listing) === slug
          );

          if (matchedListing) {
            setSelectedSubsale(matchedListing);
          }
        }
      } catch (error) {
        console.error(
          'Failed to load subsale listings:',
          error
        );

        if (isMounted) {
          setSubsaleListings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubsale(false);
        }
      }
    };

    loadSubsale();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Handle browser Back / Forward buttons.
   *
   * Example:
   * /subsale/kelana-impian-apartment-kelana-jaya
   * ->
   * Back
   * ->
   * /
   */
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;

      if (pathname.startsWith('/subsale/')) {
        const slug = pathname
          .replace('/subsale/', '')
          .replace(/\/$/, '');

        const matchedListing = subsaleListings.find(
          (listing) =>
            createSubsaleSlug(listing) === slug
        );

        setSelectedSubsale(
          matchedListing || null
        );
      } else {
        setSelectedSubsale(null);
      }
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, [subsaleListings]);

  return (
    <>
      <section
        className="
          py-20
          bg-slate-950
          border-b border-slate-800
          relative overflow-hidden
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Rumah Sedia Ada
            </span>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Subsale Properties
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Rumah sedia ada untuk dijual di kawasan sekitar Klang Valley.
              Lihat listing yang tersedia dan semak maklumat hartanah sebelum
              membuat keputusan.
            </p>
          </div>

          {/* Main Service Banner */}
          <div
            className="
              bg-gradient-to-r
              from-slate-900
              via-slate-950
              to-slate-900
              border border-amber-500/30
              rounded-2xl
              p-6 sm:p-8
              shadow-2xl
              relative overflow-hidden
            "
          >
            <div
              className="
                absolute top-0 right-0
                -mt-8 -mr-8
                w-48 h-48
                bg-amber-500/10
                rounded-full
                blur-3xl
                pointer-events-none
              "
            />

            <div className="relative z-10 space-y-2.5">

              {/* Service label */}
              <div
                className="
                  inline-flex items-center gap-2
                  px-3 py-1
                  rounded-full
                  bg-amber-500/15
                  text-amber-400
                  border border-amber-500/30
                  text-xs font-bold
                  uppercase tracking-wider
                "
              >
                <Home className="w-3.5 h-3.5" />
                <span>Perkhidmatan Subsale</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Khidmat Ejen Subsale Professional
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                Klang Valley Homes membantu pelanggan yang mencari atau ingin
                menjual hartanah subsale (rumah terpakai / sedia ada).
                <strong>
                  {' '}Perkhidmatan subsale kami tertumpu bagi kawasan dalam
                  lingkungan approximately 10 km dari Shah Alam.
                </strong>
              </p>

              <div
                className="
                  flex items-start gap-2
                  pt-1
                  text-xs
                  text-amber-400/90
                  font-medium
                  max-w-4xl
                "
              >
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />

                <span>
                  Nota: Had lingkungan 10 km dari Shah Alam ini terpakai untuk
                  <strong> hartanah subsale sahaja</strong>. Bagi projek
                  perumahan baru, liputan kami meliputi seluruh kawasan
                  tumpuan Klang Valley.
                </span>
              </div>

              {/* Listings */}
              {!isLoadingSubsale && subsaleListings.length > 0 && (
                <div className="pt-8">

                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div>
                      <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
                        Subsale Properties Available
                      </h4>

                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Rumah sedia ada yang tersedia untuk jualan.
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-amber-400 whitespace-nowrap">
                      {subsaleListings.length} Listing
                      {subsaleListings.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div
                    id="subsale-listings-carousel"
                    className="
                      flex flex-nowrap gap-5
                      overflow-x-auto
                      overflow-y-hidden
                      snap-x snap-mandatory
                      scroll-smooth
                      pb-4
                      touch-pan-x
                      overscroll-x-contain
                      [&::-webkit-scrollbar]:hidden
                    "
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {subsaleListings.map((listing) => {
                      const image = transformImageUrl(
                        listing.IMAGE_1 || ''
                      );

                      return (
                        <div
                          key={
                            listing.ID ||
                            listing.PROPERTY_NAME
                          }
                          className="
                            min-w-0
                            shrink-0
                            w-[88%]
                            sm:w-[48%]
                            lg:w-[32%]
                            snap-start
                            bg-slate-950
                            rounded-2xl
                            border border-slate-800
                            overflow-hidden
                            shadow-xl
                            hover:border-amber-500/40
                            transition-all
                            duration-300
                            group
                          "
                        >

                          {/* Image */}
                          {image ? (
                            <div className="h-48 bg-slate-800 overflow-hidden">
                              <img
                                src={image}
                                alt={listing.PROPERTY_NAME}
                                className="
                                  w-full h-full
                                  object-cover
                                  group-hover:scale-105
                                  transition-transform
                                  duration-500
                                "
                                loading="lazy"
                                onError={(event) => {
                                  const fallback =
                                    getFallbackPlaceholder(
                                      listing.PROPERTY_TYPE,
                                      listing.ID
                                    );

                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src =
                                    fallback;
                                }}
                              />
                            </div>
                          ) : (
                            <div
                              className="
                                h-48
                                bg-slate-800
                                flex items-center
                                justify-center
                              "
                            >
                              <Home className="w-12 h-12 text-slate-600" />
                            </div>
                          )}

                          <div className="p-5 space-y-3">

                            {/* Title */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <span
                                  className="
                                    text-[10px]
                                    uppercase
                                    tracking-wider
                                    text-amber-400
                                    font-bold
                                  "
                                >
                                  {listing.AREA}
                                </span>

                                <h5
                                  className="
                                    text-base
                                    font-serif
                                    font-bold
                                    text-white
                                    mt-1
                                    leading-snug
                                  "
                                >
                                  {listing.PROPERTY_NAME}
                                </h5>
                              </div>

                              {listing.STATUS && (
                                <span
                                  className="
                                    text-[10px]
                                    px-2 py-1
                                    rounded-full
                                    bg-emerald-500/10
                                    text-emerald-400
                                    border border-emerald-500/20
                                    whitespace-nowrap
                                  "
                                >
                                  {listing.STATUS}
                                </span>
                              )}
                            </div>

                            {/* Address */}
                            {listing.ADDRESS && (
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {listing.ADDRESS}
                              </p>
                            )}

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-2 text-xs">

                              {listing.PRICE && (
                                <div className="bg-slate-900 rounded-lg p-2.5">
                                  <span className="block text-slate-500">
                                    Harga
                                  </span>

                                  <strong className="text-amber-400">
                                    {listing.PRICE}
                                  </strong>
                                </div>
                              )}

                              {listing.PROPERTY_TYPE && (
                                <div className="bg-slate-900 rounded-lg p-2.5">
                                  <span className="block text-slate-500">
                                    Jenis
                                  </span>

                                  <strong className="text-white">
                                    {listing.PROPERTY_TYPE}
                                  </strong>
                                </div>
                              )}

                              {listing.BEDROOMS && (
                                <div className="bg-slate-900 rounded-lg p-2.5">
                                  <span className="block text-slate-500">
                                    Bilik
                                  </span>

                                  <strong className="text-white">
                                    {listing.BEDROOMS}
                                  </strong>
                                </div>
                              )}

                              {listing.BATHROOMS && (
                                <div className="bg-slate-900 rounded-lg p-2.5">
                                  <span className="block text-slate-500">
                                    Bilik Air
                                  </span>

                                  <strong className="text-white">
                                    {listing.BATHROOMS}
                                  </strong>
                                </div>
                              )}

                            </div>

                            {/* Additional Info */}
                            {(listing.BUILT_UP ||
                              listing.LAND_SIZE ||
                              listing.TENURE) && (
                              <div className="text-xs text-slate-400 space-y-1">

                                {listing.BUILT_UP && (
                                  <div>
                                    Built Up:{' '}
                                    <span className="text-slate-200">
                                      {listing.BUILT_UP}
                                    </span>
                                  </div>
                                )}

                                {listing.LAND_SIZE && (
                                  <div>
                                    Land Size:{' '}
                                    <span className="text-slate-200">
                                      {listing.LAND_SIZE}
                                    </span>
                                  </div>
                                )}

                                {listing.TENURE && (
                                  <div>
                                    Tenure:{' '}
                                    <span className="text-slate-200">
                                      {listing.TENURE}
                                    </span>
                                  </div>
                                )}

                              </div>
                            )}

                            {/* Description */}
                            {listing.DESCRIPTION && (
                              <p
                                className="
                                  text-xs
                                  text-slate-400
                                  leading-relaxed
                                  line-clamp-3
                                "
                              >
                                {listing.DESCRIPTION}
                              </p>
                            )}

                            {/* View Details */}
                            <button
                              type="button"
                              onClick={() =>
                                openSubsale(listing)
                              }
                              className="
                                w-full mt-2
                                px-4 py-3
                                rounded-xl
                                bg-amber-500
                                hover:bg-amber-400
                                text-slate-950
                                font-bold
                                text-xs
                                shadow-lg
                                shadow-amber-500/20
                                transition-all
                                flex items-center
                                justify-center
                                gap-2
                              "
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoadingSubsale && (
                <div className="pt-8">
                  <div className="text-center py-8 text-sm text-slate-400">
                    Memuatkan listing subsale...
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <SubsaleDetailModal
        listing={selectedSubsale}
        onClose={closeSubsale}
        onApplyEligibility={(propertyName) => {
          if (onOpenEligibility) {
            onOpenEligibility(propertyName);
          }
        }}
      />
    </>
  );
};