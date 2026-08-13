import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, ShieldCheck, User, Phone, Mail, MapPin, Building, DollarSign, Briefcase, FileText } from 'lucide-react';
import { LeadFormData } from '../types';
import { submitLead } from '../services/api';

interface EligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectName?: string;
  availableProjects?: string[];
  availableAreas?: string[];
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  isOpen,
  onClose,
  initialProjectName = '',
  availableProjects = [],
  availableAreas = [],
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    leadType: 'PROJEK BARU',
    name: '',
    phone: '',
    email: '',
    preferredArea: '',
    interestedProject: initialProjectName,
    grossIncome: '',
    netIncome: '',
    employmentStatus: 'SWASTA',
    loanCommitments: '',
    firstHomeBuyer: 'YA',
    propertyType: 'TERRACE',
    estimatedBudget: 'RM 300,000 - RM 500,000',
    remarks: '',
    consent: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialProjectName && typeof initialProjectName === 'string') {
      setFormData((prev) => ({ ...prev, interestedProject: initialProjectName }));
    }
  }, [initialProjectName]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setErrorMessage(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrorMessage(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Sila isi nama penuh anda.');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Sila isi nombor telefon anda.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Sila isi alamat emel yang sah.');
      return false;
    }
    if (!formData.preferredArea.trim()) {
      setErrorMessage('Sila pilih atau tulis kawasan pilihan anda.');
      return false;
    }
    if (!formData.consent) {
      setErrorMessage('Sila tanda kotak persetujuan pemprosesan maklumat.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitLead(formData);
      setIsSuccess(true);
      // Reset form fields
      setFormData({
        leadType: 'PROJEK BARU',
        name: '',
        phone: '',
        email: '',
        preferredArea: '',
        interestedProject: '',
        grossIncome: '',
        netIncome: '',
        employmentStatus: 'SWASTA',
        loanCommitments: '',
        firstHomeBuyer: 'YA',
        propertyType: 'TERRACE',
        estimatedBudget: 'RM 300,000 - RM 500,000',
        remarks: '',
        consent: true,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'Maaf, permohonan tidak dapat dihantar sekarang. Sila cuba lagi atau hubungi kami.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-serif font-bold text-white truncate">
                Semak Kelayakan Pinjaman
              </h2>
              <p className="text-xs text-slate-400 truncate">
                Lengkapkan borang berikut untuk semakan kelayakan percuma
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Borang"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Success View */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-white">
                  Permohonan Berjaya Dihantar!
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Terima kasih. Permohonan anda telah berjaya dihantar. Team kami akan hubungi anda untuk langkah seterusnya.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md cursor-pointer"
              >
                Tutup Borang
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Group 1: Category & Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Jenis Hasrat (Lead Type)
                  </label>
                  <select
                    name="leadType"
                    value={formData.leadType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PROJEK BARU">PROJEK BARU</option>
                    <option value="SUBSALE">SUBSALE</option>
                    <option value="RENTAL">RENTAL</option>
                    <option value="LAIN-LAIN">LAIN-LAIN</option>
                  </select>
                  {formData.leadType === 'SUBSALE' && (
                    <p className="mt-1 text-[11px] text-amber-400/90 font-medium">
                      *Nota: Liputan perkhidmatan subsale tertumpu ~10 km dari Shah Alam.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Projek Diminati (Jika Ada)
                  </label>
                  <input
                    type="text"
                    name="interestedProject"
                    placeholder="Contoh: Single Storey Jalan Perak"
                    value={formData.interestedProject}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Group 2: Personal Contact Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Maklumat Diri & Hubungi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama Penuh <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ahmad Bin Abdullah"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nombor Telefon (WhatsApp) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="0123456789"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Alamat Emel <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="ahmad@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kawasan Pilihan <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="preferredArea"
                      placeholder="Shah Alam / Puncak Alam / Klang..."
                      value={formData.preferredArea}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Group 3: Financial & Employment Eligibility */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Maklumat Pendapatan & Kelayakan</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Status Pekerjaan
                    </label>
                    <select
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SWASTA">SWASTA</option>
                      <option value="KERAJAAN">KERAJAAN</option>
                      <option value="SELF-EMPLOYED">SELF-EMPLOYED (BEKERJA SENDIRI)</option>
                      <option value="LAIN-LAIN">LAIN-LAIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pembeli Rumah Pertama?
                    </label>
                    <select
                      name="firstHomeBuyer"
                      value={formData.firstHomeBuyer}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="YA">YA</option>
                      <option value="TIDAK">TIDAK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gaji Kasar Sebulan (Gross)
                    </label>
                    <input
                      type="text"
                      name="grossIncome"
                      placeholder="Contoh: RM 4,500"
                      value={formData.grossIncome}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gaji Bersih Sebulan (Net)
                    </label>
                    <input
                      type="text"
                      name="netIncome"
                      placeholder="Contoh: RM 3,800"
                      value={formData.netIncome}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Komitmen Bulanan (Kereta, PTPTN, Personal Loan)
                    </label>
                    <input
                      type="text"
                      name="loanCommitments"
                      placeholder="Contoh: RM 800"
                      value={formData.loanCommitments}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Anggaran Bajet Harga Rumah
                    </label>
                    <select
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Di bawah RM 300,000">Di bawah RM 300,000</option>
                      <option value="RM 300,000 - RM 500,000">RM 300,000 - RM 500,000</option>
                      <option value="RM 500,000 - RM 700,000">RM 500,000 - RM 700,000</option>
                      <option value="RM 700,000 - RM 1,000,000">RM 700,000 - RM 1,000,000</option>
                      <option value="Atas RM 1,000,000">Atas RM 1,000,000</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Group 4: Property Preference & Remarks */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Jenis Hartanah Diminati
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="CONDO">CONDO</option>
                      <option value="APARTMENT">APARTMENT</option>
                      <option value="TERRACE">TERRACE</option>
                      <option value="SEMI-D">SEMI-D</option>
                      <option value="BUNGALOW">BUNGALOW</option>
                      <option value="LAIN-LAIN">LAIN-LAIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Catatan Tambahan (Remarks)
                    </label>
                    <input
                      type="text"
                      name="remarks"
                      placeholder="Contoh: Mencari rumah sedia diduduki tahun ini..."
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Group 5: Consent Checkbox */}
              <div className="pt-3 border-t border-slate-800/80">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs text-slate-300 leading-normal">
                    Saya bersetuju untuk memberikan maklumat ini kepada Klang Valley Homes untuk tujuan semakan kelayakan dan perkhidmatan hartanah. <span className="text-rose-400">*</span>
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menghantar...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Hantar Permohonan Kelayakan</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
