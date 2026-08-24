import React from 'react';
import { motion } from 'motion/react';
import { Play, Swords, Trophy, Flame, Sparkles, Award, ArrowRight, Heart, Gift, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { GameView, PlayerProfile } from '../types';
import { CHAMPIONS_DATA } from '../data/championsData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onNavigate: (view: GameView) => void;
  onOpenLuckySpin: () => void;
  onOpenDailyReward: () => void;
  onFeedPet: () => void;
}

export const Dashboard: React.FC<Props> = ({
  player,
  onNavigate,
  onOpenLuckySpin,
  onOpenDailyReward,
  onFeedPet,
}) => {
  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> FASE E SMA/SMK MERDEKA
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-mono font-bold flex items-center gap-1 uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {player.streakDays} HARI STREAK
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Selamat Bertanding, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 not-italic">{player.name}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Kuasai konsep <b>Makhluk Hidup & Lingkungannya</b> melalui duel kompetitif, petualangan 6 dunia, dan turnamen sains gaya <b>Clash of Champions</b>!
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('world_map');
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 uppercase tracking-wider transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Mulai Petualangan 6 Dunia</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('duel_mode');
                }}
                className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 border border-white/10 transition-all uppercase tracking-wider"
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>Duel 1v1 Champion</span>
              </button>
            </div>
          </div>

          {/* Player Quick Card / Avatar */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 w-full sm:w-auto sm:min-w-[240px] flex items-center gap-4 shadow-xl">
            <div className="text-4xl p-2.5 bg-slate-800 rounded-2xl border border-emerald-500/30 shadow-inner">
              {player.avatar}
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Champion Status</div>
              <div className="font-extrabold text-sm text-white">{player.equippedTitle || 'Pejuang Biosfer'}</div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5 font-bold">LV. {player.level} • {player.currentXp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Modes Bento Grid */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase flex items-center gap-2">
            <span>Arena & Mode Permainan</span>
          </h2>
          <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">6 Arena Ditemukan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Peta Dunia & Misi */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('world_map');
            }}
            className="group bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-emerald-500 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  DUNIA EKOLOGI
                </span>
                <span className="text-xs text-emerald-400 font-bold font-mono">
                  {player.completedMissionIds.length}/36 SELESAI
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Peta Petualangan 6 Dunia
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Jelajahi Cagar Alam, Sabana, Aliran Energi, Suaka Biodiversitas, Laboratorium Daur, hingga Zona Krisis.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-bold">
              <span>Buka Peta Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 2: Duel 1v1 vs Champion COC */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('duel_mode');
            }}
            className="group bg-slate-900/60 border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  DUEL 1 VS 1
                </span>
                <span className="text-xs text-blue-400 font-bold italic">HEAD TO HEAD</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Arena Duel 1 vs 1 COC
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Tantang AI Champion COC ber-IQ tinggi seperti Sandy (NUS), Axel (NUS), Shakira (UI), dan Maxwell (UNAIR).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-blue-400 font-bold">
              <span>5 Soal Kecepatan Kilat</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 3: Turnamen 10 Champion */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('tournament_mode');
            }}
            className="group bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-cyan-500 transition-all cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  TURNAMEN AKBAR
                </span>
                <span className="text-xs text-cyan-400 font-bold">3 BABAK GUGUR</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Turnamen 10 Champion
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Bertarung bersama 10 siswa terbaik se-Indonesia dalam 3 babak eliminasi memperebutkan Trophy Emas!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cyan-400 font-bold">
              <span>Penyisihan → Semifinal → Final</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 4: 6 Mini Games Hub */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('mini_games');
            }}
            className="group bg-slate-900/60 border border-purple-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  LAB EKOLOGI
                </span>
                <span className="text-xs text-purple-300 font-bold">6 MINI GAMES</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Laboratorium Mini Games
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Ecosystem Builder, Food Chain Race, Biotic Hunt, Save The Forest, dan Puzzle Daur Air & Karbon.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-bold">
              <span>Eksplorasi Praktik Konsep</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 5: Boss Battle Raja Polusi */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('boss_battle');
            }}
            className="group bg-slate-900/60 border border-rose-500/40 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-rose-500 transition-all cursor-pointer shadow-lg shadow-rose-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-rose-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                  FINAL BOSS FIGHT
                </span>
                <span className="text-xs text-rose-400 font-bold font-mono">+500 XP</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                Boss Battle: Raja Polusi
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Lawan The Smog Overlord dalam 5 soal HOTS Time-Attack bertubi-tubi untuk meraih badge eksklusif!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-rose-400 font-bold">
              <span>Tantang Boss Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Card 6: Tantangan Harian (Daily Challenge) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              soundManager.playClick();
              onNavigate('daily_challenge');
            }}
            className="group bg-slate-900/60 border border-amber-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden hover:border-amber-500 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  DAILY MISSION
                </span>
                <span className="text-xs text-amber-400 font-bold">2X REWARD</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Tantangan Harian
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Jawab 5 soal acak setiap hari untuk mempertahankan streak harian dan melipatgandakan koin ekologi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-bold">
              <span>Mainkan Soal Hari Ini</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Arena Banner (Theme Signature Banner) */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <h4 className="text-lg font-bold flex items-center gap-2 text-white">
            <span className="animate-pulse text-xl">🔥</span> ARENA TANTANGAN HARIAN HOTS
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Dapatkan 500 XP dan 100 Koin tambahan dengan menuntaskan 5 soal HOTS berkecepatan tinggi hari ini.
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('daily_challenge');
          }}
          className="bg-white text-slate-950 font-black px-8 py-3 rounded-full hover:scale-105 transition-transform uppercase tracking-tighter text-xs sm:text-sm shadow-xl"
        >
          Mulai Duel Hari Ini
        </button>
      </div>

      {/* Eco-Pet Companion & Champions Spotlight Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Eco-Pet Box */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-1 bg-slate-800 rounded-xl border border-emerald-500/30">{player.pet.avatar}</span>
                <div>
                  <h4 className="font-bold text-sm text-emerald-300">{player.pet.name}</h4>
                  <div className="text-[10px] text-slate-400 font-mono">Level {player.pet.level} • {player.pet.stage}</div>
                </div>
              </div>
              <button
                onClick={onFeedPet}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <Heart className="w-3 h-3 fill-current" />
                <span>Beri Makan (50🪙)</span>
              </button>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5 mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                style={{ width: `${(player.pet.exp / player.pet.maxExp) * 100}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-400 text-right">
              {player.pet.exp}/{player.pet.maxExp} EXP
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Pet Sahabat Ekologi akan berevolusi seiring ketekunanmu menyelesaikan misi pembelajaran IPA!
          </p>
        </div>

        {/* Champions Spotlight */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-white shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-xs text-slate-300 tracking-widest uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Sorotan Champion COC Nasional</span>
            </h4>
            <button
              onClick={() => {
                soundManager.playClick();
                onNavigate('leaderboard');
              }}
              className="text-xs text-emerald-400 hover:underline uppercase tracking-wider font-bold"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CHAMPIONS_DATA.slice(0, 4).map((champ) => (
              <div
                key={champ.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate('duel_mode');
                }}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-white/10 hover:border-emerald-400/50 rounded-xl cursor-pointer transition-all text-center group"
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">{champ.avatar}</div>
                <div className="font-bold text-xs text-white truncate">{champ.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{champ.schoolOrUni}</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 font-bold">IQ {champ.iqScore}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
