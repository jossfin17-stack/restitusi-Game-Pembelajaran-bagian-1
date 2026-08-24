import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, X, Gift, RotateCcw, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRewardWon: (reward: { type: 'xp' | 'coins' | 'energy'; amount: number; label: string }) => void;
}

const SPIN_SLICES = [
  { label: '+50 XP', type: 'xp' as const, amount: 50, color: '#06b6d4', icon: '⚡' },
  { label: '+100 Koin', type: 'coins' as const, amount: 100, color: '#f59e0b', icon: '🪙' },
  { label: '+150 XP', type: 'xp' as const, amount: 150, color: '#10b981', icon: '🌟' },
  { label: '+50 Koin', type: 'coins' as const, amount: 50, color: '#8b5cf6', icon: '💎' },
  { label: '+200 XP Grand', type: 'xp' as const, amount: 200, color: '#ec4899', icon: '👑' },
  { label: '+150 Koin', type: 'coins' as const, amount: 150, color: '#f97316', icon: '💰' },
];

export const LuckySpinModal: React.FC<Props> = ({ isOpen, onClose, onRewardWon }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<typeof SPIN_SLICES[0] | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWonReward(null);
    soundManager.playClick();

    // Random target slice
    const sliceIndex = Math.floor(Math.random() * SPIN_SLICES.length);
    const sliceAngle = 360 / SPIN_SLICES.length;
    const randomExtraSpins = 360 * 5; // 5 full rotations
    const targetRotation = rotation + randomExtraSpins + sliceIndex * sliceAngle + sliceAngle / 2;

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const chosen = SPIN_SLICES[SPIN_SLICES.length - 1 - sliceIndex] || SPIN_SLICES[0];
      setWonReward(chosen);
      soundManager.playVictory();
      confetti({ particleCount: 80, spread: 70 });
      onRewardWon(chosen);
    }, 3800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full text-white shadow-2xl relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 bg-amber-500/20 rounded-full mb-2 text-amber-400">
          <Gift className="w-8 h-8" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-amber-300">Lucky Spin Harian</h3>
        <p className="text-xs text-slate-400 mb-6">Putar roda keberuntungan dan menangkan bonus ekstra!</p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
          {/* Wheel Indicator Pointer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-amber-400 drop-shadow-md" />

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl relative overflow-hidden transition-transform duration-[3800ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              {SPIN_SLICES.map((slice, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center p-2 text-xs font-bold text-slate-950 font-mono"
                  style={{ backgroundColor: slice.color }}
                >
                  <div className="text-center">
                    <div className="text-base">{slice.icon}</div>
                    <div className="text-[10px] uppercase font-black">{slice.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Hub */}
          <div className="absolute w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center z-10 font-bold text-amber-300 shadow-md">
            ⭐
          </div>
        </div>

        {/* Reward Result Banner */}
        {wonReward && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="p-3 bg-amber-500/20 border border-amber-400 rounded-xl mb-4 text-xs font-bold text-amber-200"
          >
            🎉 Selamat! Kamu mendapatkan: <b className="text-white text-sm">{wonReward.label}</b>
          </motion.div>
        )}

        <button
          disabled={isSpinning}
          onClick={handleSpin}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSpinning ? 'Sedang Memutar...' : 'Putar Roda Harian 🎲'}</span>
        </button>
      </motion.div>
    </div>
  );
};
