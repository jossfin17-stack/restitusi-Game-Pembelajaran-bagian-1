import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award, ShoppingBag, Swords, User, Volume2, VolumeX, Sparkles, Gift, Flame, Zap, Coins } from 'lucide-react';
import { GameView, PlayerProfile } from '../types';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  currentView: GameView;
  isMuted: boolean;
  onNavigate: (view: GameView) => void;
  onToggleMute: () => void;
  onOpenLuckySpin: () => void;
  onOpenDailyReward: () => void;
}

export const Navbar: React.FC<Props> = ({
  player,
  currentView,
  isMuted,
  onNavigate,
  onToggleMute,
  onOpenLuckySpin,
  onOpenDailyReward,
}) => {
  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white shadow-xl shadow-slate-950/50">
      {/* Top Status Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand & Champion Level */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigate('dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full border-2 border-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-xs text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              {player.avatar || '🌱'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase flex items-center gap-1.5">
              <span>CLASH OF ECOLOGY</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                FASE E
              </span>
            </div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="group-hover:text-emerald-300 transition-colors">{player.name}</span>
              <span className="text-emerald-400 font-mono text-xs">• LV. {player.level}</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar Center */}
        <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-md mx-6 flex-col">
          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase tracking-widest font-mono">
            <span>XP: {player.currentXp} / {player.nextLevelXp}</span>
            <span className="text-emerald-400">{player.nextLevelXp - player.currentXp} XP to Next</span>
          </div>
          <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Currency & Stats Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Energy */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full border border-white/10 text-blue-400">
            <Zap className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
            <span className="font-mono font-bold text-white text-xs">{player.energy}/100</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/50 rounded-full border border-white/10 text-yellow-400">
            <span className="text-sm leading-none">🪙</span>
            <span className="font-mono font-bold text-white text-xs">{player.coins.toLocaleString('id-ID')}</span>
          </div>

          {/* Daily Spin Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLuckySpin();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-full font-bold transition-all text-xs"
            title="Lucky Spin"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Spin</span>
          </button>

          {/* Daily Streak Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDailyReward();
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            title="Daily Streak Reward"
          >
            <Flame className="w-3.5 h-3.5 fill-slate-950" />
            <span>{player.streakDays}D REWARD</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMute();
            }}
            className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-white/10 transition-colors"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-white/5">
        <nav className="flex items-center gap-1.5 py-2 min-w-max">
          {[
            { id: 'dashboard' as GameView, label: 'Beranda', icon: Sparkles },
            { id: 'world_map' as GameView, label: 'Peta 6 Dunia', icon: Zap },
            { id: 'mini_games' as GameView, label: '6 Mini Games', icon: Award },
            { id: 'duel_mode' as GameView, label: 'Duel 1v1 Champion', icon: Swords },
            { id: 'tournament_mode' as GameView, label: 'Turnamen 10 COC', icon: Trophy },
            { id: 'boss_battle' as GameView, label: 'Boss Battle', icon: Flame },
            { id: 'leaderboard' as GameView, label: 'Peringkat', icon: Trophy },
            { id: 'badges' as GameView, label: 'Badge & Gelar', icon: Award },
            { id: 'shop' as GameView, label: 'Toko Ekologi', icon: ShoppingBag },
            { id: 'profile' as GameView, label: 'Profil Saya', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  onNavigate(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
