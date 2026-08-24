import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Lock, CheckCircle2, ArrowLeft, Sparkles, Filter } from 'lucide-react';
import { Badge, PlayerProfile } from '../types';
import { BADGES_DATA } from '../data/badgesData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onEquipTitle: (title: string) => void;
  onBack: () => void;
}

export const BadgesView: React.FC<Props> = ({ player, onEquipTitle, onBack }) => {
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  const filteredBadges = BADGES_DATA.filter(
    (b) => selectedRarity === 'all' || b.rarity.toLowerCase() === selectedRarity.toLowerCase()
  );

  const getRarityBadgeStyle = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-slate-900/80 border-amber-400 text-amber-300 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10';
      case 'Epic':
        return 'bg-slate-900/80 border-purple-400 text-purple-300 ring-1 ring-purple-400/30 shadow-lg shadow-purple-500/10';
      case 'Rare':
        return 'bg-slate-900/80 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10';
      default:
        return 'bg-slate-900/80 border-white/10 text-slate-300';
    }
  };

  const unlockedBadgeIds = player.unlockedBadgeIds || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 border border-white/10 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">Galeri Badge & Gelar Ekologi</h2>
        </div>
      </div>

      {/* Rarity Filter Pills */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex flex-wrap gap-2">
          {['all', 'Legendary', 'Epic', 'Rare', 'Common'].map((r) => (
            <button
              key={r}
              onClick={() => {
                soundManager.playClick();
                setSelectedRarity(r);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedRarity.toLowerCase() === r.toLowerCase()
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {r === 'all' ? 'Semua Badge' : r}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-slate-400 font-bold">
          KOLEKSI TERBUKA: <b className="text-emerald-400">{unlockedBadgeIds.length}</b> / {BADGES_DATA.length}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const isEquipped = player.equippedTitle === badge.name;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                soundManager.playClick();
                setActiveBadge(badge);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between backdrop-blur-md relative overflow-hidden ${
                isUnlocked
                  ? getRarityBadgeStyle(badge.rarity)
                  : 'bg-slate-900/40 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl p-2.5 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
                    🎖️
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-slate-950/80 border border-white/10">
                      {badge.rarity}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terbuka
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{badge.name}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-amber-300 font-mono font-bold">{badge.category.toUpperCase()}</span>
                {isUnlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      onEquipTitle(badge.name);
                    }}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wider ${
                      isEquipped
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-white/10'
                    }`}
                  >
                    {isEquipped ? 'Dipakai ✓' : 'Pasang Gelar'}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
