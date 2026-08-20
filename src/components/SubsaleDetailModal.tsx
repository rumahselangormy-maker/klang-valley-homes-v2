import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { SubsaleListing } from '../services/api';

interface SubsaleDetailModalProps {
  listing: SubsaleListing | null;
  onClose: () => void;
  onApplyEligibility: (propertyName: string) => void;
}

/**
 * Extract Google Drive file ID from different Google Drive URL formats.
 */
function getGoogleDriveFileId(url: string): string {
  if (!url) return '';

  const trimmed = url.trim();

  if (!trimmed) return '';

  // /file/d/FILE_ID/view
  const fileMatch = trimmed.match(
    /drive\.google\.com\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/
  );

  if (fileMatch?.[1]) {
    return fileMatch[1];
  }

  // ?id=FILE_ID
  const idMatch = trimmed.match(
    /[?&]id=([a-zA-Z0-9_-]+)/
  );

  if (idMatch?.[1]) {
    return idMatch[1];
  }

  // googleusercontent URL
  const googleusercontentMatch = trimmed.match(
    /googleusercontent\.com\/(?:d\/)?([a-zA-Z0-9_-]+)/
  );

  if (googleusercontentMatch?.[1]) {
    return googleusercontentMatch[1];
  }

  return '';
}

/**
 * Convert every image URL to our own server image proxy.
 *
 * This prevents the browser from loading Google Drive images
 * directly and avoids individual Google Drive embedding issues.
 */
function getImageSources(url: string): string[] {
  if (!url || typeof url !== 'string') {
    return [];
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return [];
  }

  const proxyUrl =
    `/api/image?url=${encodeURIComponent(trimmed)}`;

  return [proxyUrl];
}

export const SubsaleDetailModal: React.FC<
  SubsaleDetailModalProps
