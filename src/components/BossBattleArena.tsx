import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Shield, Flame, RotateCcw, Award, CheckCircle2, AlertOctagon, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';

interface BossQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  bossDamage: number;
}

const BOSS_QUESTIONS: BossQuestion[] = [
  {
    id: 'bq1',
    topic: 'Biomagnifikasi Polutan Non-Biodegradable',
    question: 'Di danau tercemar limbah insektisida DDT, konsentrasi DDT di air adalah 0,00005 ppm. Melalui rantai makanan (Air → Fitoplankton → Zooplankton → Ikan Kecil → Ikan Besar → Burung Elang Pemangsa Ikan), pada organisme manakah konsentrasi DDT akan mencapai tingkat paling mematikan (hingga 25 ppm)?',
    options: [
      'Burung Elang Pemangsa Ikan (Konsumen Puncak / Trofik Tertinggi)',
      'Fitoplankton (Produsen Utama)',
      'Zooplankton (Konsumen Primer)',
      'Air Danau itu sendiri'
    ],
    correctAnswer: 'Burung Elang Pemangsa Ikan (Konsumen Puncak / Trofik Tertinggi)',
    explanation: 'DDT bersifat larut dalam lemak dan tidak dapat diekskresikan. Akibat biomagnifikasi biologis, racun terakumulasi berlipat ganda di setiap tingkat trofik dan mencapai konsentrasi tertinggi hingga jutaan kali lipat pada tubuh predator puncak.',
    bossDamage: 200,
  },
  {
    id: 'bq2',
    topic: 'Krisis Eutrofikasi & Dead Zone Perairan',
    question: 'Limbah fosfat deterjen dan pupuk NPK memicu ledakan alga (blooming alga) di muara sungai. Saat alga mati secara massal, mengapa kadar Oksigen Terlarut (DO) air anjlok drastis hingga menyebabkan kematian massal ikan?',
    options: [
      'Bakteri pengurai aerobik mengonsumsi hampir seluruh oksigen terlarut untuk membusukkan jutaan ton bangkai alga',
      'Alga yang mati mengeluarkan racun gas karbon monoksida ke dalam air',
      'Air menjadi terlalu dingin sehingga oksigen membeku',
      'Ikan-ikan berebut memakan bangkai alga hingga kelelahan'
    ],
    correctAnswer: 'Bakteri pengurai aerobik mengonsumsi hampir seluruh oksigen terlarut untuk membusukkan jutaan ton bangkai alga',
    explanation: 'Pembusukan biomassa alga dalam jumlah raksasa memicu lonjakan populasi bakteri dekomposer aerobik yang menguras habis stok oksigen terlarut (Biological Oxygen Demand/BOD melonjak), menciptakan zona mati (Dead Zone) tanpa oksigen.',
    bossDamage: 200,
  },
  {
    id: 'bq3',
    topic: 'Umpan Balik Positif Pemanasan Global (Climate Feedback Loop)',
    question: 'Mencairnya lapisan es kutub dan tanah beku abadi (permafrost) akibat kenaikan suhu bumi melepaskan miliaran ton gas Metana (CH4) purba. Fenomena ini mempercepat pemanasan global lebih dahsyat lagi. Hubungan ini dikenal sebagai...',
    options: [
      'Positive Climate Feedback Loop (Umpan balik penguatan krisis iklim)',
      'Negative Ecological Homeostasis',
      'Suksesi Sekunder Klimaks',
      'Asidifikasi Selektif Daratan'
    ],
    correctAnswer: 'Positive Climate Feedback Loop (Umpan balik penguatan krisis iklim)',
    explanation: 'Loop umpan balik positif adalah siklus di mana dampak dari suatu pemanasan (mencairnya permafrost melepaskan metana) justru semakin memperparah penyebab awalnya, memicu percepatan pemanasan global tak terbendung.',
    bossDamage: 200,
  },
  {
    id: 'bq4',
    topic: 'Fitoremediasi Lahan Kritis Merkuri',
    question: 'Sebuah kawasan bekas tambang emas liar tercemar logam berat Merkuri (Hg) berkonsentrasi tinggi. Tanaman apakah yang paling efektif digunakan sebagai hiperakumulator untuk menyerap dan menstabilkan merkuri dari tanah?',
    options: [
      'Eceng Gondok, Bunga Matahari (Helianthus annuus), dan Tanaman Vetiver',
      'Pohon Kaktus Padang Pasir',
      'Lumut Kerak Endolitik',
      'Tumbuhan Tali Putri Parasit'
    ],
    correctAnswer: 'Eceng Gondok, Bunga Matahari (Helianthus annuus), dan Tanaman Vetiver',
    explanation: 'Tanaman hiperakumulator memiliki struktur akar khusus dan protein fitokhelatin yang mampu mengikat ion logam berat beracun tanpa merusak sel tumbuhan, membersihkan tanah secara alami melalui fitoremediasi.',
    bossDamage: 200,
  },
  {
    id: 'bq5',
    topic: 'Pemulihan Trophic Cascade Ekosistem',
    question: 'CRITICAL FINAL STRIKE: Di sebuah suaka hutan lindung, populasi babi hutan meledak tak terkendali dan merusak 70% tunas pohon baru karena Harimau Sumatera punah lokal. Langkah konservasi biologis mutakhir yang paling tepat untuk memulihkan keseimbangan ekosistem hutan tersebut adalah...',
    options: [
      'Reintroduksi predator puncak Harimau Sumatera melalui koridor satwa terpadu dan perlindungan habitat ketat',
      'Menyebarkan racun sianida di seluruh area hutan',
      'Menebang semua pohon tua dan menggantinya dengan rumput gajah',
      'Membangun pabrik pagar beton di dalam hutan'
    ],
    correctAnswer: 'Reintroduksi predator puncak Harimau Sumatera melalui koridor satwa terpadu dan perlindungan habitat ketat',
    explanation: 'Pengembalian predator puncak (Apex Predator Reintroduction) memulihkan kontrol regulasi Top-Down trophic cascade, menyeimbangkan populasi herbivora sehingga regenerasi vegetasi hutan alami dapat kembali pulih berkelanjutan.',
    bossDamage: 200,
  },
];

