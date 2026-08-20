// Fallback imagery for Malaysian homes and property developments when MAIN_IMAGE is blank
export const PLACEHOLDER_IMAGES: Record<string, string[]> = {
  TERRACE: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  ],
  CONDO: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580041065738-e72023775cdc?auto=format&fit=crop&w=1200&q=80',
  ],
  APARTMENT: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  ],
  SEMI_D: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  ],
  BUNGALOW: [
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
  ],
  DEFAULT: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  ],
};

/**
 * Automatically converts Google Drive sharing/file links
 * into browser-displayable thumbnail URLs.
 *
 * Supports:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://drive.usercontent.google.com/...
 * - https://docs.google.com/...
 *
 * Direct HTTP/HTTPS image links are returned as-is.
 */
export function transformImageUrl(rawUrl?: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return '';
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return '';
  }

  // ---------------------------------------------------------
  // GOOGLE DRIVE
  // ---------------------------------------------------------
  if (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    trimmed.includes('drive.usercontent.google.com')
  ) {
    // 1. Standard Google Drive:
    // /file/d/FILE_ID/view
    // /d/FILE_ID
    const fileDMatch = trimmed.match(
      /\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/
    );

    if (fileDMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${fileDMatch[1]}&sz=w1200`;
    }

    // 2. Google Drive:
    // ?id=FILE_ID
    // &id=FILE_ID
    const idMatch = trimmed.match(
      /[?&]id=([a-zA-Z0-9_-]+)/
    );

    if (idMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
    }

    // 3. Google Drive folder
    const folderMatch = trimmed.match(
      /\/folders\/([a-zA-Z0-9_-]+)/
    );

    if (folderMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${folderMatch[1]}&sz=w1200`;
    }

    // 4. Google Drive uc?id=FILE_ID
    const ucMatch = trimmed.match(
      /[?&]id=([a-zA-Z0-9_-]+)/
    );

    if (ucMatch?.[1]) {
      return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w1200`;
    }

    // 5. If already a Google Drive thumbnail URL,
    // return it unchanged.
    if (trimmed.includes('drive.google.com/thumbnail')) {
      return trimmed;
    }
  }

  // ---------------------------------------------------------
  // DIRECT IMAGE URL
  // ---------------------------------------------------------
  return trimmed;
}

/**
 * Parses multiple comma, semicolon or newline-separated
 * image URLs and converts Google Drive URLs.
 */
export function parseImageUrls(rawInput?: string): string[] {
  if (!rawInput || typeof rawInput !== 'string') {
    return [];
  }

  const parts = rawInput.split(/[\n,;]+/);
  const result: string[] = [];

  for (const part of parts) {
    const cleaned = part.trim();

    if (cleaned.length > 5) {
      const transformed = transformImageUrl(cleaned);

      if (
        transformed &&
        (
          transformed.startsWith('http') ||
          transformed.startsWith('//')
        )
      ) {
        result.push(transformed);
      }
    }
  }

  return Array.from(new Set(result));
}

/**
 * Gets a clean fallback placeholder image URL
 * based on property type and ID.
 */
export function getFallbackPlaceholder(
  propertyType?: string,
  id?: string
): string {
  const typeKey = (propertyType || '')
    .toUpperCase()
    .replace('-', '_');

  let categoryList = PLACEHOLDER_IMAGES.DEFAULT;

  if (
    typeKey.includes('TERRACE') ||
    typeKey.includes('LINK')
  ) {
    categoryList = PLACEHOLDER_IMAGES.TERRACE;
  } else if (
    typeKey.includes('CONDO') ||
    typeKey.includes('SERVICED')
  ) {
    categoryList = PLACEHOLDER_IMAGES.CONDO;
  } else if (
    typeKey.includes('APARTMENT') ||
    typeKey.includes('FLAT')
  ) {
    categoryList = PLACEHOLDER_IMAGES.APARTMENT;
  } else if (typeKey.includes('SEMI')) {
    categoryList = PLACEHOLDER_IMAGES.SEMI_D;
  } else if (typeKey.includes('BUNGALOW')) {
    categoryList = PLACEHOLDER_IMAGES.BUNGALOW;
  }

  const charSum = (id || '')
    .split('')
    .reduce(
      (acc, c) => acc + c.charCodeAt(0),
      0
    );

  const index = charSum % categoryList.length;

  return (
    categoryList[index] ||
    PLACEHOLDER_IMAGES.DEFAULT[0]
  );
}

export function getPropertyImage(
  mainImage?: string,
  propertyType?: string,
  id?: string
): string {
  if (
    mainImage &&
    mainImage.trim().length > 5
  ) {
    const parsed = parseImageUrls(mainImage);

    if (parsed.length > 0) {
      return parsed[0];
    }
  }

  return getFallbackPlaceholder(
    propertyType,
    id
  );
}

export const POPULAR_AREAS = [
  {
    name: 'Shah Alam',
    tagline:
      'Modern townships, green parks & top educational hubs',
    image:
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Klang',
    tagline:
      'Established heritage city with strong highway connections',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Puncak Alam',
    tagline:
      'Rapidly growing mega-townships with affordable homes',
    image:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Puchong',
    tagline:
      'Vibrant township with LRT transit & extensive amenities',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Jenjarom',
    tagline:
      'Emerging residential area with scenic suburban living',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pulau Indah',
    tagline:
      'Strategic coastal growth hub & industrial maritime belt',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Subang',
    tagline:
      'Premier lifestyle hub, transit convenience & commercial centers',
    image:
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Petaling Jaya',
    tagline:
      'Vibrant commercial & residential heart of Klang Valley',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
];