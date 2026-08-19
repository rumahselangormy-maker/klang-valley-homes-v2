import React, { useEffect, useState } from 'react';
import {
  Database,
  FileCheck2,
  Building2,
  UserCheck,
  Home,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { fetchSubsale, SubsaleListing } from '../services/api';

interface WhyChooseUsProps {
  onOpenEligibility?: () => void;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ onOpenEligibility }) => {
  const [subsaleListings, setSubsaleListings] = useState<SubsaleListing[]>([]);
  const [isLoadingSubsale, setIsLoadingSubsale] = useState(true);

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

  useEffect(() => {
    let isMounted = true;

    const loadSubsale = async () => {
      try {
        const listings = await fetchSubsale();

        if (isMounted) {
          setSubsaleListings(listings);
        }
      } catch (error) {
        console.error('Failed to load subsale listings:', error);

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

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <div
                key={idx}
                className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 shadow-xl hover:border-amber-500/40 transition-all duration-300 space-y-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dedicated Subsale Property Services Banner */}
        <div className="mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <Home className="w-3.5 h-3.5" />
              <span>Perkhidmatan Subsale (Rumah Sedia Ada)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Khidmat Ejen Subsale Professional
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
              Klang Valley Homes turut membantu pelanggan yang mencari atau ingin menjual
              hartanah subsale (rumah terpakai/sedia ada).{' '}
              <strong>
                Perkhidmatan subsale kami tertumpu bagi kawasan dalam lingkungan approximately
                10 km dari Shah Alam.
              </strong>
            </p>

            <div className="flex items-start gap-2 pt-1 text-xs text-amber-400/90 font-medium max-w-4xl">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />

              <span>
                Nota: Had lingkungan 10 km dari Shah Alam ini terpakai untuk{' '}
                <strong>hartanah subsale sahaja</strong>. Bagi projek perumahan baru, liputan
                kami meliputi seluruh kawasan tumpuan Klang Valley.
              </span>
            </div>

            {/* Subsale Listings */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {subsaleListings.map((listing) => {
                    const image = listing.IMAGE_1 || '';

                    return (
                      <div
                        key={listing.ID || listing.PROPERTY_NAME}
                        className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300 group"
                      >
                        {image ? (
                          <div className="h-48 bg-slate-800 overflow-hidden">
                            <img
                              src={image}
                              alt={listing.PROPERTY_NAME}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="h-48 bg-slate-800 flex items-center justify-center">
                            <Home className="w-12 h-12 text-slate-600" />
                          </div>
                        )}

                        <div className="p-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                                {listing.AREA}
                              </span>

                              <h5 className="text-base font-serif font-bold text-white mt-1 leading-snug">
                                {listing.PROPERTY_NAME}
                              </h5>
                            </div>

                            {listing.STATUS && (
                              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                                {listing.STATUS}
                              </span>
                            )}
                          </div>

                          {listing.ADDRESS && (
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {listing.ADDRESS}
                            </p>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {listing.PRICE && (
                              <div className="bg-slate-900 rounded-lg p-2.5">
                                <span className="block text-slate-500">Harga</span>
                                <strong className="text-amber-400">
                                  {listing.PRICE}
                                </strong>
                              </div>
                            )}

                            {listing.PROPERTY_TYPE && (
                              <div className="bg-slate-900 rounded-lg p-2.5">
                                <span className="block text-slate-500">Jenis</span>
                                <strong className="text-white">
                                  {listing.PROPERTY_TYPE}
                                </strong>
                              </div>
                            )}

                            {listing.BEDROOMS && (
                              <div className="bg-slate-900 rounded-lg p-2.5">
                                <span className="block text-slate-500">Bilik</span>
                                <strong className="text-white">
                                  {listing.BEDROOMS}
                                </strong>
                              </div>
                            )}

                            {listing.BATHROOMS && (
                              <div className="bg-slate-900 rounded-lg p-2.5">
                                <span className="block text-slate-500">Bilik Air</span>
                                <strong className="text-white">
                                  {listing.BATHROOMS}
                                </strong>
                              </div>
                            )}
                          </div>

                          {(listing.BUILT_UP || listing.LAND_SIZE || listing.TENURE) && (
                            <div className="text-xs text-slate-400 space-y-1">
                              {listing.BUILT_UP && (
                                <div>
                                  Built Up: <span className="text-slate-200">{listing.BUILT_UP}</span>
                                </div>
                              )}

                              {listing.LAND_SIZE && (
                                <div>
                                  Land Size: <span className="text-slate-200">{listing.LAND_SIZE}</span>
                                </div>
                              )}

                              {listing.TENURE && (
                                <div>
                                  Tenure: <span className="text-slate-200">{listing.TENURE}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {listing.DESCRIPTION && (
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {listing.DESCRIPTION}
                            </p>
                          )}

                          {onOpenEligibility && (
                            <button
                              onClick={() => onOpenEligibility()}
                              className="w-full mt-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                            >
                              <span>Pertanyaan Subsale</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoadingSubsale && (
              <div className="pt-8">
                <div className="text-center py-8 text-sm text-slate-400">
                  Memuatkan listing subsale...
                </div>
              </div>
            )}

            {/* General Inquiry */}
            {onOpenEligibility && (
              <div className="pt-7 flex justify-end">
                <button
                  onClick={() => onOpenEligibility()}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <span>Pertanyaan Subsale</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};