import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trees, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface CrisisScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  actions: {
    label: string;
    forestHealthDelta: number;
    biodiversityDelta: number;
    explanation: string;
    isOptimal: boolean;
  }[];
}

const CRISES: CrisisScenario[] = [
  {
    id: 'cr1',
    title: 'Krisis 1: Ancaman Kebakaran Hutan Gambut',
    description: 'Musim kemarau ekstrem menyebabkan lahan gambut di dekat suaka margasatwa mulai berasap dan terancam membakar habitat orangutan.',
    icon: '🔥',
    actions: [
      {
        label: 'Bangun sekat kanal pembasahan gambut & kerahkan helikopter water bombing',
        forestHealthDelta: +25,
        biodiversityDelta: +20,
        explanation: 'Sangat Tepat! Pembasahan gambut (rewetting) dengan sekat kanal mencegah kebakaran bawah tanah merambat.',
        isOptimal: true,
      },
      {
        label: 'Bakar ranting kering di sekeliling untuk membuat jalur batas api darurat tanpa air',
        forestHealthDelta: -20,
        biodiversityDelta: -15,
        explanation: 'Berbahaya! Lahan gambut sangat mudah terbakar di lapisan bawah tanah, api buatan justru memicu kobaran tak terkendali.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 'cr2',
    title: 'Krisis 2: Pembalakan Liar (Illegal Logging) di Zona Inti',
    description: 'Ditemukan aktivitas penebangan pohon ulin dan meranti tua oleh oknum di dalam kawasan Taman Nasional.',
    icon: '🪓',
    actions: [
      {
        label: 'Pasang sensor akustik bio-akustik AI deteksi gergaji mesin & patroli Polhut bersenjata',
        forestHealthDelta: +30,
        biodiversityDelta: +25,
        explanation: 'Sempurna! Bio-akustik real-time mendeteksi suara gergaji seketika sebelum pohon kanopi sempat ditebang.',
        isOptimal: true,
      },
      {
        label: 'Biarkan penebangan berlangsung lalu tanam bibit kelapa sawit monokultur sebagai ganti',
        forestHealthDelta: -35,
        biodiversityDelta: -30,
        explanation: 'Merusak Ekosistem! Monokultur sawit menghancurkan keanekaragaman hayati dan rantai makanan hutan primer.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 'cr3',
    title: 'Krisis 3: Perburuan Burung Rangkong & Rusa Endemik',
    description: 'Terjadi penurunan populasi burung pemencar biji akibat jerat liar pemburu di koridor satwa.',
    icon: '🏹',
    actions: [
      {
        label: 'Sosialisasi ekowisata berbasis masyarakat & berdayakan warga lokal jadi Ranger Hutan',
        forestHealthDelta: +25,
        biodiversityDelta: +30,
        explanation: 'Brilian! Mengubah mantan pemburu menjadi penjaga hutan (community-based conservation) memberi mata pencaharian ramah lingkungan.',
        isOptimal: true,
      },
      {
        label: 'Pasang pagar kawat berlistrik tinggi di seluruh perbatasan hutan',
        forestHealthDelta: -10,
        biodiversityDelta: -25,
        explanation: 'Salah kaprah! Pagar listrik membahayakan satwa liar yang sedang bermigrasi mencari sumber air.',
        isOptimal: false,
      },
    ],
  },
  {
    id: 'cr4',
    title: 'Krisis 4: Limbah Merkuri Penambangan Ilegal di Hulu Sungai',
    description: 'Aliran sungai pegunungan tercemar logam berat merkuri yang mengancam biota air dan kesehatan masyarakat hilir.',
    icon: '🧪',
    actions: [
      {
        label: 'Tutup tambang ilegal, bangun kolam fitoremediasi tanaman eceng gondok & aerasi aktif',
        forestHealthDelta: +30,
        biodiversityDelta: +30,
        explanation: 'Tepat sekali! Fitoremediasi menyerap ion logam berat dan penegakan hukum menghentikan sumber polutan.',
        isOptimal: true,
      },
      {
        label: 'Teteskan zat klorin pekat ke sungai dalam dosis besar',
        forestHealthDelta: -30,
        biodiversityDelta: -35,
        explanation: 'Bencana Toksik! Klorin pekat justru meracuni seluruh mikroorganisme dan ikan yang masih bertahan.',
        isOptimal: false,
      },
    ],
  },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const SaveTheForestGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [forestHealth, setForestHealth] = useState(70);
  const [biodiversity, setBiodiversity] = useState(65);
  const [score, setScore] = useState(0);
  const [selectedActionFeedback, setSelectedActionFeedback] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const crisis = CRISES[currentIdx];

  const handleAction = (action: typeof CRISES[0]['actions'][0]) => {
    if (selectedActionFeedback) return;

    if (action.isOptimal) {
      soundManager.playCorrect();
      setScore((prev) => prev + 100);
    } else {
      soundManager.playWrong();
    }

    setForestHealth((prev) => Math.min(100, Math.max(0, prev + action.forestHealthDelta)));
    setBiodiversity((prev) => Math.min(100, Math.max(0, prev + action.biodiversityDelta)));
    setSelectedActionFeedback(action.explanation);
  };

  const handleNextCrisis = () => {
    soundManager.playClick();
    setSelectedActionFeedback(null);
    if (currentIdx + 1 < CRISES.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
      confetti({ particleCount: 85, spread: 75 });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setForestHealth(70);
    setBiodiversity(65);
    setScore(0);
    setSelectedActionFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-emerald-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌲</span>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Mini Game 5: Save The Forest</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ambil keputusan konservasi strategis untuk melindungi hutan tropis Nusantara!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/40 rounded-full font-mono text-emerald-300 font-bold text-sm">
            Skor: {score}
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Forest Health & Biodiversity Meters */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-emerald-300 flex items-center gap-1.5">
              <Trees className="w-4 h-4" /> Kesehatan Hutan:
            </span>
            <span className="font-mono">{forestHealth}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 ${
                forestHealth > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-400' : 'bg-rose-500'
              }`}
              style={{ width: `${forestHealth}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Indeks Keanekaragaman Hayati:
            </span>
            <span className="font-mono">{biodiversity}%</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-500"
              style={{ width: `${biodiversity}%` }}
            />
          </div>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Crisis Card */}
          <div className="p-6 bg-slate-800/80 border border-slate-700 rounded-2xl mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl p-2 bg-slate-900 rounded-xl border border-slate-700">{crisis.icon}</span>
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Darurat Lingkungan {currentIdx + 1} / {CRISES.length}
                </span>
                <h3 className="text-lg font-bold text-white">{crisis.title}</h3>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{crisis.description}</p>
          </div>

          {/* Feedback banner */}
          {selectedActionFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-800 border border-emerald-500/50 rounded-xl mb-6 text-sm flex items-center justify-between gap-3 text-emerald-200"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{selectedActionFeedback}</span>
              </div>
              <button
                onClick={handleNextCrisis}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 shrink-0 shadow"
              >
                Lanjut Kasus Berikutnya 👉
              </button>
            </motion.div>
          )}

          {/* Action Choices */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase text-slate-400">Pilih Kebijakan Tindakan:</div>
            {crisis.actions.map((act, idx) => (
              <motion.button
                key={idx}
                disabled={!!selectedActionFeedback}
                whileHover={!selectedActionFeedback ? { scale: 1.01 } : {}}
                whileTap={!selectedActionFeedback ? { scale: 0.99 } : {}}
                onClick={() => handleAction(act)}
                className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                  selectedActionFeedback
                    ? 'opacity-60 cursor-not-allowed bg-slate-800/40 border-slate-700'
                    : 'bg-slate-800/90 border-slate-700 hover:border-emerald-400 hover:bg-slate-750 cursor-pointer shadow'
                }`}
              >
                <div className="text-white">{act.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gradient-to-br from-emerald-950/90 to-green-900/90 border-2 border-emerald-400 rounded-2xl p-6">
          <div className="text-5xl mb-3">🌳✨</div>
          <h3 className="text-2xl font-bold text-white mb-1">Hutan Lestari & Terlindungi!</h3>
          <p className="text-sm text-emerald-200 max-w-md mx-auto mb-6">
            Kepemimpinan ekologismu berhasil menjaga ekosistem hutan tropis dan satwa langka Nusantara dari ancaman kepunahan!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(score, 70)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Klaim Hadiah (+{score} XP & +70 Koin)
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Simulasi Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
