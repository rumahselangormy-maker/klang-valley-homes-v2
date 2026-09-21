export interface ListingWithStatus {
  STATUS?: unknown;
}

const PUBLIC_LISTING_STATUS = 'available';

/**
 * Public listings must explicitly opt in with STATUS = Available.
 * Matching is exact after trimming whitespace and normalizing case.
 */
export function isPublicListing(
  listing: ListingWithStatus | null | undefined,
): boolean {
  if (!listing || typeof listing.STATUS !== 'string') {
    return false;
  }

  return listing.STATUS.trim().toLowerCase() === PUBLIC_LISTING_STATUS;
}

export function filterPublicListings<T extends ListingWithStatus>(
  listings: readonly T[],
): T[] {
  return listings.filter(isPublicListing);
}

export type PublicListingCollection = 'projects' | 'subsale';

/**
 * Converts an upstream Apps Script response into the only shape exposed by
 * the public listing API. Hidden rows and unrelated upstream fields are not
 * forwarded to the browser.
 */
export function createPublicListingResponse(
  payload: unknown,
  collection: PublicListingCollection,
): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Invalid upstream listing response.');
  }

  const record = payload as Record<string, unknown>;

  if (record.success !== true || !Array.isArray(record[collection])) {
    return {
      success: false,
      count: 0,
      [collection]: [],
      error:
        typeof record.error === 'string'
          ? record.error
          : 'Upstream listing response was unsuccessful.',
    };
  }

  const publicListings = filterPublicListings(
    record[collection] as ListingWithStatus[],
  );

  return {
    success: true,
    count: publicListings.length,
    [collection]: publicListings,
  };
}

export function createPublicListingSlug(name: unknown): string {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Defense-in-depth for direct URLs: even an accidentally unfiltered array
 * cannot resolve a hidden listing.
 */
export function findPublicListingBySlug<T extends ListingWithStatus>(
  listings: readonly T[],
  slug: string,
  getName: (listing: T) => unknown,
): T | undefined {
  return filterPublicListings(listings).find(
    (listing) => createPublicListingSlug(getName(listing)) === slug,
  );
}
