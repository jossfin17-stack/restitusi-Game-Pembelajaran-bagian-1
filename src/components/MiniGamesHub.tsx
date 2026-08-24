import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Flame, Shield, ArrowRight, Award, RotateCcw } from 'lucide-react';
import { GameView } from '../types';
import { soundManager } from '../utils/soundEffects';

interface Props {
  onSelectMiniGame: (gameId: 'game_ecosystem' | 'game_foodchain' | 'game_hunt' | 'game_forest' | 'game_puzzle' | 'boss_battle') => void;
}

const MINI_GAMES_LIST = [
  {
    id: 'game_ecosystem' as const,
    title: '1. Ecosystem Builder',
    subtitle: 'Rakit Ekosistem Hutan Seimbang',
    desc: 'Tempatkan produsen, herbivora, karnivora, dan dekomposer untuk mencapai Biomassa Seimbang & Stabilitas Trofik 100%.',
    icon: '🌱',
    color: 'from-emerald-950 to-green-900 border-emerald-500/50',
    difficulty: 'Mudah - Menengah',
    reward: '+100 XP & +50 Koin',
  },
  {
    id: 'game_foodchain' as const,
    title: '2. Food Chain & Web Race',
    subtitle: 'Balap Kecepatan Rantai Makanan',
    desc: 'Susun tingkat trofik (Produsen → Herbivora → Karnivora → Apex) dan perhitungkan hukum aliran energi 10% Lindeman!',
    icon: '⚡',
    color: 'from-cyan-950 to-blue-900 border-cyan-500/50',
    difficulty: 'Menengah',
    reward: '+100 XP & +60 Koin',
  },
  {
    id: 'game_hunt' as const,
    title: '3. Biotic & Abiotic Hunt',
    subtitle: 'Perburuan Komponen Ekosistem',
    desc: 'Tembak dan klasifikasikan 12 elemen biotik dan abiotik dalam waktu 20 detik berkecepatan tinggi.',
    icon: '🎯',
    color: 'from-purple-950 to-indigo-900 border-purple-500/50',
    difficulty: 'Kecepatan Refleks',
    reward: '+120 XP & +50 Koin',
  },
  {
    id: 'game_forest' as const,
    title: '4. Save The Forest',
    subtitle: 'Simulasi Strategi Konservasi Hutan',
    desc: 'Atasi krisis kebakaran gambut, pembalakan liar, perburuan satwa, dan pencemaran sungai dengan kebijakan ekologi presisi.',
    icon: '🌲',
    color: 'from-teal-950 to-emerald-900 border-teal-500/50',
    difficulty: 'HOTS Analisis',
    reward: '+150 XP & +70 Koin',
  },
  {
    id: 'game_puzzle' as const,
    title: '5. Puzzle Daur Biogeokimia',
    subtitle: 'Rekonstruksi Siklus Air & Karbon',
    desc: 'Susun potongan tahapan evaporasi, kondensasi, presipitasi, fiksasi CO2 fotosintesis, respirasi, dan sedimentasi secara runtut.',
    icon: '🔄',
    color: 'from-blue-950 to-cyan-900 border-blue-500/50',
    difficulty: 'Logika Runtun',
    reward: '+150 XP & +70 Koin',
  },
  {
    id: 'boss_battle' as const,
    title: '6. Boss Battle: Raja Polusi',
    subtitle: 'Pertarungan Terakhir Penyelamatan Biosfer',
    desc: 'Lawan The Smog Overlord dalam 5 soal HOTS Time-Attack bertubi-tubi untuk mendapatkan Exclusive Legendary Badge!',
    icon: '☠️',
    color: 'from-rose-950 to-red-900 border-rose-500/60 ring-1 ring-rose-500/40',
    difficulty: 'Sangat Sulit (Boss)',
    reward: '+500 XP & Badge Eksklusif',
  },
];

export const MiniGamesHub: React.FC<Props> = ({ onSelectMiniGame }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
            🎮 6 MINI GAMES INTERAKTIF
          </span>
          <h2 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Laboratorium Game Edukasi IPA Fase E
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            Eksplorasi konsep ekologi, rantai makanan, keanekaragaman hayati, dan daur biogeokimia melalui 6 mini games interaktif bergaya arena kompetitif!
          </p>
        </div>
      </div>

      {/* Mini Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MINI_GAMES_LIST.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border bg-gradient-to-b ${game.color} text-white flex flex-col justify-between shadow-xl backdrop-blur-md relative overflow-hidden`}
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 blur-xl pointer-events-none" />
            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl p-2.5 bg-slate-950/80 rounded-2xl border border-white/10 shadow-inner">
                  {game.icon}
                </span>
                <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-slate-950/80 border border-white/10 font-bold text-slate-300">
                  {game.difficulty}
                </span>
              </div>

              <h3 className="font-extrabold text-lg text-white leading-snug">{game.title}</h3>
              <div className="text-xs text-emerald-300 font-semibold mb-2">{game.subtitle}</div>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{game.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">{game.reward}</span>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onSelectMiniGame(game.id);
                }}
                className="px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-black uppercase tracking-wider rounded-xl text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
              >
                <span>Mainkan</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
