import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Timer, Zap, Award, CheckCircle2, ArrowLeft, RotateCcw, Crown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Champion, PlayerProfile, Question } from '../types';
import { CHAMPIONS_DATA } from '../data/championsData';
import { ALL_QUESTIONS } from '../data/questionsData';
import { soundManager } from '../utils/soundEffects';

interface TournamentContestant {
  id: string;
  name: string;
  avatar: string;
  school: string;
  score: number;
  isPlayer?: boolean;
  isEliminated?: boolean;
}

interface Props {
  player: PlayerProfile;
  onVictory: (xpEarned: number, coinsEarned: number, badgeId?: string) => void;
  onBack: () => void;
}

export const TournamentMode: React.FC<Props> = ({ player, onVictory, onBack }) => {
  const [isTournamentActive, setIsTournamentActive] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1); // Round 1 (10 contestants), Round 2 (6), Round 3 Final (3)
  const [contestants, setContestants] = useState<TournamentContestant[]>([]);
  const [roundQuestions, setRoundQuestions] = useState<Question[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [isTournamentWon, setIsTournamentWon] = useState(false);
  const [isPlayerEliminated, setIsPlayerEliminated] = useState(false);

  // Initialize Tournament
  const handleStartTournament = () => {
    soundManager.playClick();
    const initialContestants: TournamentContestant[] = [
      {
        id: 'player_id',
        name: player.name + ' (Kamu)',
        avatar: player.avatar,
        school: player.school,
        score: 0,
        isPlayer: true,
      },
      ...CHAMPIONS_DATA.map((c) => ({
        id: c.id,
        name: c.name,
        avatar: c.avatar,
        school: c.schoolOrUni,
        score: 0,
      })),
    ];

    setContestants(initialContestants);
    setRoundNumber(1);
    setIsPlayerEliminated(false);
    setIsTournamentWon(false);
    startRound(1, initialContestants);
    setIsTournamentActive(true);
  };

  const startRound = (round: number, currentList: TournamentContestant[]) => {
    // Pick 3 fresh questions for this round
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 3);
    setRoundQuestions(shuffled);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setTimeLeft(20);
    setIsQuestionAnswered(false);
    setIsRoundFinished(false);
    setRoundNumber(round);
  };

  const currentQ = roundQuestions[currentQIdx];

  // Timer per question
  useEffect(() => {
    if (!isTournamentActive || isQuestionAnswered || isRoundFinished || !currentQ) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTournamentActive, isQuestionAnswered, isRoundFinished, currentQIdx, currentQ]);

  const handleSubmitAnswer = (opt: string | null) => {
    if (isQuestionAnswered) return;
    setIsQuestionAnswered(true);
    setSelectedOption(opt);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    const playerEarned = isCorrect ? 100 + timeLeft * 5 : 0;

    // Simulate AI contestants answering
    setContestants((prev) => {
      const updated = prev.map((c) => {
        if (c.isEliminated) return c;
        if (c.isPlayer) {
          return { ...c, score: c.score + playerEarned };
        }
        // AI score probability
        const willBeCorrect = Math.random() < 0.75;
        const aiScore = willBeCorrect ? 100 + Math.floor(Math.random() * 40) : 0;
        return { ...c, score: c.score + aiScore };
      });

      // Sort ranking by score descending
      return updated.sort((a, b) => b.score - a.score);
    });

    // Advance question or round
    setTimeout(() => {
      if (currentQIdx + 1 < roundQuestions.length) {
        setCurrentQIdx((prev) => prev + 1);
        setSelectedOption(null);
        setTimeLeft(20);
        setIsQuestionAnswered(false);
      } else {
        finishRound();
      }
    }, 2500);
  };

  const finishRound = () => {
    setIsRoundFinished(true);

    // Filter top contestants
    // Round 1: Top 6 advance
    // Round 2: Top 3 advance
    // Round 3: Rank 1 Champion!
    const targetSurvivorsCount = roundNumber === 1 ? 6 : roundNumber === 2 ? 3 : 1;

    setContestants((prev) => {
      const sorted = [...prev].sort((a, b) => b.score - a.score);
      const updated = sorted.map((c, idx) => {
        if (idx >= targetSurvivorsCount && roundNumber < 3) {
          return { ...c, isEliminated: true };
        }
        return c;
      });

      const playerSurvives = updated.find((c) => c.isPlayer && !c.isEliminated);
      if (!playerSurvives && roundNumber < 3) {
        setIsPlayerEliminated(true);
      } else if (roundNumber === 3) {
        if (sorted[0]?.isPlayer) {
          setIsTournamentWon(true);
          soundManager.playVictory();
          confetti({ particleCount: 150, spread: 90 });
        }
      }

      return updated;
    });
  };

  const handleNextRound = () => {
    const nextRound = roundNumber + 1;
    startRound(nextRound, contestants);
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
          <Trophy className="w-5 h-5 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">Turnamen 10 Champion Ekologi (COC)</h2>
        </div>
      </div>

      {!isTournamentActive ? (
        /* Tournament Lobby Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl text-center">
          <div className="inline-flex p-4 bg-amber-500/20 rounded-full mb-4 text-amber-400 ring-4 ring-amber-500/30 animate-pulse">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black mb-2">Clash of Ecology 10-Player Championship</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-6">
            10 Mahasiswa & Siswa Berbakat bertarung dalam 3 babak eliminasi ketat. Siapkah kamu membuktikan diri sebagai Grand Champion Ekologi?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-mono text-cyan-400 font-bold mb-1">BABAK 1: PENYISIHAN</div>
              <div className="text-sm font-bold text-white">10 → 6 Kontestan</div>
              <div className="text-[11px] text-slate-400 mt-1">3 Soal Kecepatan Tinggi</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-mono text-purple-400 font-bold mb-1">BABAK 2: SEMIFINAL</div>
              <div className="text-sm font-bold text-white">6 → 3 Kontestan</div>
              <div className="text-[11px] text-slate-400 mt-1">3 Soal HOTS Analitik</div>
            </div>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700">
              <div className="text-xs font-mono text-amber-400 font-bold mb-1">BABAK 3: GRAND FINAL</div>
              <div className="text-sm font-bold text-white">3 → 1 Grand Champion</div>
              <div className="text-[11px] text-slate-400 mt-1">3 Soal Super HOTS Penentuan</div>
            </div>
          </div>

          <button
            onClick={handleStartTournament}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-base flex items-center gap-2 mx-auto shadow-xl shadow-amber-500/30 transition-all"
          >
            <Trophy className="w-5 h-5" />
            <span>Mulai Turnamen COC</span>
          </button>
        </div>
      ) : (
        /* Tournament Active Live Match & Scoreboard */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Question Arena (Left 2 cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs px-3 py-1 bg-amber-950 border border-amber-600 text-amber-300 rounded-md font-mono font-bold">
                Babak {roundNumber} ({roundNumber === 1 ? 'Penyisihan 10 Besar' : roundNumber === 2 ? 'Semifinal 6 Besar' : 'Grand Final 3 Besar'})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Soal {currentQIdx + 1} / 3</span>
                <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full font-mono text-xs text-cyan-300 flex items-center gap-1 font-bold">
                  <Timer className="w-3.5 h-3.5" /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </div>
              </div>
            </div>

            {!isRoundFinished && currentQ && (
              <div>
                <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl mb-4">
                  <div className="text-xs text-cyan-400 font-mono mb-1">Materi: {currentQ.topic}</div>
                  <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentQ.options?.map((opt, idx) => {
                    const isPicked = selectedOption === opt;
                    const isCorrect = isQuestionAnswered && opt === currentQ.correctAnswer;
                    const isWrong = isQuestionAnswered && isPicked && !isCorrect;

                    let style = 'bg-slate-800/80 border-slate-700 hover:border-cyan-400 hover:bg-slate-750 text-slate-200';
                    if (isQuestionAnswered) {
                      if (isCorrect) {
                        style = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400';
                      } else if (isWrong) {
                        style = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                      } else {
                        style = 'opacity-40 bg-slate-900 border-slate-800 text-slate-500';
                      }
                    }

                    return (
                      <motion.button
                        key={idx}
                        disabled={isQuestionAnswered}
                        whileHover={!isQuestionAnswered ? { scale: 1.01 } : {}}
                        onClick={() => handleSubmitAnswer(opt)}
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
              </div>
            )}

            {/* Round Summary & Next Stage Drawer */}
            {isRoundFinished && !isTournamentWon && !isPlayerEliminated && (
              <div className="text-center py-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-1">Babak {roundNumber} Selesai!</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-4">
                  Periksa papan peringkat di samping untuk melihat apakah posisimu aman melaju ke babak berikutnya!
                </p>
                <button
                  onClick={handleNextRound}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/30"
                >
                  Lanjut ke Babak {roundNumber + 1} 👉
                </button>
              </div>
            )}

            {/* Player Eliminated */}
            {isPlayerEliminated && (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">💔</div>
                <h3 className="text-xl font-bold text-rose-400 mb-1">Tereliminasi di Babak {roundNumber}!</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-4">
                  Poinmu belum mencukupi untuk menembus zona aman babak ini. Tingkatkan kecepatan analisismu!
                </p>
                <button
                  onClick={handleStartTournament}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" /> Ulangi Turnamen
                </button>
              </div>
            )}

            {/* Tournament Victory */}
            {isTournamentWon && (
              <div className="text-center py-6">
                <div className="text-5xl mb-2">👑</div>
                <h3 className="text-2xl font-black text-amber-400 mb-1">KAMU JUARA 1 TURNAMEN COC!</h3>
                <p className="text-sm text-emerald-200 mb-6">
                  Luar biasa! Kamu mengalahkan 9 Champion terbaik se-Indonesia dalam pertempuran sains ekologi!
                </p>
                <button
                  onClick={() => {
                    onVictory(400, 150, 'badge_tournament_hero');
                    setIsTournamentActive(false);
                  }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 mx-auto shadow-lg shadow-amber-500/30"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Klaim Gelar Juara (+400 XP & +150 Koin)
                </button>
              </div>
            )}
          </div>

          {/* Live Leaderboard (Right 1 col) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4" /> Papan Peringkat Live
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Real-time Score</span>
              </div>

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {contestants.map((c, idx) => {
                  const isTop = idx === 0;
                  const isElim = c.isEliminated;

                  return (
                    <div
                      key={c.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        c.isPlayer
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold ring-1 ring-cyan-400'
                          : isElim
                          ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50'
                          : isTop
                          ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                          : 'bg-slate-800/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 font-mono font-bold text-center">
                          {isTop ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <span className="text-base">{c.avatar}</span>
                        <div className="truncate">
                          <div className="truncate font-semibold">{c.name}</div>
                          <div className="text-[9px] text-slate-400 truncate">{c.school}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-mono font-bold">
                        <div>{c.score} PTS</div>
                        {isElim && <span className="text-[9px] text-rose-500">Gugur</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
              Babak {roundNumber} • Syarat Lolos: Top {roundNumber === 1 ? '6' : roundNumber === 2 ? '3' : '1'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
