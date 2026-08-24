import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, RotateCcw, Award, Info, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface OrganismItem {
  id: string;
  name: string;
  icon: string;
  habitat: 'hutan' | 'karang' | 'mangrove' | 'tundra';
  description: string;
}

const ALL_ORGANISMS: OrganismItem[] = [
  { id: 'org1', name: 'Orangutan & Anggrek', icon: '🦧', habitat: 'hutan', description: 'Hewan arboreal dan epifit kanopi tinggi' },
  { id: 'org2', name: 'Ikan Badut & Anemon', icon: '🐠', habitat: 'karang', description: 'Biota perairan laut tropis jernih' },
  { id: 'org3', name: 'Kepiting Bakau & Pohon Rhizophora', icon: '🦀', habitat: 'mangrove', description: 'Adaptasi akar napas di zona pasang surut' },
  { id: 'org4', name: 'Beruang Kutub & Lumut Kerak', icon: '🐻‍❄️', habitat: 'tundra', description: 'Adaptasi lemak tebal di tanah beku permafrost' },
  { id: 'org5', name: 'Burung Rangkong Badak', icon: '🦜', habitat: 'hutan', description: 'Penyebar biji pohon kanopi hutan primer' },
  { id: 'org6', name: 'Terumbu Karang Acropora', icon: '🪸', habitat: 'karang', description: 'Koloni polip bersimbiosis dengan alga zooxanthellae' },
  { id: 'org7', name: 'Ikan Gelodok (Mudskipper)', icon: '🐟', habitat: 'mangrove', description: 'Ikan amfibi yang merayap di lumpur akar bakau' },
  { id: 'org8', name: 'Rubah Arktik', icon: '🦊', habitat: 'tundra', description: 'Bulu putih kamuflase di padang salju dingin' },
];

const HABITATS = [
  { id: 'hutan', name: 'Hutan Hujan Tropis', color: 'from-emerald-900 to-green-900', border: 'border-emerald-500', icon: '🌳', desc: 'Curah hujan tinggi, kanopi lebat' },
  { id: 'karang', name: 'Terumbu Karang Laut', color: 'from-blue-900 to-cyan-950', border: 'border-cyan-400', icon: '🌊', desc: 'Laut tropis hangat berpasir' },
  { id: 'mangrove', name: 'Hutan Mangrove Pesisir', color: 'from-amber-950 to-emerald-950', border: 'border-amber-600', icon: '🌱', desc: 'Zona estuari pasang surut' },
  { id: 'tundra', name: 'Bioma Tundra Arktik', color: 'from-slate-900 to-indigo-950', border: 'border-indigo-400', icon: '❄️', desc: 'Tanah permafrost bersalju dingin' },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const EcosystemBuilderGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [selectedOrganism, setSelectedOrganism] = useState<OrganismItem | null>(null);
  const [placedOrganisms, setPlacedOrganisms] = useState<Record<string, string>>({}); // orgId -> habitatId
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const remainingOrganisms = ALL_ORGANISMS.filter((org) => !placedOrganisms[org.id]);

  const handleSelectOrganism = (org: OrganismItem) => {
    soundManager.playClick();
    setSelectedOrganism(org);
    setFeedback(null);
  };

  const handlePlaceToHabitat = (habitatId: string) => {
    if (!selectedOrganism) return;

    if (selectedOrganism.habitat === habitatId) {
      soundManager.playCorrect();
      const newPlaced = { ...placedOrganisms, [selectedOrganism.id]: habitatId };
      setPlacedOrganisms(newPlaced);
      const newScore = score + 50;
      setScore(newScore);
      setFeedback({
        message: `Benar! ${selectedOrganism.name} hidup selaras di habitat ${habitatId.toUpperCase()}. (+50 Poin)`,
        isCorrect: true,
      });

      if (Object.keys(newPlaced).length === ALL_ORGANISMS.length) {
        setIsFinished(true);
        soundManager.playVictory();
        confetti({ particleCount: 80, spread: 70 });
      }
    } else {
      soundManager.playWrong();
      setFeedback({
        message: `Kurang tepat! ${selectedOrganism.name} bukan penghuni alami habitat ini. Coba perhatikan ciri adaptasinya!`,
        isCorrect: false,
      });
    }

    setSelectedOrganism(null);
  };

  const handleReset = () => {
    setPlacedOrganisms({});
    setSelectedOrganism(null);
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧩</span>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Mini Game 1: Susun Ekosistem</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pilih organisme, lalu klik zona habitat yang sesuai dengan karakteristik adaptasinya!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 bg-emerald-950/70 border border-emerald-500/40 rounded-full font-mono text-emerald-300 font-bold text-sm">
            Skor: {score}
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl mb-4 text-xs sm:text-sm flex items-center gap-2 ${
              feedback.isCorrect ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border border-rose-500/50 text-rose-200'
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organisms Pool */}
      {!isFinished && (
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
            <span>Daftar Organisme yang Perlu Ditempatkan ({remainingOrganisms.length} Tersisa):</span>
            {selectedOrganism && <span className="text-emerald-400 font-bold animate-pulse">👉 Klik habitat di bawah!</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {remainingOrganisms.map((org) => {
              const isSelected = selectedOrganism?.id === org.id;
              return (
                <motion.button
                  key={org.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectOrganism(org)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-emerald-600/30 border-emerald-400 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="text-2xl mb-1">{org.icon}</div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">{org.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{org.description}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Habitats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HABITATS.map((hab) => {
          const placedInThis = ALL_ORGANISMS.filter((org) => placedOrganisms[org.id] === hab.id);

          return (
            <motion.div
              key={hab.id}
              onClick={() => handlePlaceToHabitat(hab.id)}
              whileHover={{ scale: 1.01 }}
              className={`p-4 rounded-2xl border-2 ${hab.border} bg-gradient-to-br ${hab.color} cursor-pointer transition-all min-h-[160px] flex flex-col justify-between relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{hab.icon}</span>
                    <h3 className="font-bold text-white text-base">{hab.name}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{hab.desc}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-black/40 rounded-full text-slate-200">
                  {placedInThis.length}/2 Biota
                </span>
              </div>

              {/* Placed badges inside this habitat */}
              <div className="mt-4 flex flex-wrap gap-2">
                {placedInThis.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/50 border border-white/20 rounded-lg text-xs font-semibold text-emerald-200"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </span>
                ))}
                {placedInThis.length === 0 && (
                  <div className="text-xs text-slate-400/80 italic py-2">
                    Belum ada organisme ditempatkan di sini...
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Modal / Box */}
      {isFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 bg-gradient-to-r from-emerald-900/90 to-cyan-900/90 border-2 border-emerald-400 rounded-2xl text-center"
        >
          <div className="inline-flex p-3 bg-emerald-500/20 rounded-full mb-3 text-emerald-300">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Luar Biasa! Semua Ekosistem Seimbang!</h3>
          <p className="text-sm text-emerald-200 max-w-md mx-auto mb-4">
            Kamu berhasil menempatkan seluruh organisme ke bioma yang tepat sesuai adaptasi morfologi dan fisiologinya!
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onComplete(score, 60)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Klaim Hadiah (+{score} XP & +60 Koin)
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Main Lagi
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
