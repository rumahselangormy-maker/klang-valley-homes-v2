import type { LeadFormData } from '../types';

export type LeadSubmissionResult =
  | { outcome: 'confirmed'; success: true; leadId: string }
  | { outcome: 'rejected' | 'uncertain'; success: false; message: string };
export const UNCERTAIN_LEAD_MESSAGE = 'Simpanan permohonan belum dapat disahkan. Maklumat mungkin telah disimpan. Jangan hantar semula; hubungi Ryna untuk semakan.';

export function validateLead(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Maklumat borang tidak sah.';
  const data = value as Record<string, unknown>;
  for (const [field, label] of [['name', 'nama'], ['phone', 'nombor telefon'], ['email', 'emel'], ['preferredArea', 'kawasan pilihan']]) {
    if (typeof data[field] !== 'string' || !data[field].trim()) return `Sila lengkapkan ${label}.`;
  }
  if (!(data.email as string).includes('@')) return 'Sila isi alamat emel yang sah.';
  if (data.consent !== true) return 'Sila tanda kotak persetujuan pemprosesan maklumat.';
  return null;
}

export function confirmedLeadId(value: unknown): string | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const data = value as Record<string, unknown>;
  return data.success === true && typeof data.leadId === 'string' && /^LEAD-[0-9]+$/.test(data.leadId) ? data.leadId : null;
}

export function prepareLeadWhatsApp(leadId: string, draft: LeadFormData): string {
  const property = draft.interestedProject.trim();
  const area = draft.preferredArea.trim();
  const enquiry = property
    ? `Saya berminat dengan rumah ${property}${area ? ` di ${area}` : ''}.`
    : area ? `Saya berminat dengan rumah di ${area}.` : 'Saya berminat untuk mencari rumah.';
  const paragraphs = [
    `Hi, saya ${draft.name.trim()}.`,
    enquiry,
    'Saya sudah mengisi borang Semak Kelayakan melalui rumahselangor.my.',
    `Rujukan: ${leadId}`,
    'Boleh bantu saya untuk langkah seterusnya?',
  ];
  return `https://wa.me/60178399316?text=${encodeURIComponent(paragraphs.join('\n\n'))}`;
}

// Memory-only: confirmed/uncertain submissions stay locked across modal reopen.
// Full reload is not backend idempotency and must not be used to retry uncertainty.
export function createLeadSubmissionGuard() {
  let locked = false;
  return {
    async run(draft: LeadFormData, send: (value: LeadFormData) => Promise<LeadSubmissionResult>) {
      if (locked) return null;
      const error = validateLead(draft);
      if (error) return { result: { outcome: 'rejected', success: false, message: error } as LeadSubmissionResult, draft: { ...draft } };
      locked = true;
      const snapshot = { ...draft };
      let result: LeadSubmissionResult;
      try { result = await send(snapshot); }
      catch { result = { outcome: 'uncertain', success: false, message: UNCERTAIN_LEAD_MESSAGE }; }
      if (result.outcome === 'rejected') locked = false;
      return { result, draft: snapshot, whatsappUrl: result.outcome === 'confirmed' ? prepareLeadWhatsApp(result.leadId, snapshot) : undefined };
    },
  };
}
