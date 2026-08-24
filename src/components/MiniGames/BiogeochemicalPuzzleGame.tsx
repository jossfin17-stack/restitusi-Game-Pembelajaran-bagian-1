import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface CycleStep {
  id: string;
  label: string;
  desc: string;
  icon: string;
  order: number;
}

interface CyclePuzzle {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  steps: CycleStep[];
}

const PUZZLES: CyclePuzzle[] = [
  {
    id: 'water_cycle',
    name: 'Puzzle 1: Daur Air (Siklus Hidrologi)',
    subtitle: 'Siklus air alami yang menggerakkan hidrosfer bumi',
    icon: '💧',
    steps: [
      { id: 'w1', label: '1. Evaporasi & Transpirasi', desc: 'Penguapan air laut dan pelepasan uap air stomata daun', icon: '☀️', order: 1 },
      { id: 'w2', label: '2. Kondensasi', desc: 'Uap air mendingin di atmosfer membentuk gumpalan awan', icon: '☁️', order: 2 },
      { id: 'w3', label: '3. Presipitasi', desc: 'Titik-titik air jatuh ke bumi sebagai hujan atau salju', icon: '🌧️', order: 3 },
      { id: 'w4', label: '4. Infiltrasi & Perkolasi', desc: 'Air meresap masuk ke pori-pori tanah membentuk air tanah', icon: '🌱', order: 4 },
      { id: 'w5', label: '5. Runoff Limpasan', desc: 'Aliran air permukaan mengalir melalui sungai menuju laut', icon: '🌊', order: 5 },
    ],
  },
  {
    id: 'carbon_cycle',
    name: 'Puzzle 2: Daur Karbon & Oksigen',
    subtitle: 'Keseimbangan gas CO2 dan O2 antara atmosfer dan biosfer',
    icon: '🍃',
    steps: [
      { id: 'c1', label: '1. Fiksasi CO2 Fotosintesis', desc: 'Tumbuhan hijau mengikat CO2 udara menjadi senyawa glukosa', icon: '🌿', order: 1 },
      { id: 'c2', label: '2. Konsumsi Trofik', desc: 'Hewan memakan tumbuhan dan memanfaatkan molekul karbon organik', icon: '🦌', order: 2 },
      { id: 'c3', label: '3. Respirasi Seluler', desc: 'Organisme merombak glukosa dan melepaskan kembali gas CO2', icon: '💨', order: 3 },
      { id: 'c4', label: '4. Pembentukan Fosil Karbon', desc: 'Sisa bangkai tertimbun jutaan tahun menjadi batu bara & minyak bumi', icon: '🪨', order: 4 },
      { id: 'c5', label: '5. Pembakaran Bahan Bakar', desc: 'Aktivitas industri dan kendaraan melepaskan emisi karbon ke atmosfer', icon: '🏭', order: 5 },
    ],
  },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const BiogeochemicalPuzzleGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [placedSteps, setPlacedSteps] = useState<(CycleStep | null)[]>([null, null, null, null, null]);
  const [availableSteps, setAvailableSteps] = useState<CycleStep[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentPuzzle = PUZZLES[puzzleIdx];

  // Initialize available steps shuffled
  React.useEffect(() => {
    if (puzzleIdx < PUZZLES.length) {
      setAvailableSteps([...PUZZLES[puzzleIdx].steps].sort(() => Math.random() - 0.5));
      setPlacedSteps([null, null, null, null, null]);
    }
  }, [puzzleIdx]);

  const handlePlace = (step: CycleStep) => {
    soundManager.playClick();
    const emptyIdx = placedSteps.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    const newPlaced = [...placedSteps];
    newPlaced[emptyIdx] = step;
    setPlacedSteps(newPlaced);
    setAvailableSteps(availableSteps.filter((s) => s.id !== step.id));

    // Check if fully placed
    if (newPlaced.every((s) => s !== null)) {
      const isCorrect = newPlaced.every((s, idx) => s?.order === idx + 1);
      if (isCorrect) {
        soundManager.playCorrect();
        setScore((prev) => prev + 100);

        if (puzzleIdx + 1 < PUZZLES.length) {
          setTimeout(() => {
            setPuzzleIdx((prev) => prev + 1);
          }, 800);
        } else {
          setIsFinished(true);
          soundManager.playVictory();
          confetti({ particleCount: 85, spread: 75 });
        }
      } else {
        soundManager.playWrong();
        setTimeout(() => {
          setAvailableSteps([...currentPuzzle.steps].sort(() => Math.random() - 0.5));
          setPlacedSteps([null, null, null, null, null]);
        }, 900);
      }
    }
  };

  const handleRemove = (idx: number) => {
    const step = placedSteps[idx];
    if (!step) return;
    soundManager.playClick();
    const newPlaced = [...placedSteps];
    newPlaced[idx] = null;
    setPlacedSteps(newPlaced);
    setAvailableSteps([...availableSteps, step]);
  };

  const handleRestart = () => {
    setPuzzleIdx(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-cyan-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Mini Game 6: Puzzle Daur Biogeokimia</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Susun potongan tahapan siklus daur air dan karbon menjadi alur yang utuh dan benar!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-cyan-950/70 border border-cyan-500/40 rounded-full font-mono text-cyan-300 font-bold text-sm">
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

      {!isFinished ? (
        <div>
          {/* Current puzzle info banner */}
          <div className="p-4 bg-slate-800/70 border border-slate-700 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 bg-slate-900 rounded-lg">{currentPuzzle.icon}</span>
              <div>
                <h3 className="font-bold text-white text-base">{currentPuzzle.name}</h3>
                <p className="text-xs text-slate-400">{currentPuzzle.subtitle}</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-700 rounded-md font-mono">
              Tantangan {puzzleIdx + 1} / {PUZZLES.length}
            </span>
          </div>

          {/* Target Slots */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Alur Siklus Berurutan (Klik slot untuk mengembalikan):
            </div>
            <div className="space-y-2.5">
              {placedSteps.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRemove(idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    slot
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-sm'
                      : 'bg-slate-800/40 border-dashed border-slate-700 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                      {idx + 1}
                    </span>
                    {slot ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{slot.icon}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-cyan-200">{slot.label}</div>
                          <div className="text-[11px] text-slate-400">{slot.desc}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs italic">Kosong — Pilih tahapan di bawah</span>
                    )}
                  </div>
                  {slot && <span className="text-xs text-slate-400 hover:text-rose-400 font-mono">Batal ✕</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Available Steps Pool */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Pilihan Tahapan Daur (Klik untuk menempatkan ke urutan):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableSteps.map((step) => (
                <motion.button
                  key={step.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlace(step)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-400 rounded-xl text-left transition-all flex items-start gap-3 shadow"
                >
                  <span className="text-2xl mt-0.5">{step.icon}</span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">{step.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{step.desc}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gradient-to-br from-cyan-950/90 to-blue-900/90 border-2 border-cyan-400 rounded-2xl p-6">
          <div className="inline-flex p-3 bg-cyan-500/20 rounded-full mb-3 text-cyan-300">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Master Daur Biogeokimia!</h3>
          <p className="text-sm text-cyan-200 max-w-md mx-auto mb-6">
            Kamu berhasil menyusun siklus air dan karbon secara sempurna tanpa celah!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(score, 70)}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Klaim Hadiah (+{score} XP & +70 Koin)
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Main Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