> = ({
  listing,
  onClose,
  onApplyEligibility,
}) => {
  /**
   * Build image source groups.
   *
   * IMAGE_1 -> proxy URL
   * IMAGE_2 -> proxy URL
   * IMAGE_3 -> proxy URL
   * IMAGE_4 -> proxy URL
   * IMAGE_5 -> proxy URL
   */
  const imageSources = useMemo(() => {
    if (!listing) return [];

    return [
      listing.IMAGE_1,
      listing.IMAGE_2,
      listing.IMAGE_3,
      listing.IMAGE_4,
      listing.IMAGE_5,
    ]
      .filter(
        (url): url is string =>
          typeof url === 'string' &&
          url.trim().length > 0
      )
      .map((url) => getImageSources(url))
      .filter(
        (sources) => sources.length > 0
      );
  }, [listing]);

  /**
   * Selected gallery image.
   */
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  /**
   * Fallback source index for main image.
   */
  const [mainSourceIndex, setMainSourceIndex] =
    useState(0);

  /**
   * Fallback source index for thumbnails.
   */
  const [
    thumbnailSourceIndexes,
    setThumbnailSourceIndexes,
  ] = useState<number[]>([]);

  /**
   * Lightbox.
   */
  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const [lightboxIndex, setLightboxIndex] =
    useState(0);

  /**
   * Reset gallery when listing changes.
   */
  useEffect(() => {
    setSelectedIndex(0);
    setMainSourceIndex(0);
    setLightboxIndex(0);
    setLightboxOpen(false);

    setThumbnailSourceIndexes(
      imageSources.map(() => 0)
    );
  }, [listing?.ID, imageSources.length]);

  if (!listing) {
    return null;
  }

  /**
   * Current selected image.
   */
  const selectedSources =
    imageSources[selectedIndex] || [];

  const selectedImage =
    selectedSources[mainSourceIndex] ||
    selectedSources[0] ||
    '';

  /**
   * Select gallery image.
   */
  const handleSelectImage = (
    index: number
  ) => {
    setSelectedIndex(index);
    setMainSourceIndex(0);
  };

  /**
   * Main image error handler.
   *
   * There is no placeholder fallback.
   */
  const handleMainImageError = () => {
    if (
      mainSourceIndex + 1 <
      selectedSources.length
    ) {
      setMainSourceIndex(
        mainSourceIndex + 1
      );
    }
  };

  /**
   * Thumbnail error handler.
   */
  const handleThumbnailError = (
    index: number
  ) => {
    const sources =
      imageSources[index];

    if (!sources) return;

    setThumbnailSourceIndexes(
      (current) => {
        const updated = [...current];

        const currentAttempt =
          updated[index] || 0;

        if (
          currentAttempt + 1 <
          sources.length
        ) {
          updated[index] =
            currentAttempt + 1;
        }

        return updated;
      }
    );
  };

  /**
   * Open lightbox.
   */
  const openLightbox = () => {
    setLightboxIndex(selectedIndex);
    setLightboxOpen(true);
  };

  /**
   * Previous lightbox image.
   */
  const previousLightboxImage = () => {
    setLightboxIndex((current) => {
      if (imageSources.length === 0) {
        return 0;
      }

      return (
        (current -
          1 +
          imageSources.length) %
        imageSources.length
      );
    });
  };

  /**
   * Next lightbox image.
   */
  const nextLightboxImage = () => {
    setLightboxIndex((current) => {
      if (imageSources.length === 0) {
        return 0;
      }

      return (
        (current + 1) %
        imageSources.length
      );
    });
  };

  const lightboxSources =
    imageSources[lightboxIndex] || [];

  const lightboxImage =
    lightboxSources[0] || '';

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        p-2 sm:p-6
        bg-slate-950/80
        backdrop-blur-md
        overflow-y-auto
        animate-in fade-in duration-200
      "
    >
      <div
        className="
          relative w-full max-w-4xl
          bg-slate-900
          border border-slate-800
          rounded-2xl
          shadow-2xl
          overflow-hidden
          my-auto
          max-h-[94vh] sm:max-h-[92vh]
          flex flex-col
        "
      >
        {/* =========================
            HEADER
        ========================== */}

        <div
          className="
            sticky top-0 z-20
            px-4 py-3
            sm:px-5 sm:py-4
            bg-slate-900/95
            border-b border-slate-800
            backdrop-blur-md
            flex items-center justify-between
          "
        >
          <div className="pr-3">
            <span
              className="
                text-[10px] sm:text-xs
                font-semibold
                text-amber-400
                uppercase
                tracking-wider
                block
              "
            >
              {listing.AREA} •{' '}
              {listing.PROPERTY_TYPE}
            </span>

            <h2
              className="
                text-base sm:text-2xl
                font-serif
                font-bold
                text-white
                line-clamp-2
              "
            >
              {listing.PROPERTY_NAME}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="
              p-1.5 sm:p-2
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              text-slate-400
              hover:text-white
              transition-colors
              shrink-0
            "
            aria-label="Close detail modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================
            BODY
        ========================== */}

        <div
          className="
            p-4 sm:p-8
            overflow-y-auto
            space-y-5 sm:space-y-8
            flex-1
          "
        >
          {/* =========================
              MAIN IMAGE + GALLERY
          ========================== */}

          <div className="space-y-3">
            {/* Main Image */}

            <div
              className="
                relative
                h-60 sm:h-96
                w-full
                rounded-xl sm:rounded-2xl
                overflow-hidden
                bg-slate-950
                border border-slate-800
              "
            >
              {selectedImage ? (
                <img
                  key={`${selectedIndex}-${mainSourceIndex}`}
                  src={selectedImage}
                  alt={listing.PROPERTY_NAME}
                  className="
                    w-full h-full
                    object-cover
                    cursor-zoom-in
                  "
                  onError={
                    handleMainImageError
                  }
                  onClick={openLightbox}
                />
              ) : (
                <div
                  className="
                    w-full h-full
                    flex items-center
                    justify-center
                    text-slate-600
                  "
                >
                  <Maximize2 className="w-12 h-12" />
                </div>
              )}

              {/* Price */}

              <div
                className="
                  absolute inset-x-0 bottom-0
                  p-3 sm:p-5
                  bg-gradient-to-t
                  from-slate-950/90
                  to-transparent
                  pointer-events-none
                "
              >
                <span
                  className="
                    text-[10px] sm:text-xs
                    text-amber-300
                    font-semibold
                    block
                  "
                >
                  Harga
                </span>

                <span
                  className="
                    text-xl sm:text-3xl
                    font-serif
                    font-bold
                    text-white
                  "
                >
                  {listing.PRICE ||
                    'Hubungi Untuk Harga'}
                </span>
              </div>

              {/* Status */}

              {listing.STATUS && (
                <span
                  className="
                    absolute top-3 right-3
                    px-2.5 py-1
                    rounded-lg
                    bg-amber-500
                    text-slate-950
                    font-bold
                    text-[10px] sm:text-xs
                    uppercase
                    shadow-md
                  "
                >
                  {listing.STATUS}
                </span>
              )}
            </div>

            {/* =========================
                GALLERY THUMBNAILS
            ========================== */}

            {imageSources.length > 0 && (
              <div
                className="
                  flex gap-2
                  overflow-x-auto
                  pb-2
                  scrollbar-thin
                  scrollbar-thumb-slate-700
                "
              >
                {imageSources.map(
                  (sources, idx) => {
                    const thumbnailAttempt =
                      thumbnailSourceIndexes[
                        idx
                      ] || 0;

                    const thumbnailSrc =
                      sources[
                        thumbnailAttempt
                      ] || sources[0];

                    return (
                      <button
                        key={`${listing.ID}-gallery-${idx}`}
                        type="button"
                        onClick={() =>
                          handleSelectImage(
                            idx
                          )
                        }
                        className={`
                          relative
                          w-20 h-14
                          sm:w-24 sm:h-16
                          rounded-lg
                          overflow-hidden
                          border-2
                          shrink-0
                          transition-all
                          ${
                            selectedIndex ===
                            idx
                              ? 'border-amber-400 scale-95'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }
                        `}
                      >
                        <img
                          key={`${idx}-${thumbnailAttempt}`}
                          src={thumbnailSrc}
                          alt={`${listing.PROPERTY_NAME} - Gallery ${
                            idx + 1
                          }`}
                          className="
                            w-full h-full
                            object-cover
                          "
                          onError={() =>
                            handleThumbnailError(
                              idx
                            )
                          }
                        />

                        <span
                          className="
                            absolute
                            bottom-0 right-0
                            px-1.5 py-0.5
                            bg-black/70
                            text-white
                            text-[9px]
                            font-semibold
                          "
                        >
                          {idx + 1}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* =========================
              ADDRESS
          ========================== */}

          {(listing.ADDRESS ||
            listing.AREA) && (
            <div
              className="
                flex items-start gap-2
                text-xs sm:text-sm
                text-slate-300
              "
            >
              <MapPin
                className="
                  w-4 h-4
                  text-amber-400
                  shrink-0
                  mt-0.5
                "
              />

              <div>
                {listing.ADDRESS && (
                  <p
                    className="
                      font-medium
                      text-white
                    "
                  >
                    {listing.ADDRESS}
                  </p>
                )}

                {listing.AREA && (
                  <p className="text-slate-400">
                    {listing.AREA}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* =========================
              SPECIFICATIONS
          ========================== */}

          <div
            className="
              grid grid-cols-2
              sm:grid-cols-4
              gap-2 sm:gap-3
              p-3 sm:p-4
              bg-slate-950
              rounded-xl sm:rounded-2xl
              border border-slate-800/80
            "
          >
            {/* Bedrooms */}

            <div
              className="
                p-2.5 sm:p-3
                bg-slate-900/60
                rounded-lg
                border border-slate-800/50
              "
            >
              <span
                className="
                  text-[10px] sm:text-xs
                  text-slate-400
                  flex items-center
                  gap-1 mb-1
                "
              >
                <Bed className="w-3.5 h-3.5 text-amber-400" />
                Bilik
              </span>

              <p
                className="
                  text-xs sm:text-sm
                  font-bold
                  text-white
                "
              >
                {listing.BEDROOMS || '-'}
              </p>
            </div>

            {/* Bathrooms */}

            <div
              className="
                p-2.5 sm:p-3
                bg-slate-900/60
                rounded-lg
                border border-slate-800/50
              "
            >
              <span
                className="
                  text-[10px] sm:text-xs
                  text-slate-400
                  flex items-center
                  gap-1 mb-1
                "
              >
                <Bath className="w-3.5 h-3.5 text-amber-400" />
                Bilik Air
              </span>

              <p
                className="
                  text-xs sm:text-sm
                  font-bold
                  text-white
                "
              >
                {listing.BATHROOMS || '-'}
              </p>
            </div>

            {/* Built-up */}

            <div
              className="
                p-2.5 sm:p-3
                bg-slate-900/60
                rounded-lg
                border border-slate-800/50
              "
            >
              <span
                className="
                  text-[10px] sm:text-xs
                  text-slate-400
                  flex items-center
                  gap-1 mb-1
                "
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                Built-up
              </span>

              <p
                className="
                  text-xs sm:text-sm
                  font-bold
                  text-white
                "
              >
                {listing.BUILT_UP || '-'}
              </p>
            </div>

            {/* Land Size */}

            <div
              className="
                p-2.5 sm:p-3
                bg-slate-900/60
                rounded-lg
                border border-slate-800/50
              "
            >
              <span
                className="
                  text-[10px] sm:text-xs
                  text-slate-400
                  flex items-center
                  gap-1 mb-1
                "
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Land Size
              </span>

              <p
                className="
                  text-xs sm:text-sm
                  font-bold
                  text-white
                "
              >
                {listing.LAND_SIZE || '-'}
              </p>
            </div>
          </div>

          {/* =========================
              PROPERTY INFORMATION
          ========================== */}

          <div
            className="
              grid grid-cols-1
              md:grid-cols-2
              gap-4 sm:gap-6
            "
          >
            <div className="space-y-3">
              <h3
                className="
                  text-sm sm:text-base
                  font-serif
                  font-bold
                  text-white
                "
              >
                Maklumat Hartanah
              </h3>

              <div
                className="
                  space-y-2
                  text-xs sm:text-sm
                "
              >
                {listing.PROPERTY_TYPE && (
                  <div
                    className="
                      flex justify-between
                      gap-4
                      border-b
                      border-slate-800
                      pb-2
                    "
                  >
                    <span className="text-slate-400">
                      Jenis Hartanah
                    </span>

                    <span
                      className="
                        text-white
                        font-semibold
                        text-right
                      "
                    >
                      {listing.PROPERTY_TYPE}
                    </span>
                  </div>
                )}

                {listing.TENURE && (
                  <div
                    className="
                      flex justify-between
                      gap-4
                      border-b
                      border-slate-800
                      pb-2
                    "
                  >
                    <span className="text-slate-400">
                      Tenure
                    </span>

                    <span
                      className="
                        text-white
                        font-semibold
                        text-right
                      "
                    >
                      {listing.TENURE}
                    </span>
                  </div>
                )}

                {listing.TITLE && (
                  <div
                    className="
                      flex justify-between
                      gap-4
                      border-b
                      border-slate-800
                      pb-2
                    "
                  >
                    <span className="text-slate-400">
                      Title
                    </span>

                    <span
                      className="
                        text-white
                        font-semibold
                        text-right
                      "
                    >
                      {listing.TITLE}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}

            <div className="space-y-3">
              <h3
                className="
                  text-sm sm:text-base
                  font-serif
                  font-bold
                  text-white
                "
              >
                Penerangan
              </h3>

              <p
                className="
                  text-xs sm:text-sm
                  text-slate-300
                  leading-relaxed
                  whitespace-pre-line
                "
              >
                {listing.DESCRIPTION ||
                  'Maklumat lanjut mengenai hartanah ini boleh diberikan oleh ejen kami.'}
              </p>
            </div>
          </div>
        </div>

        {/* =========================
            FOOTER CTA
        ========================== */}

        <div
          className="
            p-3.5 sm:p-5
            bg-slate-950
            border-t border-slate-800
            flex flex-col sm:flex-row
            items-center
            justify-between
            gap-3
          "
        >
          <div
            className="
              text-center
              sm:text-left
            "
          >
            <span
              className="
                text-[11px] sm:text-xs
                text-slate-400
                block
              "
            >
              Berminat dengan hartanah ini?
            </span>

            <span
              className="
                text-xs sm:text-sm
                font-bold
                text-white
              "
            >
              Semak kelayakan pinjaman perumahan anda secara percuma
            </span>
          </div>

          <button
            onClick={() => {
              onClose();

              onApplyEligibility(
                listing.PROPERTY_NAME
              );
            }}
            className="
              w-full sm:w-auto
              px-5 py-2.5
              sm:px-6 sm:py-3
              rounded-xl
              bg-gradient-to-r
              from-amber-500
              to-amber-600
              hover:from-amber-400
              hover:to-amber-500
              text-slate-950
              font-bold
              text-xs sm:text-sm
              shadow-lg
              shadow-amber-500/20
              transition-all
              flex items-center
              justify-center
              gap-2
            "
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />

            <span>
              Semak Kelayakan Untuk Property Ini
            </span>
          </button>
        </div>
      </div>

      {/* =========================
          LIGHTBOX
      ========================== */}

      {lightboxOpen &&
        imageSources.length > 0 && (
          <div
            className="
              fixed inset-0 z-[100]
              bg-black/95
              flex items-center
              justify-center
              p-4
            "
            onClick={() =>
              setLightboxOpen(false)
            }
          >
            {/* Close */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxOpen(false);
              }}
              className="
                absolute top-4 right-4
                z-[110]
                w-12 h-12
                rounded-full
                bg-slate-800/80
                hover:bg-slate-700
                text-white
                flex items-center
                justify-center
                text-3xl
              "
            >
              ×
            </button>

            {/* Previous / Next */}

            {imageSources.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    previousLightboxImage();
                  }}
                  className="
                    absolute left-4
                    z-[110]
                    w-12 h-12
                    rounded-full
                    bg-slate-800/80
                    hover:bg-slate-700
                    text-white
                    text-4xl
                    flex items-center
                    justify-center
                  "
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    nextLightboxImage();
                  }}
                  className="
                    absolute right-4
                    z-[110]
                    w-12 h-12
                    rounded-full
                    bg-slate-800/80
                    hover:bg-slate-700
                    text-white
                    text-4xl
                    flex items-center
                    justify-center
                  "
                >
                  ›
                </button>
              </>
            )}

            {/* Lightbox Image */}

            {lightboxImage && (
              <img
                src={lightboxImage}
                alt={`${listing.PROPERTY_NAME} - Image ${
                  lightboxIndex + 1
                }`}
                className="
                  max-w-[95vw]
                  max-h-[92vh]
                  w-auto
                  h-auto
                  object-contain
                "
                onClick={(event) =>
                  event.stopPropagation()
                }
              />
            )}
          </div>
        )}
    </div>
  );
};