interface Props {
  onVictory: (xpEarned: number, coinsEarned: number, badgeId: string) => void;
  onBack: () => void;
}

export const BossBattleArena: React.FC<Props> = ({ onVictory, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [bossHp, setBossHp] = useState(1000);
  const [playerHp, setPlayerHp] = useState(100);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(40);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [bossTaunt, setBossTaunt] = useState('Akulah Raja Polusi! Kabut beracun dan limbahku akan menelan seluruh biosfer Nusantara!');
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeated, setIsDefeated] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);

  const currentQ = BOSS_QUESTIONS[currentIdx];

  // Timer per question
  useEffect(() => {
    if (isVictory || isDefeated || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, isVictory, isDefeated, feedback]);

  const handleTimeOut = () => {
    soundManager.playBossHit();
    const newPlayerHp = Math.max(0, playerHp - 35);
    setPlayerHp(newPlayerHp);
    setBossTaunt('Terlalu lambat! Racun kabut asamku mengikis energimu! Hahaha!');
    setFeedback({
      isCorrect: false,
      text: `Waktu habis! Jawaban yang benar adalah: ${currentQ.correctAnswer}. ${currentQ.explanation}`,
    });

    if (newPlayerHp <= 0) {
      setIsDefeated(true);
      soundManager.playWrong();
    }
  };

  const handleSelectAnswer = (option: string) => {
    if (feedback || isVictory || isDefeated) return;
    setSelectedOption(option);

    if (option === currentQ.correctAnswer) {
      soundManager.playBossHit();
      soundManager.playCorrect();
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 500);

      const newBossHp = Math.max(0, bossHp - currentQ.bossDamage);
      setBossHp(newBossHp);

      const taunts = [
        'Aaargh! Pemahaman sainsmu memurnikan racunku!',
        'Tidak mungkin! Pengetahuan ekologimu terlalu kuat!',
        'Kabut asap dan limbahku... mulai terserap fitoremediasi!',
        'Daya tahan biosfermu menembus pertahananku!',
        'TIDAAAK! Keseimbangan ekosistem telah pulih kembali!!',
      ];
      setBossTaunt(taunts[currentIdx] || 'Aaargh!');

      setFeedback({
        isCorrect: true,
        text: `SERANGAN KRITIKAL! (-${currentQ.bossDamage} HP Boss). ${currentQ.explanation}`,
      });

      if (newBossHp <= 0 || currentIdx === BOSS_QUESTIONS.length - 1) {
        setTimeout(() => {
          setIsVictory(true);
          soundManager.playVictory();
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }, 1200);
      }
    } else {
      soundManager.playWrong();
      const newPlayerHp = Math.max(0, playerHp - 30);
      setPlayerHp(newPlayerHp);
      setBossTaunt('Salah perhitungan! Rasakan serangan asam sulfat pekatku!');
      setFeedback({
        isCorrect: false,
        text: `Serangan Gagal! Jawaban yang tepat: ${currentQ.correctAnswer}. ${currentQ.explanation}`,
      });

      if (newPlayerHp <= 0) {
        setTimeout(() => setIsDefeated(true), 600);
      }
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setFeedback(null);
    setSelectedOption(null);
    setTimeLeft(40);
    if (currentIdx + 1 < BOSS_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setBossHp(1000);
    setPlayerHp(100);
    setSelectedOption(null);
    setTimeLeft(40);
    setFeedback(null);
    setIsVictory(false);
    setIsDefeated(false);
    setBossTaunt('Akulah Raja Polusi! Kabut beracun dan limbahku akan menelan seluruh biosfer Nusantara!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-950 border-2 border-rose-600/50 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      {/* Background Animated Gradient Aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-950/30 via-slate-950/80 to-slate-950 pointer-events-none" />

      {/* Arena Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-rose-900/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">☠️</span>
            <h2 className="text-xl sm:text-2xl font-black text-rose-400 tracking-wide uppercase">
              Boss Battle: Raja Polusi (The Smog Overlord)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Jawab 5 pertanyaan HOTS Ekologi Terpadu untuk memurnikan biosfer Nusantara!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-full font-mono text-sm font-bold flex items-center gap-1.5 border ${
            timeLeft <= 10 ? 'bg-rose-950 border-rose-500 text-rose-300 animate-bounce' : 'bg-slate-900 border-slate-700 text-amber-300'
          }`}>
            <Timer className="w-4 h-4" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Kabur ke Menu
          </button>
        </div>
      </div>

      {/* Duel Health Bars & Avatars */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Boss Status */}
        <motion.div
          animate={isAttacking ? { x: [-10, 10, -5, 5, 0] } : {}}
          className="p-4 bg-rose-950/60 border-2 border-rose-600/70 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl p-1.5 bg-slate-900 rounded-xl border border-rose-500/50">👹</span>
              <div>
                <div className="font-bold text-rose-300 text-sm">RAJA POLUSI</div>
                <div className="text-[10px] text-rose-400 font-mono">Tingkat Ancaman: Biosfer Apokalips</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-rose-300">{bossHp} / 1000 HP</span>
          </div>
          <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-rose-900">
            <div
              className="h-full bg-gradient-to-r from-rose-600 to-red-500 transition-all duration-500 shadow-lg shadow-rose-600/50"
              style={{ width: `${(bossHp / 1000) * 100}%` }}
            />
          </div>
          <div className="mt-3 p-2 bg-slate-900/80 rounded-lg text-xs text-rose-200 italic border border-rose-900/50 flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>"{bossTaunt}"</span>
          </div>
        </motion.div>

        {/* Player Status */}
        <div className="p-4 bg-emerald-950/60 border-2 border-emerald-500/70 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl p-1.5 bg-slate-900 rounded-xl border border-emerald-500/50">🛡️</span>
              <div>
                <div className="font-bold text-emerald-300 text-sm">CHAMPION IPA X (KAMU)</div>
                <div className="text-[10px] text-emerald-400 font-mono">Aura Pelindung Ekologi Aktif</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300">{playerHp} / 100 HP</span>
          </div>
          <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-emerald-900">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500 shadow-lg shadow-emerald-500/50"
              style={{ width: `${playerHp}%` }}
            />
          </div>
          <div className="mt-3 p-2 bg-slate-900/80 rounded-lg text-xs text-emerald-200 border border-emerald-900/50 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Ronde Soal {currentIdx + 1} / 5
            </span>
            <span className="font-mono text-cyan-300">Damage: 200 HP / Soal</span>
          </div>
        </div>
      </div>

      {/* Main Battle Arena Content */}
      {!isVictory && !isDefeated && currentQ && (
        <div className="relative z-10">
          {/* Question Card */}
          <div className="p-6 bg-slate-900/90 border border-slate-700 rounded-2xl mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs px-2.5 py-1 bg-rose-950 border border-rose-700 text-rose-300 rounded-md font-mono font-bold">
                Tantangan HOTS #{currentIdx + 1}: {currentQ.topic}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Time Attack 40s
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed mt-2">
              {currentQ.question}
            </p>
          </div>

          {/* Feedback Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-xl mb-4 border ${
                  feedback.isCorrect ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' : 'bg-rose-950/90 border-rose-500 text-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">{feedback.isCorrect ? '💥 STRIKE SUKSES!' : '⚠️ SERANGAN MELESET!'}</span>{' '}
                    {feedback.text}
                  </div>
                  {bossHp > 0 && currentIdx < BOSS_QUESTIONS.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold shrink-0 shadow"
                    >
                      Lanjut Serangan 👉
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === opt;
              const isCorrect = feedback && opt === currentQ.correctAnswer;
              const isWrong = feedback && isChosen && !feedback.isCorrect;

              return (
                <motion.button
                  key={idx}
                  disabled={!!feedback}
                  whileHover={!feedback ? { scale: 1.01 } : {}}
                  whileTap={!feedback ? { scale: 0.99 } : {}}
                  onClick={() => handleSelectAnswer(opt)}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400'
                      : isWrong
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500'
                      : feedback
                      ? 'opacity-50 bg-slate-900/60 border-slate-800 text-slate-400'
                      : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-slate-200 shadow'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs shrink-0 font-mono">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Victory Modal Screen */}
      {isVictory && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-20 text-center py-10 bg-gradient-to-b from-emerald-950/95 via-slate-900/95 to-slate-950 border-2 border-emerald-400 rounded-3xl p-8 shadow-2xl"
        >
          <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-4 text-emerald-300 ring-4 ring-emerald-500/30 animate-bounce">
            <Award className="w-12 h-12" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-amber-300 mb-2">
            VICTORY! RAJA POLUSI TUMBANG!
          </h2>
          <p className="text-sm sm:text-base text-emerald-200 max-w-lg mx-auto mb-6">
            Selamat! Berkat penguasaan konsep ekologi, biomagnifikasi, fitoremediasi, dan pemulihan trofik, kamu berhasil memurnikan kembali seluruh biosfer Nusantara!
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400 rounded-xl text-amber-300 font-bold text-sm mb-6">
            <span>🎖️ Membuka Badge Eksklusif:</span>
            <span className="text-white font-extrabold">"Pembasmi Raja Polusi"</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onVictory(500, 250, 'badge_pollution_slayer')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-base flex items-center gap-2 shadow-xl shadow-emerald-500/40 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              Klaim Hadiah Kampiun (+500 XP & +250 Koin)
            </button>
            <button
              onClick={handleRestart}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Tanding Ulang
            </button>
          </div>
        </motion.div>
      )}

      {/* Defeat Modal Screen */}
      {isDefeated && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-20 text-center py-10 bg-slate-950/95 border-2 border-rose-600 rounded-3xl p-8"
        >
          <div className="text-6xl mb-3">☠️</div>
          <h2 className="text-3xl font-black text-rose-400 mb-2">DEFEAT! KABUT POLUSI MENELAN</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            HP-mu terkuras habis oleh serangan racun Raja Polusi. Pelajari kembali materi pencemaran air, udara, dan biomagnifikasi sebelum menantang lagi!
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-rose-600/40"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
            <button
              onClick={onBack}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm"
            >
              Kembali ke Menu
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
