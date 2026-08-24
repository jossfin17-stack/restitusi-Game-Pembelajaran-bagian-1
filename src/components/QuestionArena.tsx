import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, CheckCircle2, XCircle, ArrowRight, Lightbulb, Sparkles, Star, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, Mission } from '../types';
import { soundManager } from '../utils/soundEffects';

interface Props {
  mission: Mission;
  onMissionComplete: (missionId: string, stars: number, totalXp: number, totalCoins: number, correctAnswers: number, topic: string) => void;
  onExit: () => void;
}

export const QuestionArena: React.FC<Props> = ({ mission, onMissionComplete, onExit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<{ id: string; text: string }[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedLeftKey, setSelectedLeftKey] = useState<string | null>(null);
  const [dragDropPlaced, setDragDropPlaced] = useState<Record<string, string>>({}); // itemId -> category
  const [activeDragItem, setActiveDragItem] = useState<{ id: string; text: string; category: string } | null>(null);

  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [comboCount, setComboCount] = useState(0);

  // Score tracking
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isMissionFinished, setIsMissionFinished] = useState(false);

  const currentQ: Question = mission.questions[currentQIndex];

  // Initialize ordering items or drag items when question changes
  useEffect(() => {
    if (!currentQ) return;
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setSelectedLeftKey(null);
    setMatchedPairs({});
    setDragDropPlaced({});
    setActiveDragItem(null);
    setTimeLeft(35);

    if (currentQ.type === 'ordering' && currentQ.orderingItems) {
      // Shuffle ordering items initially
      const shuffled = [...currentQ.orderingItems].sort(() => Math.random() - 0.5);
      setOrderedItems(shuffled);
    }
  }, [currentQIndex, currentQ]);

  // Timer countdown
  useEffect(() => {
    if (isAnswerSubmitted || isMissionFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswerSubmitted, isMissionFinished, currentQIndex]);

  const handleTimeExpired = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    setIsCorrect(false);
    setComboCount(0);
    soundManager.playWrong();
  };

  // Submit multiple choice / true-false / fill_blank / hots
  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
    setIsAnswerSubmitted(true);

    const isAnsCorrect = opt === currentQ.correctAnswer;
    evaluateAnswer(isAnsCorrect);
  };

  // Submit ordering question
  const handleSubmitOrdering = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const targetArr = currentQ.correctAnswer as string[];
    const isAnsCorrect = orderedItems.every((item, idx) => item.id === targetArr[idx]);
    evaluateAnswer(isAnsCorrect);
  };

  // Matching pair handler
  const handleMatchLeft = (leftText: string) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setSelectedLeftKey(leftText);
  };

  const handleMatchRight = (rightText: string) => {
    if (isAnswerSubmitted || !selectedLeftKey) return;
    soundManager.playClick();
    const newMatched = { ...matchedPairs, [selectedLeftKey]: rightText };
    setMatchedPairs(newMatched);
    setSelectedLeftKey(null);

    // If all pairs matched, check correctness
    if (currentQ.matchingPairs && Object.keys(newMatched).length === currentQ.matchingPairs.length) {
      setIsAnswerSubmitted(true);
      const targetMap = currentQ.correctAnswer as Record<string, string>;
      const isAnsCorrect = Object.keys(targetMap).every((k) => newMatched[k] === targetMap[k]);
      evaluateAnswer(isAnsCorrect);
    }
  };

  // Drag drop handler
  const handleSelectDragCategory = (category: string) => {
    if (isAnswerSubmitted || !activeDragItem) return;
    soundManager.playClick();
    const newPlaced = { ...dragDropPlaced, [activeDragItem.id]: category };
    setDragDropPlaced(newPlaced);
    setActiveDragItem(null);

    if (currentQ.dragDropItems && Object.keys(newPlaced).length === currentQ.dragDropItems.length) {
      setIsAnswerSubmitted(true);
      const targetMap = currentQ.correctAnswer as Record<string, string>;
      const isAnsCorrect = Object.keys(targetMap).every((id) => newPlaced[id] === targetMap[id]);
      evaluateAnswer(isAnsCorrect);
    }
  };

  const evaluateAnswer = (isAnsCorrect: boolean) => {
    setIsCorrect(isAnsCorrect);
    if (isAnsCorrect) {
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      soundManager.playCombo(newCombo);
      soundManager.playCorrect();

      // Multiplier bonus
      const multiplier = newCombo >= 3 ? 1.5 : newCombo >= 2 ? 1.2 : 1.0;
      const earnedXp = Math.round(currentQ.xpReward * multiplier);
      const earnedCoins = currentQ.coinReward;

      setTotalXpEarned((prev) => prev + earnedXp);
      setTotalCoinsEarned((prev) => prev + earnedCoins);
      setCorrectCount((prev) => prev + 1);
    } else {
      setComboCount(0);
      soundManager.playWrong();
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentQIndex + 1 < mission.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Calculate Stars: 3 stars (100%), 2 stars (>=60%), 1 star (<60%)
      const accuracy = (correctCount / mission.questions.length) * 100;
      const stars = accuracy >= 100 ? 3 : accuracy >= 50 ? 2 : 1;

      setIsMissionFinished(true);
      soundManager.playVictory();
      confetti({ particleCount: 100, spread: 80 });

      onMissionComplete(
        mission.id,
        stars,
        totalXpEarned,
        totalCoinsEarned,
        correctCount,
        mission.topic
      );
    }
  };

  // Helper for move item up/down in ordering
  const moveOrderItem = (fromIdx: number, toIdx: number) => {
    if (isAnswerSubmitted || toIdx < 0 || toIdx >= orderedItems.length) return;
    soundManager.playClick();
    const updated = [...orderedItems];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderedItems(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900 border border-slate-700/80 rounded-3xl text-white shadow-2xl relative">
      {/* Top Mission Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-md font-mono font-bold">
              {mission.title}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Soal {currentQIndex + 1} dari {mission.questions.length}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Topik: {currentQ.topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Combo Multiplier Pill */}
          {comboCount > 1 && (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-amber-500/20 border border-amber-400 rounded-full font-bold text-xs text-amber-300 flex items-center gap-1 animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Combo x{comboCount}!</span>
            </motion.div>
          )}

          {/* Timer Pill */}
          <div className={`px-3 py-1.5 rounded-full font-mono text-sm font-bold flex items-center gap-1.5 border ${
            timeLeft <= 5 ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-800 border-slate-700 text-cyan-300'
          }`}>
            <Timer className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>

          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Keluar
          </button>
        </div>
      </div>

      {!isMissionFinished ? (
        <div>
          {/* Question Stem Box */}
          <div className="p-5 sm:p-6 bg-slate-800/80 border border-slate-700 rounded-2xl mb-6 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono">Tingkat Kesulitan: <b className="text-emerald-400">{currentQ.difficulty}</b></span>
              <span className="font-mono text-amber-400">+{currentQ.xpReward} XP | +{currentQ.coinReward} Koin</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>
            {currentQ.fillBlankHint && (
              <div className="mt-3 text-xs text-cyan-300 flex items-center gap-1.5 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/50">
                <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Petunjuk: {currentQ.fillBlankHint}</span>
              </div>
            )}
          </div>

          {/* QUESTION INTERACTION ZONES */}

          {/* 1. Multiple Choice / True-False / Fill-Blank / HOTS */}
          {(currentQ.type === 'multiple_choice' ||
            currentQ.type === 'true_false' ||
            currentQ.type === 'fill_blank' ||
            currentQ.type === 'hots_analysis') &&
            currentQ.options && (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {currentQ.options.map((opt, idx) => {
                  const isChosen = selectedOption === opt;
                  const isCorrectAnswer = opt === currentQ.correctAnswer;
                  let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-cyan-400 hover:bg-slate-750 text-slate-200';

                  if (isAnswerSubmitted) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                    } else if (isChosen && !isCorrectAnswer) {
                      btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      whileHover={!isAnswerSubmitted ? { scale: 1.01 } : {}}
                      whileTap={!isAnswerSubmitted ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 shadow ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

          {/* 2. Ordering Type */}
          {currentQ.type === 'ordering' && (
            <div className="mb-6">
              <div className="text-xs text-slate-400 uppercase font-semibold mb-2">
                Gunakan tombol panah untuk menyusun urutan yang benar dari atas ke bawah:
              </div>
              <div className="space-y-2">
                {orderedItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm text-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-600 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      <span>{item.text}</span>
                    </div>

                    {!isAnswerSubmitted && (
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveOrderItem(idx, idx - 1)}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-xs"
                        >
                          ▲
                        </button>
                        <button
                          disabled={idx === orderedItems.length - 1}
                          onClick={() => moveOrderItem(idx, idx + 1)}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 rounded text-xs"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {!isAnswerSubmitted && (
                <button
                  onClick={handleSubmitOrdering}
                  className="mt-4 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20"
                >
                  Kunci Susunan Jawaban ✨
                </button>
              )}
            </div>
          )}

          {/* 3. Matching Type */}
          {currentQ.type === 'matching' && currentQ.matchingPairs && (
            <div className="mb-6">
              <div className="text-xs text-slate-400 uppercase font-semibold mb-2">
                Klik satu item di sebelah kiri, lalu klik pasangannya di sebelah kanan:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Left column */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-cyan-300 mb-1">Kolom A:</div>
                  {currentQ.matchingPairs.map((pair, idx) => {
                    const isSelected = selectedLeftKey === pair.left;
                    const isMatched = !!matchedPairs[pair.left];

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted || isMatched}
                        onClick={() => handleMatchLeft(pair.left)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-cyan-600/30 border-cyan-400 ring-2 ring-cyan-400 text-white'
                            : isMatched
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 opacity-80'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200'
                        }`}
                      >
                        {pair.left} {isMatched && '✓'}
                      </button>
                    );
                  })}
                </div>

                {/* Right column */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-purple-300 mb-1">Kolom B (Pasangan):</div>
                  {currentQ.matchingPairs.map((pair, idx) => {
                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted || !selectedLeftKey}
                        onClick={() => handleMatchRight(pair.right)}
                        className="w-full p-3 rounded-xl border border-slate-700 bg-slate-800 hover:border-purple-400 hover:bg-slate-750 text-left text-xs font-semibold text-slate-200 transition-all"
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 4. Drag & Drop Categories */}
          {currentQ.type === 'drag_drop' && currentQ.dragDropItems && currentQ.dragDropCategories && (
            <div className="mb-6">
              {/* Items Pool */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 uppercase font-semibold mb-2">
                  Pilih item, lalu klik kategori di bawah:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQ.dragDropItems
                    .filter((item) => !dragDropPlaced[item.id])
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveDragItem(item);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          activeDragItem?.id === item.id
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 ring-2 ring-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
                        }`}
                      >
                        {item.text}
                      </button>
                    ))}
                </div>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.dragDropCategories.map((cat) => {
                  const itemsInCat = currentQ.dragDropItems?.filter((i) => dragDropPlaced[i.id] === cat) || [];

                  return (
                    <div
                      key={cat}
                      onClick={() => handleSelectDragCategory(cat)}
                      className="p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/40 hover:border-cyan-400 transition-all cursor-pointer min-h-[120px]"
                    >
                      <div className="text-xs font-bold text-cyan-300 mb-2">{cat}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {itemsInCat.map((it) => (
                          <span
                            key={it.id}
                            className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-lg text-xs font-semibold"
                          >
                            {it.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDUCATIONAL FEEDBACK DRAWER AFTER ANSWERING */}
          <AnimatePresence>
            {isAnswerSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 sm:p-6 rounded-2xl border-2 mb-6 ${
                  isCorrect
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/90 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-400" />
                    )}
                    <span className="font-extrabold text-base sm:text-lg">
                      {isCorrect ? 'Jawaban Kamu Tepat Sekali!' : 'Belum Tepat, Ini Pembahasannya:'}
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-5 py-2 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shrink-0 transition-all"
                  >
                    <span>Lanjut</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Explanation text */}
                <p className="text-xs sm:text-sm leading-relaxed mb-4 text-slate-200">
                  {currentQ.explanation}
                </p>

                {/* Fun fact badge */}
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-amber-200 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300">Fun Fact IPA: </span>
                    {currentQ.funFact}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* Mission Victory Summary */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8 bg-gradient-to-b from-emerald-950/90 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl"
        >
          <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-3 text-emerald-300">
            <Award className="w-10 h-10" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Misi Selesai!</h3>
          <p className="text-sm text-emerald-200 mb-6">
            Kamu telah menuntaskan seluruh materi di {mission.title}!
          </p>

          {/* Stars display */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((starIdx) => {
              const accuracy = (correctCount / mission.questions.length) * 100;
              const earnedStars = accuracy >= 100 ? 3 : accuracy >= 50 ? 2 : 1;
              const isEarned = starIdx <= earnedStars;

              return (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 ${
                    isEarned ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-slate-700 fill-slate-800'
                  }`}
                />
              );
            })}
          </div>

          {/* Reward Badges pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 mb-8 max-w-md mx-auto">
            <div>
              <div className="text-xs text-slate-400">Total XP Diraih</div>
              <div className="text-xl font-bold text-cyan-300">+{totalXpEarned} XP</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400">Koin Ekologi</div>
              <div className="text-xl font-bold text-amber-300">+{totalCoinsEarned} Koin</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-xs text-slate-400">Akurasi Soal</div>
              <div className="text-xl font-bold text-emerald-300">
                {Math.round((correctCount / mission.questions.length) * 100)}%
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onExit}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Kembali ke Peta Dunia
            </button>
            <button
              onClick={() => {
                setCurrentQIndex(0);
                setIsMissionFinished(false);
                setCorrectCount(0);
                setTotalXpEarned(0);
                setTotalCoinsEarned(0);
              }}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Misi
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
