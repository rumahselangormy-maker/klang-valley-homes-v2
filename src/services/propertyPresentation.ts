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

export function normalizeArea(value = ''): string {
  const area = value.trim().replace(/\s+/g, ' ');
  if (/^(SAH|SHAH ALAM)$/i.test(area)) return 'Shah Alam';
  return area.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
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
