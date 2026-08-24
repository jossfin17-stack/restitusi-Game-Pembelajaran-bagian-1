import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Gift, X, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile } from '../types';
import { soundManager } from '../utils/soundEffects';

interface Props {
  isOpen: boolean;
  player: PlayerProfile;
  onClose: () => void;
  onClaimDaily: (day: number, xpReward: number, coinReward: number) => void;
}

const STREAK_DAYS = [
  { day: 1, xp: 50, coins: 30, icon: '🌱' },
  { day: 2, xp: 80, coins: 50, icon: '🌿' },
  { day: 3, xp: 120, coins: 70, icon: '🌲' },
  { day: 4, xp: 160, coins: 90, icon: '🛡️' },
  { day: 5, xp: 200, coins: 120, icon: '💎' },
  { day: 6, xp: 250, coins: 150, icon: '⚡' },
  { day: 7, xp: 400, coins: 300, icon: '👑' },
];

export const DailyRewardModal: React.FC<Props> = ({ isOpen, player, onClose, onClaimDaily }) => {
  if (!isOpen) return null;

  const currentStreakDay = ((player.streakDays - 1) % 7) + 1;

  const handleClaim = (day: number, xp: number, coins: number) => {
    soundManager.playVictory();
    confetti({ particleCount: 90, spread: 70 });
    onClaimDaily(day, xp, coins);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full font-mono text-xs font-bold mb-2">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Streak Belajar: {player.streakDays} Hari Berturut-turut</span>
          </div>
          <h3 className="text-2xl font-black text-white">Kalender Hadiah Login 7 Hari</h3>
          <p className="text-xs text-slate-400">Masuk setiap hari untuk melipatgandakan XP dan Koin Ekologi!</p>
        </div>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {STREAK_DAYS.map((item) => {
            const isToday = item.day === currentStreakDay;
            const isClaimed = item.day < currentStreakDay;
            const isDay7 = item.day === 7;

            return (
              <div
                key={item.day}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                  isDay7 ? 'col-span-2 sm:col-span-2 bg-gradient-to-br from-amber-950/80 to-slate-900 border-amber-400' : ''
                } ${
                  isToday
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/60 shadow-lg'
                    : isClaimed
                    ? 'bg-slate-800/50 border-slate-800 opacity-60'
                    : 'bg-slate-850 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-bold font-mono text-slate-400">Hari ke-{item.day}</div>
                <div className="text-3xl my-1">{item.icon}</div>
                <div>
                  <div className="text-xs font-bold text-cyan-300">+{item.xp} XP</div>
                  <div className="text-[11px] font-mono text-amber-300">+{item.coins} Koin</div>
                </div>

                <div className="mt-2 w-full">
                  {isClaimed ? (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Diklaim
                    </span>
                  ) : isToday ? (
                    <button
                      onClick={() => handleClaim(item.day, item.xp, item.coins)}
                      className="w-full py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs shadow transition-all"
                    >
                      Klaim ✨
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Belum Buka</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-xs text-slate-400">
          Streak akan di-reset jika tidak login selama 48 jam.
        </div>
      </motion.div>
    </div>
  );
};
