import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, Timer, Zap, Award, CheckCircle2, RotateCcw, ArrowLeft, Bot, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Champion, PlayerProfile, Question } from '../types';
import { CHAMPIONS_DATA } from '../data/championsData';
import { ALL_QUESTIONS } from '../data/questionsData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onVictory: (xpEarned: number, coinsEarned: number) => void;
  onBack: () => void;
}

export const DuelMode: React.FC<Props> = ({ player, onVictory, onBack }) => {
  const [selectedOpponent, setSelectedOpponent] = useState<Champion | null>(null);
  const [duelModeType, setDuelModeType] = useState<'vs_ai' | 'pass_play'>('vs_ai');
  const [isDuelActive, setIsDuelActive] = useState(false);

  // Match state
  const [duelQuestions, setDuelQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0); // AI or Player 2
  const [p1Selected, setP1Selected] = useState<string | null>(null);
  const [p2Selected, setP2Selected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  const startDuel = (opponent: Champion) => {
    soundManager.playClick();
    setSelectedOpponent(opponent);

    // Pick 5 random questions
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setDuelQuestions(shuffled);
    setCurrentIdx(0);
    setP1Score(0);
    setP2Score(0);
    setP1Selected(null);
    setP2Selected(null);
    setTimeLeft(15);
    setIsRoundOver(false);
    setIsMatchFinished(false);
    setIsDuelActive(true);
  };

  const currentQ = duelQuestions[currentIdx];

  // Timer per question (15 seconds lightning round)
  useEffect(() => {
    if (!isDuelActive || isRoundOver || isMatchFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishRound(null, null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDuelActive, isRoundOver, isMatchFinished, currentIdx]);

  // Simulate AI opponent answering after 2-6 seconds
  useEffect(() => {
    if (!isDuelActive || isRoundOver || isMatchFinished || duelModeType !== 'vs_ai' || !selectedOpponent) return;

    const aiAnswerDelay = Math.random() * 3000 + 2000; // 2 to 5 seconds
    const aiTimer = setTimeout(() => {
      if (!isRoundOver && currentQ) {
        // High win rate chance to pick correct
        const accuracy = selectedOpponent.winRate / 100;
        const willBeCorrect = Math.random() < accuracy;
        let aiChoice: string;

        if (willBeCorrect) {
          aiChoice = currentQ.correctAnswer as string;
        } else {
          const wrongOpts = currentQ.options?.filter((o) => o !== currentQ.correctAnswer) || [];
          aiChoice = wrongOpts[Math.floor(Math.random() * wrongOpts.length)] || (currentQ.correctAnswer as string);
        }

        setP2Selected(aiChoice);
      }
    }, aiAnswerDelay);

    return () => clearTimeout(aiTimer);
  }, [isDuelActive, isRoundOver, isMatchFinished, currentIdx, duelModeType, selectedOpponent, currentQ]);

  const handleP1Answer = (opt: string) => {
    if (isRoundOver || p1Selected) return;
    soundManager.playClick();
    setP1Selected(opt);

    // If P2 has also answered or timeout, finish
    if (duelModeType === 'vs_ai') {
      setTimeout(() => {
        finishRound(opt, p2Selected);
      }, 800);
    }
  };

  const handleP2Answer = (opt: string) => {
    if (isRoundOver || p2Selected) return;
    soundManager.playClick();
    setP2Selected(opt);
  };

  const finishRound = (p1Ans: string | null, p2Ans: string | null) => {
    if (isRoundOver) return;
    setIsRoundOver(true);

    const actualP1 = p1Ans || p1Selected;
    const actualP2 = p2Ans || p2Selected;

    let p1Add = 0;
    let p2Add = 0;

    if (actualP1 === currentQ.correctAnswer) {
      soundManager.playCorrect();
      p1Add = 100 + timeLeft * 5;
      setP1Score((prev) => prev + p1Add);
    } else {
      soundManager.playWrong();
    }

    if (actualP2 === currentQ.correctAnswer) {
      p2Add = 100 + Math.floor(Math.random() * 30);
      setP2Score((prev) => prev + p2Add);
    }

    // Auto next after 2.5 seconds
    setTimeout(() => {
      if (currentIdx + 1 < duelQuestions.length) {
        setCurrentIdx((prev) => prev + 1);
        setP1Selected(null);
        setP2Selected(null);
        setTimeLeft(15);
        setIsRoundOver(false);
      } else {
        setIsMatchFinished(true);
        if (p1Score + p1Add > p2Score + p2Add) {
          soundManager.playVictory();
          confetti({ particleCount: 100, spread: 80 });
        }
      }
    }, 2800);
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
          <Swords className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Arena Duel 1 vs 1 (COC Style)</h2>
        </div>
      </div>

      {!isDuelActive ? (
        /* Opponent Selection Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-mono font-bold">
              ⚡ LIVE HEAD-TO-HEAD BATTLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Pilih Lawan Duel Champion</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Uji kecepatan dan ketepatan analisismu dalam duel 5 soal berkecepatan tinggi!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAMPIONS_DATA.map((champ) => (
              <motion.div
                key={champ.id}
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-slate-800/80 border border-slate-700 hover:border-amber-400 rounded-2xl flex flex-col justify-between transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl p-2 bg-slate-900 rounded-2xl border border-slate-700">{champ.avatar}</div>
                    <div className="text-right">
                      <span className="text-xs px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-600 rounded font-mono font-bold">
                        IQ {champ.iqScore}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-1">Win Rate: {champ.winRate}%</div>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-base">{champ.name}</h3>
                  <div className="text-xs text-cyan-400 font-medium">{champ.schoolOrUni}</div>
                  <div className="text-xs text-amber-300 mt-2 font-mono">🎯 Spesialisasi: {champ.specialty}</div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{champ.bio}</p>
                </div>

                <button
                  onClick={() => startDuel(champ)}
                  className="mt-4 w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Swords className="w-4 h-4" />
                  <span>Tantang Duel</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Duel Screen */
        <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-6 text-white shadow-2xl relative overflow-hidden">
          {/* Duel Scoreboard */}
          <div className="grid grid-cols-3 items-center gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6">
            {/* P1 Player */}
            <div className="flex items-center gap-3">
              <div className="text-3xl p-1 bg-slate-800 rounded-xl">{player.avatar}</div>
              <div>
                <div className="text-xs text-slate-400 font-mono">Pemain (Kamu)</div>
                <div className="text-lg sm:text-2xl font-black text-cyan-400">{p1Score} PTS</div>
              </div>
            </div>

            {/* Timer Center */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full font-mono text-sm text-amber-400 font-bold">
                <Timer className="w-4 h-4" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">Ronde {currentIdx + 1} / 5</div>
            </div>

            {/* Opponent P2 */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-xs text-slate-400 font-mono">{selectedOpponent?.name.split(' ')[0]}</div>
                <div className="text-lg sm:text-2xl font-black text-rose-400">{p2Score} PTS</div>
              </div>
              <div className="text-3xl p-1 bg-slate-800 rounded-xl">{selectedOpponent?.avatar}</div>
            </div>
          </div>

          {!isMatchFinished && currentQ && (
            <div>
              {/* Question Stem */}
              <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl mb-6 text-center">
                <span className="text-xs px-2.5 py-0.5 bg-cyan-950 text-cyan-300 rounded font-mono font-bold mb-2 inline-block">
                  {currentQ.topic}
                </span>
                <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {currentQ.options?.map((opt, idx) => {
                  const isP1Pick = p1Selected === opt;
                  const isCorrect = isRoundOver && opt === currentQ.correctAnswer;
                  const isP1Wrong = isRoundOver && isP1Pick && !isCorrect;

                  let style = 'bg-slate-800/90 border-slate-700 hover:border-amber-400 hover:bg-slate-750 text-slate-200';
                  if (isRoundOver) {
                    if (isCorrect) {
                      style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                    } else if (isP1Wrong) {
                      style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                    } else {
                      style = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
                    }
                  } else if (isP1Pick) {
                    style = 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400';
                  }

                  return (
                    <motion.button
                      key={idx}
                      disabled={isRoundOver || !!p1Selected}
                      whileHover={!isRoundOver && !p1Selected ? { scale: 1.02 } : {}}
                      onClick={() => handleP1Answer(opt)}
                      className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-2.5 ${style}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Round Resolution Feedback */}
              <AnimatePresence>
                {isRoundOver && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-950 border border-slate-700 rounded-xl text-center text-xs sm:text-sm text-slate-300"
                  >
                    <div className="font-bold text-amber-300 mb-1">
                      Kunci Jawaban: {currentQ.correctAnswer as string}
                    </div>
                    <div>{currentQ.explanation}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Match Finished Screen */}
          {isMatchFinished && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8 bg-slate-950/90 border-2 border-amber-500 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-5xl mb-2">{p1Score >= p2Score ? '🏆' : '🥈'}</div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">
                {p1Score > p2Score ? 'KAMU MEMENANGKAN DUEL!' : p1Score === p2Score ? 'HASIL IMBANG!' : 'CHAMPION LAWAN MENANG!'}
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Skor Akhir: <b className="text-cyan-400">{p1Score} PTS</b> vs <b className="text-rose-400">{p2Score} PTS</b>
              </p>

              <div className="flex justify-center gap-4">
                {p1Score > p2Score && (
                  <button
                    onClick={() => {
                      onVictory(200, 80);
                      setIsDuelActive(false);
                    }}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Klaim Kemenangan (+200 XP & +80 Koin)
                  </button>
                )}
                <button
                  onClick={() => setIsDuelActive(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
                >
                  Pilih Lawan Lain
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
