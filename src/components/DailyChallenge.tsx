import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, CheckCircle2, Award, ArrowLeft, RotateCcw, Timer, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile, Question } from '../types';
import { ALL_QUESTIONS } from '../data/questionsData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onComplete: (xp: number, coins: number) => void;
  onBack: () => void;
}

export const DailyChallenge: React.FC<Props> = ({ player, onComplete, onBack }) => {
  const [dailyQuestions] = useState<Question[]>(() => {
    // Pick 5 random varied questions
    return [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = dailyQuestions[currentIdx];

  const handleSelect = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      setScore((prev) => prev + currentQ.xpReward * 2); // 2x XP for Daily Challenge
      setCorrectCount((prev) => prev + 1);
    } else {
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIdx + 1 < dailyQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      soundManager.playVictory();
      confetti({ particleCount: 100, spread: 80 });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
          <Flame className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Tantangan Harian (2x XP Bonus)</h2>
        </div>
      </div>

      {!isFinished && currentQ ? (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 text-white shadow-2xl">
          {/* Header Info */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-md font-mono text-xs font-bold">
                Soal Harian #{currentIdx + 1} / 5
              </span>
              <span className="text-xs text-slate-400 font-mono">Topik: {currentQ.topic}</span>
            </div>
            <div className="text-xs font-mono font-bold text-amber-400">
              ⚡ Bonus 2x XP (+{currentQ.xpReward * 2} XP)
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl mb-6">
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options?.map((opt, idx) => {
              const isChosen = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;

              let style = 'bg-slate-800/90 border-slate-700 hover:border-amber-400 hover:bg-slate-750 text-slate-200';
              if (isAnswered) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                } else if (isChosen && !isCorrectAnswer) {
                  style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                } else {
                  style = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 shadow ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Feedback Drawer */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-800 border border-slate-700 rounded-xl mb-4 text-xs sm:text-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-bold text-amber-300">
                    {selectedOption === currentQ.correctAnswer ? '✨ Jawaban Benar!' : '⚠️ Pembahasan Lengkap:'}
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold rounded-lg text-xs shrink-0 shadow"
                  >
                    Lanjut 👉
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed mb-2">{currentQ.explanation}</p>
                <div className="text-[11px] text-amber-200 italic">💡 {currentQ.funFact}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Victory Screen */
        <div className="text-center py-8 bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl">
          <div className="inline-flex p-4 bg-amber-500/20 rounded-full mb-3 text-amber-400 ring-4 ring-amber-500/30">
            <Flame className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white mb-1">Tantangan Harian Selesai!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Hebat! Kamu berhasil mempertahankan streak harian dan mengumpulkan poin XP berlipat ganda!
          </p>

          <div className="inline-flex items-center justify-center gap-6 p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <div>
              <div className="text-xs text-slate-400">Total XP Diraih</div>
              <div className="text-xl font-bold text-amber-400">+{score} XP</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-xs text-slate-400">Soal Benar</div>
              <div className="text-xl font-bold text-emerald-400">{correctCount} / 5</div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => onComplete(score, 100)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Klaim Bonus Harian (+{score} XP & +100 Koin)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
