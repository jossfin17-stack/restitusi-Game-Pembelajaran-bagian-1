import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Award, Flame, Heart, Sparkles, ArrowLeft, Edit3, Check, BookOpen, Star, Zap } from 'lucide-react';
import { PlayerProfile } from '../types';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onUpdateProfile: (name: string, school: string, avatar: string) => void;
  onFeedPet: () => void;
  onBack: () => void;
}

const AVAILABLE_AVATARS = ['🧑‍🎓', '👩‍🎓', '🧑‍🔬', '👩‍🔬', '🧑‍🚀', '👩‍🚀', '🧑‍🌾', '👩‍🌾', '🦊', '🦅', '🐬', '🐯'];

export const ProfileView: React.FC<Props> = ({ player, onUpdateProfile, onFeedPet, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const [school, setSchool] = useState(player.school);
  const [avatar, setAvatar] = useState(player.avatar);

  const handleSave = () => {
    soundManager.playClick();
    onUpdateProfile(name, school, avatar);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Profil Kampiun & Statistik Belajar</h2>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="text-5xl sm:text-6xl p-3 bg-slate-800 rounded-3xl border-2 border-cyan-400 shadow-xl shadow-cyan-500/20">
                {avatar}
              </div>
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 bg-cyan-500 text-slate-950 font-black text-xs rounded-full font-mono">
                Lv {player.level}
              </span>
            </div>

            <div>
              {!isEditing ? (
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{player.name}</h3>
                  <div className="text-xs text-cyan-400 font-medium">{player.school}</div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-semibold text-amber-300">
                    <Award className="w-3.5 h-3.5" />
                    <span>Gelar: {player.equippedTitle || 'Kampiun Muda Fase E'}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Siswa"
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white w-full"
                  />
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Nama Sekolah SMA/SMK"
                    className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profil
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Check className="w-3.5 h-3.5" /> Simpan
              </button>
            )}
          </div>
        </div>

        {/* Avatar Picker when editing */}
        {isEditing && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400 font-semibold mb-2">Pilih Avatar Baru:</div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`text-2xl p-2 rounded-xl border transition-all ${
                    avatar === av ? 'bg-cyan-500/20 border-cyan-400 scale-110' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Key Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-mono">Total XP</div>
            <div className="text-lg font-black text-cyan-400">{player.currentXp} XP</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-mono">Koin Ekologi</div>
            <div className="text-lg font-black text-amber-400">{player.coins} Koin</div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-mono">Streak Belajar</div>
            <div className="text-lg font-black text-orange-400 flex items-center gap-1">
              <Flame className="w-4 h-4" /> {player.streakDays} Hari
            </div>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/80">
            <div className="text-[11px] text-slate-400 font-mono">Misi Dituntaskan</div>
            <div className="text-lg font-black text-emerald-400">{player.completedMissionIds.length} / 36</div>
          </div>
        </div>
      </div>

      {/* Eco-Pet Companion Widget */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2.5 bg-slate-950/80 rounded-2xl border border-emerald-500/40">
              🦜
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base sm:text-lg text-emerald-300">{player.pet.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-emerald-300 rounded border border-emerald-600">
                  Level {player.pet.level}
                </span>
              </div>
              <p className="text-xs text-slate-400">Pet Sahabat Ekologimu — Tumbuh seiring ketekunan belajarmu!</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playLevelUp();
              onFeedPet();
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Beri Makan (50 Koin)</span>
          </button>
        </div>

        {/* Pet EXP Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>EXP Pet:</span>
            <span>{player.pet.exp} / {player.pet.maxExp} EXP</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
              style={{ width: `${Math.min(100, (player.pet.exp / player.pet.maxExp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Topic Mastery Progress List (16 Curriculum Topics) */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-base text-white flex items-center gap-2 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Penguasaan Materi IPA Fase E (16 Topik)</span>
          </h4>
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">Statistik Belajar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(player.topicStats || {}).map(([topicName, stats]: [string, { total: number; correct: number }]) => {
            const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

            return (
              <div key={topicName} className="p-3 bg-slate-950/60 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200 truncate">{topicName}</span>
                  <span className="font-mono font-bold text-cyan-300 shrink-0">{pct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      pct >= 80 ? 'bg-emerald-400' : pct >= 50 ? 'bg-cyan-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
