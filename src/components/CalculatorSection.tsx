import React, { useState } from 'react';
import { Calculator, DollarSign, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface CalculatorSectionProps {
  onOpenEligibility: (projectName?: string) => void;
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({ onOpenEligibility }) => {
  const [netIncome, setNetIncome] = useState<number>(4500);
  const [monthlyCommitment, setMonthlyCommitment] = useState<number>(800);

  // Calculation Logic:
  // IF net income <= RM5,000 => DSR = 60%, ELSE DSR = 70%
  const dsrLimit = netIncome <= 5000 ? 0.60 : 0.70;

  // Maximum debt allowance = Net Income × DSR
  const maxAllowableCommitment = netIncome * dsrLimit;

  // Available housing commitment = Maximum debt allowance - Existing Monthly Commitments
  const availableForHouseLoan = Math.max(0, maxAllowableCommitment - monthlyCommitment);

  // Estimated House Price = Available Housing Commitment × 200
  const estimatedHousePrice = availableForHouseLoan * 200;

  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Kelayakan Perumahan Klang Valley</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Anggar Kelayakan Pinjaman Rumah Anda
          </h2>
          <p className="text-sm text-slate-300">
            Kira anggaran julat harga rumah dan kelayakan komitmen perumahan bulanan berdasarkan pendapatan bersih dan komitmen anda.
          </p>
        </div>

        {/* Calculator Widget Box */}
        <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Input Controls */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Pendapatan Bersih Sebulan (Net Income):</span>
                <span className="text-amber-400 font-bold text-sm">RM {netIncome.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={1500}
                max={20000}
                step={250}
                value={netIncome}
                onChange={(e) => setNetIncome(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Komitmen Bulanan (Kereta, PTPTN, Kad Kredit, Personal Loan):</span>
                <span className="text-amber-400 font-bold text-sm">RM {monthlyCommitment.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={0}
                max={10000}
                step={100}
                value={monthlyCommitment}
                onChange={(e) => setMonthlyCommitment(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Had Hutang Maksimum ({dsrLimit * 100}% DSR):</span>
                <span className="font-semibold text-amber-400">RM {Math.round(maxAllowableCommitment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Komitmen Rumah Tersedia:</span>
                <span className="font-semibold text-emerald-400">RM {Math.round(availableForHouseLoan).toLocaleString()} / bln</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              * Anggaran kelayakan berdasarkan nisbah DSR (60% bagi pendapatan ≤ RM5,000 dan 70% bagi pendapatan &gt; RM5,000).
            </p>
          </div>

          {/* Right: Calculated Output Box */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest block">
                Hasil Anggaran Kelayakan
              </span>

              <div>
                <span className="text-xs text-slate-400 block">Anggaran Harga Rumah Mampu:</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                  RM {Math.round(estimatedHousePrice).toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Komitmen Mampu:</span>
                  <span className="font-bold text-white text-sm">
                    RM {Math.round(availableForHouseLoan).toLocaleString()} / bln
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Nisbah DSR:</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {(dsrLimit * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <button
                onClick={() => onOpenEligibility(`Gaji Bersih RM${netIncome} - Anggaran Rumah ~RM${Math.round(estimatedHousePrice)}`)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Semak Kelayakan Rasmi Sekarang</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
