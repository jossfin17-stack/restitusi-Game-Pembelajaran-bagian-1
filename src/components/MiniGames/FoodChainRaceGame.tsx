import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, Zap, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../../utils/soundEffects';

interface FoodChainRound {
  title: string;
  habitat: string;
  items: { id: string; name: string; trofik: string; icon: string; order: number }[];
}

const ROUNDS: FoodChainRound[] = [
  {
    title: 'Ronde 1: Rantai Makanan Ekosistem Sawah',
    habitat: '🌾 Ekosistem Sawah',
    items: [
      { id: '1', name: 'Tanaman Padi', trofik: 'Produsen (Trofik I)', icon: '🌾', order: 1 },
      { id: '2', name: 'Belalang Daun', trofik: 'Konsumen Primer (Trofik II)', icon: '🦗', order: 2 },
      { id: '3', name: 'Katak Sawah', trofik: 'Konsumen Sekunder (Trofik III)', icon: '🐸', order: 3 },
      { id: '4', name: 'Ular Sawah', trofik: 'Konsumen Tersier (Trofik IV)', icon: '🐍', order: 4 },
      { id: '5', name: 'Burung Elang', trofik: 'Konsumen Puncak (Trofik V)', icon: '🦅', order: 5 },
    ],
  },
  {
    title: 'Ronde 2: Rantai Makanan Laut Dalam',
    habitat: '🌊 Ekosistem Laut',
    items: [
      { id: '1', name: 'Fitoplankton', trofik: 'Produsen (Trofik I)', icon: '🦠', order: 1 },
      { id: '2', name: 'Zooplankton & Udang Krill', trofik: 'Konsumen Primer (Trofik II)', icon: '🦐', order: 2 },
      { id: '3', name: 'Ikan Herring Kecil', trofik: 'Konsumen Sekunder (Trofik III)', icon: '🐟', order: 3 },
      { id: '4', name: 'Ikan Tuna Karnivora', trofik: 'Konsumen Tersier (Trofik IV)', icon: '🦈', order: 4 },
      { id: '5', name: 'Paus Pembunuh (Orca)', trofik: 'Konsumen Puncak (Trofik V)', icon: '🐋', order: 5 },
    ],
  },
  {
    title: 'Ronde 3: Rantai Makanan Hutan Hujan Tropis',
    habitat: '🌴 Hutan Hujan Kalimantan',
    items: [
      { id: '1', name: 'Pohon Buah Ara / Ficus', trofik: 'Produsen (Trofik I)', icon: '🌳', order: 1 },
      { id: '2', name: 'Kancil & Tapir Herbivora', trofik: 'Konsumen Primer (Trofik II)', icon: '🦌', order: 2 },
      { id: '3', name: 'Ular Sanca Kembang', trofik: 'Konsumen Sekunder (Trofik III)', icon: '🐍', order: 3 },
      { id: '4', name: 'Macan Dahan', trofik: 'Konsumen Tersier (Trofik IV)', icon: '🐆', order: 4 },
      { id: '5', name: 'Jamur & Bakteri Tanah', trofik: 'Dekomposer Pengurai', icon: '🍄', order: 5 },
    ],
  },
];

interface Props {
  onComplete: (score: number, coins: number) => void;
  onBack: () => void;
}

