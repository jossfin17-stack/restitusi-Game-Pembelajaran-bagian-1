import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trees, Compass, Workflow, ShieldCheck, FlaskConical, Crown, Star, Lock, Play, Flame, ArrowLeft } from 'lucide-react';
import { World, Mission, PlayerProfile } from '../types';
import { WORLDS_DATA } from '../data/worldsData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onSelectMission: (mission: Mission) => void;
  onSelectBossBattle: () => void;
  onBack: () => void;
}

export const WorldMap: React.FC<Props> = ({ player, onSelectMission, onSelectBossBattle, onBack }) => {
  const [activeWorldId, setActiveWorldId] = useState<number>(player.unlockedWorldId || 1);

  const activeWorld = WORLDS_DATA.find((w) => w.id === activeWorldId) || WORLDS_DATA[0];

  const getWorldIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Trees':
        return <Trees className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Workflow':
        return <Workflow className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      default:
        return <Trees className={className} />;
    }
  };

  const handleSelectWorld = (worldId: number) => {
    soundManager.playClick();
    setActiveWorldId(worldId);
  };

  const handleStartMission = (mission: Mission) => {
    soundManager.playClick();
    if (mission.isBossMission && mission.id === 'w6_m6') {
      onSelectBossBattle();
    } else {
      onSelectMission(mission);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 border border-white/10 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>TOTAL XP: <b className="text-emerald-400">{player.currentXp}</b></span>
          <span>•</span>
          <span>MISI SELESAI: <b className="text-emerald-400">{player.completedMissionIds.length}/36</b></span>
        </div>
      </div>

      {/* World Tabs Selector (6 Worlds) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {WORLDS_DATA.map((world) => {
          const isSelected = activeWorldId === world.id;
          const isUnlocked = player.currentXp >= (world.missions[0]?.xpRequiredToUnlock || 0) || player.unlockedWorldId >= world.id;
          const completedInThis = world.missions.filter((m) => player.completedMissionIds.includes(m.id)).length;

          return (
            <motion.button
              key={world.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectWorld(world.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[95px] ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/20'
                  : isUnlocked
                  ? 'bg-slate-900/60 border-white/10 hover:border-emerald-500/50'
                  : 'bg-slate-950/60 border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-slate-300'}`}>
                  {getWorldIcon(world.iconName, 'w-4 h-4')}
                </div>
                {!isUnlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                ) : (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {completedInThis}/{world.missions.length}
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-white truncate">Dunia {world.id}</div>
                <div className="text-[10px] text-slate-400 truncate">{world.subtitle}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active World Banner & Details */}
      <motion.div
        key={activeWorld.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-white backdrop-blur-md"
        style={{ background: activeWorld.backgroundImage }}
      >
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-black/50 border border-white/20 rounded-full text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                Tingkat Kesulitan: {activeWorld.difficultyLabel}
              </span>
              {activeWorld.id === 6 && (
                <span className="px-3 py-1 bg-rose-950/80 border border-rose-500 text-rose-300 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" /> Boss Arena
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-white">{activeWorld.name}</h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              {activeWorld.description}
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 border border-white/10 rounded-2xl text-xs space-y-1.5 backdrop-blur-md">
            <div className="font-bold text-emerald-400 tracking-wider uppercase mb-1">Materi Utama:</div>
            {activeWorld.topicsCovered.map((topic, i) => (
              <div key={i} className="text-slate-300 flex items-center gap-1.5">
                <span className="text-emerald-400">•</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Missions Grid on World Map */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <h3 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase flex items-center gap-2">
            <span>Daftar Misi {activeWorld.name}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">6 MISI INTERAKTIF</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeWorld.missions.map((mission) => {
            const isCompleted = player.completedMissionIds.includes(mission.id);
            const isLocked = player.currentXp < mission.xpRequiredToUnlock;
            const starsEarned = player.missionStars[mission.id] || 0;

            return (
              <motion.div
                key={mission.id}
                whileHover={!isLocked ? { scale: 1.02 } : {}}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-sm ${
                  isLocked
                    ? 'bg-slate-900/40 border-white/5 opacity-50'
                    : isCompleted
                    ? 'bg-slate-900/70 border-emerald-500/40 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/70 border-cyan-500/40 shadow-md shadow-cyan-500/10'
                }`}
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-white/10 uppercase tracking-wider">
                      Misi {mission.missionNumber}
                    </span>

                    {/* Stars */}
                    {isCompleted && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              starIdx <= starsEarned
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700 fill-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {isLocked && (
                      <span className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Butuh {mission.xpRequiredToUnlock} XP
                      </span>
                    )}

                    {mission.isBossMission && (
                      <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-600 rounded font-bold uppercase tracking-wider animate-pulse">
                        ☠️ BOSS
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-sm sm:text-base leading-snug mb-1">
                    {mission.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {mission.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[11px] text-amber-400 font-mono font-bold">
                    +{mission.questions[0]?.xpReward || 50} XP
                  </div>

                  <button
                    disabled={isLocked}
                    onClick={() => handleStartMission(mission)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow ${
                      isLocked
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : mission.isBossMission
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : isCompleted
                        ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/25'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Main Lagi' : 'Mulai Misi'}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
