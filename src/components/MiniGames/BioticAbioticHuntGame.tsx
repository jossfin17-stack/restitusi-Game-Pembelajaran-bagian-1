import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Award, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface EcoCard {
  id: string;
  name: string;
  category: 'biotik' | 'abiotik';
  icon: string;
  detail: string;
}

const ITEMS_POOL: EcoCard[] = [
  { id: '1', name: 'Fitoplankton Autotrof', category: 'biotik', icon: '🦠', detail: 'Produsen mikroskopis di air' },
  { id: '2', name: 'Intensitas Cahaya Matahari', category: 'abiotik', icon: '☀️', detail: 'Sumber energi foton utama' },
  { id: '3', name: 'Bakteri Nitrifikasi', category: 'biotik', icon: '🧫', detail: 'Mikroba tanah pengubah amonia' },
  { id: '4', name: 'Derajat Keasaman (pH) Tanah', category: 'abiotik', icon: '🧪', detail: 'Tingkat asam/basa substrat' },
  { id: '5', name: 'Kadar Oksigen Terlarut (DO)', category: 'abiotik', icon: '💧', detail: 'Kandungan gas O2 perairan' },
  { id: '6', name: 'Cacing Tanah Detritivor', category: 'biotik', icon: '🪱', detail: 'Pemakan sisa bahan organik' },
  { id: '7', name: 'Salinitas Air Laut', category: 'abiotik', icon: '🧂', detail: 'Kadar garam terlarut' },
  { id: '8', name: 'Jamur Truffle Pengurai', category: 'biotik', icon: '🍄', detail: 'Dekomposer materi sisa' },
  { id: '9', name: 'Tekanan Udara & Topografi', category: 'abiotik', icon: '🏔️', detail: 'Ketinggian wilayah & barometer' },
  { id: '10', name: 'Pohon Mangrove Rhizophora', category: 'biotik', icon: '🌱', detail: 'Tumbuhan pesisir berakar tunjang' },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const BioticAbioticHuntGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const currentItem = ITEMS_POOL[currentIndex];

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          soundManager.playVictory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  const handleClassify = (chosenCategory: 'biotik' | 'abiotik') => {
    if (isFinished || !currentItem) return;

    if (chosenCategory === currentItem.category) {
      soundManager.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 30 + newStreak * 5;
      setScore((prev) => prev + points);
      setFeedback({ isCorrect: true, text: `+${points} Poin! Benar: ${currentItem.name} adalah Komponen ${chosenCategory.toUpperCase()}` });
    } else {
      soundManager.playWrong();
      setStreak(0);
      setFeedback({ isCorrect: false, text: `Salah! ${currentItem.name} sebenarnya tergolong Komponen ${currentItem.category.toUpperCase()}` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < ITEMS_POOL.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        soundManager.playVictory();
        confetti({ particleCount: 75, spread: 70 });
      }
    }, 450);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(25);
    setIsFinished(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Mini Game 4: Tebak Biotik vs Abiotik</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Klasifikasikan komponen ekosistem secara cepat dan raih combo beruntun!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full font-mono text-sm font-bold flex items-center gap-1.5 text-amber-300">
            <Timer className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/40 rounded-full font-mono text-emerald-300 font-bold text-sm">
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

      {!isFinished && currentItem ? (
        <div className="text-center">
          {/* Streak pill */}
          {streak > 1 && (
            <div className="inline-block px-3 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-300 font-bold text-xs mb-3 animate-bounce">
              🔥 Combo x{streak} Streak! (+{streak * 5} Bonus)
            </div>
          )}

          {/* Card to Classify */}
          <motion.div
            key={currentItem.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 bg-slate-800/80 border-2 border-slate-700 rounded-3xl mb-6 shadow-xl relative overflow-hidden"
          >
            <div className="text-6xl mb-3">{currentItem.icon}</div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-1">{currentItem.name}</h3>
            <p className="text-xs sm:text-sm text-slate-400">{currentItem.detail}</p>
            <span className="inline-block mt-4 text-xs text-slate-500 font-mono">
              Item {currentIndex + 1} dari {ITEMS_POOL.length}
            </span>
          </motion.div>

          {/* Feedback message */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`text-xs font-bold mb-4 ${feedback.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}
              >
                {feedback.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Classification Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClassify('biotik')}
              className="p-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg shadow-emerald-600/30 flex flex-col items-center justify-center gap-1 border border-emerald-400"
            >
              <span>🌿 BIOTIK</span>
              <span className="text-[11px] font-normal text-emerald-100">(Komponen Hidup)</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleClassify('abiotik')}
              className="p-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-2xl font-bold text-base sm:text-lg text-white shadow-lg shadow-cyan-600/30 flex flex-col items-center justify-center gap-1 border border-cyan-400"
            >
              <span>🏔️ ABIOTIK</span>
              <span className="text-[11px] font-normal text-cyan-100">(Faktor Fisik & Kimia)</span>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gradient-to-br from-emerald-950/90 to-cyan-900/90 border-2 border-emerald-400 rounded-2xl p-6">
          <div className="inline-flex p-3 bg-emerald-500/20 rounded-full mb-3 text-emerald-300">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Klasifikasi Tuntas!</h3>
          <p className="text-sm text-emerald-200 max-w-md mx-auto mb-6">
            Refleks ekologimu tajam dalam membedakan faktor biotik dan abiotik lingkungan!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(score, 50)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Klaim (+{score} XP & +50 Koin)
            </button>
            <button
              onClick={handleRestart}
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