export const FoodChainRaceGame: React.FC<Props> = ({ onComplete, onBack }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [placedSlots, setPlacedSlots] = useState<(typeof ROUNDS[0]['items'][0] | null)[]>([null, null, null, null, null]);
  const [poolItems, setPoolItems] = useState<typeof ROUNDS[0]['items']>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const currentRound = ROUNDS[currentRoundIdx];

  // Initialize round pool (shuffled)
  useEffect(() => {
    if (currentRoundIdx < ROUNDS.length) {
      const shuffled = [...ROUNDS[currentRoundIdx].items].sort(() => Math.random() - 0.5);
      setPoolItems(shuffled);
      setPlacedSlots([null, null, null, null, null]);
      setTimeLeft(25);
    }
  }, [currentRoundIdx]);

  // Timer countdown
  useEffect(() => {
    if (isGameOver || isWon) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundManager.playWrong();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isWon, currentRoundIdx]);

  const handleSelectItem = (item: typeof ROUNDS[0]['items'][0]) => {
    soundManager.playClick();
    // Find first empty slot
    const emptySlotIdx = placedSlots.findIndex((slot) => slot === null);
    if (emptySlotIdx !== -1) {
      const newSlots = [...placedSlots];
      newSlots[emptySlotIdx] = item;
      setPlacedSlots(newSlots);
      setPoolItems(poolItems.filter((i) => i.id !== item.id));

      // Check if all slots filled
      if (newSlots.every((s) => s !== null)) {
        // Validate sequence
        const isCorrectOrder = newSlots.every((slot, idx) => slot?.order === idx + 1);
        if (isCorrectOrder) {
          soundManager.playCorrect();
          const speedBonus = timeLeft * 5;
          const roundScore = 100 + speedBonus;
          setTotalScore((prev) => prev + roundScore);

          if (currentRoundIdx + 1 < ROUNDS.length) {
            setTimeout(() => {
              setCurrentRoundIdx((prev) => prev + 1);
            }, 600);
          } else {
            setIsWon(true);
            soundManager.playVictory();
            confetti({ particleCount: 90, spread: 80 });
          }
        } else {
          soundManager.playWrong();
          setTimeout(() => {
            // Reset slots back to pool
            setPoolItems([...currentRound.items].sort(() => Math.random() - 0.5));
            setPlacedSlots([null, null, null, null, null]);
          }, 700);
        }
      }
    }
  };

  const handleRemoveFromSlot = (idx: number) => {
    const item = placedSlots[idx];
    if (!item) return;
    soundManager.playClick();
    const newSlots = [...placedSlots];
    newSlots[idx] = null;
    setPlacedSlots(newSlots);
    setPoolItems([...poolItems, item]);
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setTotalScore(0);
    setIsGameOver(false);
    setIsWon(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-blue-500/30 rounded-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">Mini Game 2: Rantai Makanan Race</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Susun urutan trofik Produsen → Konsumen → Puncak secepat mungkin sebelum waktu habis!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-full font-mono text-sm font-bold flex items-center gap-1.5 border ${
            timeLeft <= 5 ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-300'
          }`}>
            <Timer className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <div className="px-3 py-1.5 bg-blue-950/70 border border-blue-500/40 rounded-full font-mono text-blue-300 font-bold text-sm">
            Skor: {totalScore}
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Round Indicator */}
      <div className="flex items-center justify-between mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
        <div className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{currentRound.title} ({currentRound.habitat})</span>
        </div>
        <span className="text-xs px-2.5 py-1 bg-cyan-950 text-cyan-200 border border-cyan-700 rounded-md font-mono">
          Ronde {currentRoundIdx + 1} / {ROUNDS.length}
        </span>
      </div>

      {!isGameOver && !isWon && (
        <>
          {/* Target Chain Slots */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Jalur Rantai Makanan (Klik slot untuk membatalkan):
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {placedSlots.map((slot, idx) => (
                <div
                  key={idx}
                  onClick={() => handleRemoveFromSlot(idx)}
                  className={`p-2 sm:p-3 rounded-xl border-2 min-h-[110px] flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    slot
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/40 border-dashed border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-mono text-slate-400 mb-1">Tingkat {idx + 1}</span>
                  {slot ? (
                    <>
                      <span className="text-2xl sm:text-3xl mb-1">{slot.icon}</span>
                      <span className="text-xs font-bold text-white line-clamp-1">{slot.name}</span>
                      <span className="text-[10px] text-cyan-300 line-clamp-1">{slot.trofik}</span>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">Slot Kosong</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Organism Items Pool */}
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Pilih Organisme untuk Ditempatkan:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {poolItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectItem(item)}
                  className="p-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-400 rounded-xl text-center transition-all shadow"
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-tight">{item.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.trofik}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="text-center py-8 bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6">
          <div className="text-4xl mb-2">⏳</div>
          <h3 className="text-2xl font-bold text-rose-300 mb-2">Waktu Habis!</h3>
          <p className="text-sm text-slate-300 mb-6">
            Rantai makanan belum tersusun sempurna. Asah refleks dan pemahaman tingkat trofikmu lagi!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
            >
              Menu Utama
            </button>
          </div>
        </div>
      )}

      {/* Victory Screen */}
      {isWon && (
        <div className="text-center py-8 bg-gradient-to-br from-cyan-950/90 to-blue-900/90 border-2 border-cyan-400 rounded-2xl p-6">
          <div className="inline-flex p-3 bg-cyan-500/20 rounded-full mb-3 text-cyan-300">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Raja Rantai Makanan Sejati!</h3>
          <p className="text-sm text-cyan-200 max-w-md mx-auto mb-6">
            Kamu menuntaskan seluruh 3 ronde rantai makanan dengan kecepatan luar biasa!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(totalScore, 70)}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              Klaim (+{totalScore} XP & +70 Koin)
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
