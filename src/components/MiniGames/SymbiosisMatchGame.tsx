import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface SymbiosisCase {
  id: string;
  organism1: string;
  organism2: string;
  icon1: string;
  icon2: string;
  correctType: 'Mutualisme (+/+)' | 'Komensalisme (+/0)' | 'Parasitisme (+/-)' | 'Amensalisme (-/0)';
  explanation: string;
}

const CASES: SymbiosisCase[] = [
  {
    id: 'c1',
    organism1: 'Mikoriza (Jamur Akar)',
    organism2: 'Akar Pohon Pinus',
    icon1: '🍄',
    icon2: '🌲',
    correctType: 'Mutualisme (+/+)',
    explanation: 'Jamur membantu menyerap air dan mineral fosfor dari tanah, sedangkan akar pinus memberi hasil fotosintesis (gula) ke jamur.',
  },
  {
    id: 'c2',
    organism1: 'Bunga Anggrek Bulan',
    organism2: 'Batang Pohon Mangga',
    icon1: '🌸',
    icon2: '🌳',
    correctType: 'Komensalisme (+/0)',
    explanation: 'Anggrek menempel untuk mendapatkan cahaya matahari tanpa mengambil sari makanan dari pohon inang (epifit non-parasit).',
  },
  {
    id: 'c3',
    organism1: 'Cacing Pita (Taenia solium)',
    organism2: 'Saluran Pencernaan Babi/Manusia',
    icon1: '🪱',
    icon2: '🧍',
    correctType: 'Parasitisme (+/-)',
    explanation: 'Cacing pita menyerap sari nutrisi makanan inang dan menyebabkan inang mengalami malnutrisi dan anemia.',
  },
  {
    id: 'c4',
    organism1: 'Jamur Penicillium notatum',
    organism2: 'Koloni Bakteri Staphylococcus',
    icon1: '🧫',
    icon2: '🦠',
    correctType: 'Amensalisme (-/0)',
    explanation: 'Jamur mengeluarkan zat antibiotik penisilin yang menghambat dinding sel bakteri tanpa dirugikan maupun diuntungkan secara langsung.',
  },
  {
    id: 'c5',
    organism1: 'Burung Jalak',
    organism2: 'Kerbau Liar',
    icon1: '🐦',
    icon2: '🐃',
    correctType: 'Mutualisme (+/+)',
    explanation: 'Burung jalak kenyang memakan kutu di punggung kerbau, sementara kerbau terbebas dari gatal parasit kutu.',
  },
  {
    id: 'c6',
    organism1: 'Tali Putri (Cuscuta sp.)',
    organism2: 'Tanaman Pagar Inang',
    icon1: '🌿',
    icon2: '🌱',
    correctType: 'Parasitisme (+/-)',
    explanation: 'Tali putri tidak memiliki klorofil dan menusukkan akar haustorium langsung ke pembuluh floem inang untuk mencuri hasil fotosintesis.',
  },
];

const TYPES = [
  { name: 'Mutualisme (+/+)', color: 'border-emerald-500 bg-emerald-950/60 text-emerald-300', desc: 'Kedua pihak saling menguntungkan' },
  { name: 'Komensalisme (+/0)', color: 'border-cyan-500 bg-cyan-950/60 text-cyan-300', desc: 'Satu untung, satu tidak terpengaruh' },
  { name: 'Parasitisme (+/-)', color: 'border-rose-500 bg-rose-950/60 text-rose-300', desc: 'Satu untung, satu dirugikan' },
  { name: 'Amensalisme (-/0)', color: 'border-purple-500 bg-purple-950/60 text-purple-300', desc: 'Satu dirugikan/dihambat, satu netral' },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const SymbiosisMatchGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentCase = CASES[currentIdx];

  const handleSelectType = (selectedType: string) => {
    if (feedback) return; // Prevent double click

    if (selectedType === currentCase.correctType) {
      soundManager.playCorrect();
      setScore((prev) => prev + 50);
      setFeedback({
        isCorrect: true,
        text: `Benar! ${currentCase.explanation}`,
      });
    } else {
      soundManager.playWrong();
      setFeedback({
        isCorrect: false,
        text: `Salah. Yang benar adalah ${currentCase.correctType}. ${currentCase.explanation}`,
      });
    }
  };

  const handleNextCase = () => {
    soundManager.playClick();
    setFeedback(null);
    if (currentIdx + 1 < CASES.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-purple-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <h2 className="text-xl sm:text-2xl font-bold text-purple-400">Mini Game 3: Cocokkan Simbiosis</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Analisis interaksi antara dua organisme dan tentukan jenis simbiosisnya!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-purple-950/70 border border-purple-500/40 rounded-full font-mono text-purple-300 font-bold text-sm">
            Skor: {score}
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Kembali
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span>Studi Kasus Simbiosis {currentIdx + 1} dari {CASES.length}</span>
            <span className="font-mono">{Math.round(((currentIdx + 1) / CASES.length) * 100)}%</span>
          </div>

          {/* Organisms Pairing Display */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 min-w-[130px] sm:min-w-[170px]">
                <div className="text-4xl sm:text-5xl mb-2">{currentCase.icon1}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{currentCase.organism1}</div>
              </div>

              <div className="text-2xl sm:text-3xl text-purple-400 font-bold animate-pulse">⚡ vs ⚡</div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-700 min-w-[130px] sm:min-w-[170px]">
                <div className="text-4xl sm:text-5xl mb-2">{currentCase.icon2}</div>
                <div className="text-xs sm:text-sm font-bold text-white">{currentCase.organism2}</div>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 italic">
              Apakah hubungan interaksi ekologis antara kedua organisme di atas?
            </div>
          </div>

          {/* Feedback Area */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl mb-4 border ${
                  feedback.isCorrect ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-rose-950/80 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">{feedback.isCorrect ? '✨ Luar Biasa!' : '⚠️ Pembahasan:'}</span>{' '}
                    {feedback.text}
                  </div>
                  <button
                    onClick={handleNextCase}
                    className="px-4 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold shrink-0 shadow"
                  >
                    Lanjut 👉
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TYPES.map((type) => (
              <motion.button
                key={type.name}
                disabled={!!feedback}
                whileHover={!feedback ? { scale: 1.02 } : {}}
                whileTap={!feedback ? { scale: 0.98 } : {}}
                onClick={() => handleSelectType(type.name)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${type.color} ${
                  feedback ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                }`}
              >
                <div className="font-bold text-sm sm:text-base">{type.name}</div>
                <div className="text-xs text-slate-400 mt-1">{type.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gradient-to-br from-purple-950/90 to-indigo-900/90 border-2 border-purple-400 rounded-2xl p-6">
          <div className="inline-flex p-3 bg-purple-500/20 rounded-full mb-3 text-purple-300">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Pakar Simbiosis Ekologi!</h3>
          <p className="text-sm text-purple-200 max-w-md mx-auto mb-6">
            Kamu berhasil menyelesaikan seluruh tes identifikasi hubungan simbiosis organisme Nusantara!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(score, 60)}
              className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-purple-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Klaim Hadiah (+{score} XP & +60 Koin)
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
