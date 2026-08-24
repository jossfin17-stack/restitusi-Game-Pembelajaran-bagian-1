import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Flame, School, Globe, Calendar, ArrowLeft, Star, Search } from 'lucide-react';
import { PlayerProfile } from '../types';
import { CHAMPIONS_DATA } from '../data/championsData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onBack: () => void;
}

export const Leaderboard: React.FC<Props> = ({ player, onBack }) => {
  const [tab, setTab] = useState<'national' | 'school' | 'weekly'>('national');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate mock top contenders merged with Player & Champions
  const contenders = [
    {
      id: 'p_you',
      name: player.name + ' (Kamu)',
      school: player.school,
      avatar: player.avatar,
      xp: player.currentXp,
      level: player.level,
      streak: player.streakDays,
      badgeTitle: player.equippedTitle || 'Pejuang Biosfer',
      isPlayer: true,
    },
    ...CHAMPIONS_DATA.map((c, i) => ({
      id: c.id,
      name: c.name,
      school: c.schoolOrUni,
      avatar: c.avatar,
      xp: 4500 - i * 320,
      level: 12 - i,
      streak: 15 - i,
      badgeTitle: c.specialty,
      isPlayer: false,
    })),
    {
      id: 'bot_1',
      name: 'Farhan Dwi Pratama',
      school: 'SMAN 1 Yogyakarta',
      avatar: '🧑‍🔬',
      xp: 1800,
      level: 6,
      streak: 8,
      badgeTitle: 'Pakar Daur Karbon',
      isPlayer: false,
    },
    {
      id: 'bot_2',
      name: 'Nadia Salsabila',
      school: 'SMK Kehutanan Samarinda',
      avatar: '👩‍🌾',
      xp: 1550,
      level: 5,
      streak: 6,
      badgeTitle: 'Ranger Hutan Tropis',
      isPlayer: false,
    },
    {
      id: 'bot_3',
      name: 'Dimas Wicaksono',
      school: 'SMAN 3 Bandung',
      avatar: '🧑‍🚀',
      xp: 1320,
      level: 5,
      streak: 4,
      badgeTitle: 'Analisis Trofik',
      isPlayer: false,
    },
  ].sort((a, b) => b.xp - a.xp);

  const filteredContenders = contenders.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Papan Peringkat Kampiun IPA X</h2>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 pb-4">
        {/* Rank 2 */}
        {contenders[1] && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-end relative h-56 shadow-lg">
            <div className="absolute -top-5 text-2xl p-2 bg-slate-800 rounded-2xl border border-slate-600">
              {contenders[1].avatar}
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-400 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
              2
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full">{contenders[1].name}</h4>
            <div className="text-[10px] text-slate-400 truncate w-full">{contenders[1].school}</div>
            <div className="mt-2 text-xs font-mono font-bold text-cyan-300">{contenders[1].xp} XP</div>
          </div>
        )}

        {/* Rank 1 */}
        {contenders[0] && (
          <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-end relative h-64 shadow-xl shadow-amber-500/20">
            <div className="absolute -top-7 text-3xl p-2.5 bg-amber-500/20 rounded-2xl border border-amber-400 animate-bounce">
              👑 {contenders[0].avatar}
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mb-1">
              1
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-amber-200 truncate w-full">{contenders[0].name}</h4>
            <div className="text-[11px] text-slate-300 truncate w-full">{contenders[0].school}</div>
            <div className="mt-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-mono font-extrabold text-amber-300">
              {contenders[0].xp} XP
            </div>
          </div>
        )}

        {/* Rank 3 */}
        {contenders[2] && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 text-center flex flex-col items-center justify-end relative h-48 shadow-lg">
            <div className="absolute -top-5 text-2xl p-2 bg-slate-800 rounded-2xl border border-slate-600">
              {contenders[2].avatar}
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-bold text-xs flex items-center justify-center mb-1">
              3
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate w-full">{contenders[2].name}</h4>
            <div className="text-[10px] text-slate-400 truncate w-full">{contenders[2].school}</div>
            <div className="mt-2 text-xs font-mono font-bold text-cyan-300">{contenders[2].xp} XP</div>
          </div>
        )}
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setTab('national');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'national' ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Nasional
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTab('school');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'school' ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <School className="w-3.5 h-3.5" /> Antar Sekolah
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setTab('weekly');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'weekly' ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Mingguan
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari siswa atau sekolah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
          />
        </div>
      </div>

      {/* Ranking List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-white shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {filteredContenders.map((item, idx) => {
            const isRank123 = idx < 3;

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  item.isPlayer
                    ? 'bg-cyan-950/60 border-l-4 border-cyan-400'
                    : isRank123
                    ? 'bg-slate-850/50'
                    : 'hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 font-mono font-bold text-xs text-center shrink-0 text-slate-400">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </span>
                  <span className="text-2xl p-1 bg-slate-800 rounded-xl shrink-0">{item.avatar}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-white truncate">{item.name}</span>
                      {item.isPlayer && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500 text-slate-950 font-black rounded">
                          KAMU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{item.school} • Level {item.level}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div className="hidden sm:block">
                    <div className="text-[10px] text-slate-400">Gelar Gelora</div>
                    <div className="text-xs font-semibold text-cyan-300">{item.badgeTitle}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black font-mono text-amber-400">{item.xp} XP</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                      <Flame className="w-3 h-3 text-orange-400" /> {item.streak} Hari
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
