const HIGH_RISE_TYPES = /apartment|condo|minium|flat|soho|serviced|suite/i;
const LANDED_TYPES = /terrace|semi[- ]?d|bungalow|townhouse|cluster|link house/i;

export function parsePrice(value: string | number | null | undefined): number {
  const normalized = String(value ?? '').replace(/[^0-9.]/g, '');
  return Number.parseFloat(normalized) || 0;
}

export function formatRinggit(value: string | number | null | undefined): string {
  const amount = parsePrice(value);
  return amount
    ? `RM${amount.toLocaleString('en-MY', { maximumFractionDigits: 2 })}`
    : String(value ?? '').trim() || 'Hubungi Untuk Harga';
}

export function calculateMonthlyEstimate(value: string | number | null | undefined): number {
  const principal = parsePrice(value);
  if (!principal) return 0;
  const monthlyRate = 0.038 / 12;
  const payments = 35 * 12;
  const factor = Math.pow(1 + monthlyRate, payments);
  return Math.round((principal * monthlyRate * factor) / (factor - 1));
}

// Active CRM area IDs manually verified by the owner. Stored property data stays unchanged.
const AREA_NAMES: Readonly<Record<string, string>> = {
  SAH: 'Shah Alam', KLG: 'Klang', PAL: 'Puncak Alam', PCH: 'Puchong',
  JER: 'Jenjarom', PI: 'Pulau Indah', TPG: 'Telok Panglima Garang', PJ: 'Petaling Jaya',
};

export function normalizeArea(value = ''): string {
  const area = value.trim().replace(/\s+/g, ' ');
  if (Object.prototype.hasOwnProperty.call(AREA_NAMES, area.toUpperCase())) {
    return AREA_NAMES[area.toUpperCase()];
  }
  return area.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function matchesArea(source = '', selected = ''): boolean {
  const area = normalizeArea(source).toLowerCase();
  const filter = normalizeArea(selected).toLowerCase();
  return !filter || (!!area && area.includes(filter));
}

export function getAreaOptions(values: readonly string[]): string[] {
  return Array.from(new Set(values.map(normalizeArea).filter(Boolean))).sort();
}

export function getPropertySizeDisplay(propertyType = '', builtUp = '', landSize = '') {
  if (HIGH_RISE_TYPES.test(propertyType)) {
    return { label: 'Luas Binaan', value: builtUp || '-' };
  }
  if (LANDED_TYPES.test(propertyType)) {
    return { label: 'Luas Tanah', value: landSize || builtUp || '-' };
  }
  return { label: 'Keluasan', value: builtUp || landSize || '-' };
}
