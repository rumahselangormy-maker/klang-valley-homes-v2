import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-serif font-bold text-white">Dasar Privasi (Privacy Policy)</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            Di <strong>Klang Valley Homes</strong>, privasi pengunjung dan pelanggan kami adalah keutamaan. Dasar Privasi ini menerangkan bagaimana maklumat anda dikumpul, digunakan dan dilindungi apabila menggunakan borang semakan kelayakan dan perkhidmatan carian hartanah kami.
          </p>

          <h3 className="font-bold text-white text-sm pt-2">1. Pengumpulan Maklumat</h3>
          <p>
            Kami mengumpul maklumat yang anda berikan secara sukarela seperti nama, nombor telefon, alamat emel, anggaran pendapatan dan hasrat lokasi rumah melalui borang &ldquo;Semak Kelayakan Anda&rdquo;.
          </p>

          <h3 className="font-bold text-white text-sm pt-2">2. Penggunaan Maklumat</h3>
          <p>
            Maklumat yang dikumpul hanya digunakan untuk tujuan penilaian kelayakan pinjaman rumah, menghubungi anda bagi temujanji galeri jualan, serta mengesyorkan projek perumahan yang bersesuaian dengan kriteria anda.
          </p>

          <h3 className="font-bold text-white text-sm pt-2">3. Perlindungan Maklumat</h3>
          <p>
            Kami tidak akan menjual, menyewa atau berkongsi maklumat peribadi anda kepada pihak ketiga tanpa persetujuan anda, melainkan dikehendaki oleh undang-undang.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Faham & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
