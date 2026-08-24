import React, { useState, useEffect } from 'react';
import { GameView, Mission, PlayerProfile, ShopItem } from './types';
import { loadPlayerProfile, savePlayerProfile, addXpAndCoins, feedPet, buyShopItem, unlockBadge } from './utils/storage';
import { soundManager } from './utils/soundEffects';

// Subcomponents
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { WorldMap } from './components/WorldMap';
import { QuestionArena } from './components/QuestionArena';
import { MiniGamesHub } from './components/MiniGamesHub';
import { EcosystemBuilderGame } from './components/MiniGames/EcosystemBuilderGame';
import { FoodChainRaceGame } from './components/MiniGames/FoodChainRaceGame';
import { BioticAbioticHuntGame } from './components/MiniGames/BioticAbioticHuntGame';
import { SaveTheForestGame } from './components/MiniGames/SaveTheForestGame';
import { BiogeochemicalPuzzleGame } from './components/MiniGames/BiogeochemicalPuzzleGame';
import { BossBattleArena } from './components/BossBattleArena';
import { DuelMode } from './components/DuelMode';
import { TournamentMode } from './components/TournamentMode';
import { DailyChallenge } from './components/DailyChallenge';
import { Leaderboard } from './components/Leaderboard';
import { BadgesView } from './components/BadgesView';
import { ShopView } from './components/ShopView';
import { ProfileView } from './components/ProfileView';
import { LuckySpinModal } from './components/LuckySpinModal';
import { DailyRewardModal } from './components/DailyRewardModal';

export const App: React.FC = () => {
  const [player, setPlayer] = useState<PlayerProfile>(() => loadPlayerProfile());
  const [currentView, setCurrentView] = useState<GameView>('dashboard');
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Modals
  const [isLuckySpinOpen, setIsLuckySpinOpen] = useState(false);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    savePlayerProfile(player);
  }, [player]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  const handleNavigate = (view: GameView) => {
    setCurrentView(view);
    setActiveMission(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMission = (mission: Mission) => {
    setActiveMission(mission);
    setCurrentView('question_arena');
  };

  const handleMissionComplete = (
    missionId: string,
    stars: number,
    totalXp: number,
    totalCoins: number,
    correctAnswers: number,
    topic: string
  ) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, totalXp, totalCoins);

      // Record completed mission
      const completedSet = new Set(prev.completedMissionIds);
      completedSet.add(missionId);

      // Record stars
      const newStars = { ...prev.missionStars, [missionId]: Math.max(prev.missionStars[missionId] || 0, stars) };

      // Record topic stats
      const currentStats = prev.topicStats[topic] || { total: 0, correct: 0 };
      const updatedTopicStats = {
        ...prev.topicStats,
        [topic]: {
          total: currentStats.total + (activeMission?.questions.length || 5),
          correct: currentStats.correct + correctAnswers,
        },
      };

      // Check badges unlocks
      if (completedSet.size >= 1) updated = unlockBadge(updated, 'badge_first_win');
      if (completedSet.size >= 6) updated = unlockBadge(updated, 'badge_world1_master');
      if (completedSet.size >= 12) updated = unlockBadge(updated, 'badge_biotic_pro');
      if (completedSet.size >= 18) updated = unlockBadge(updated, 'badge_food_web');
      if (completedSet.size >= 36) updated = unlockBadge(updated, 'badge_eco_grandmaster');

      return {
        ...updated,
        completedMissionIds: Array.from(completedSet),
        missionStars: newStars,
        topicStats: updatedTopicStats,
      };
    });
  };

  const handleMiniGameComplete = (score: number, coins: number, badgeId?: string) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, score, coins);
      if (badgeId) {
        updated = unlockBadge(updated, badgeId);
      }
      return updated;
    });
    handleNavigate('mini_games');
  };

  const handleBossVictory = (xpEarned: number, coinsEarned: number, badgeId: string) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, xpEarned, coinsEarned);
      updated = unlockBadge(updated, badgeId);
      return updated;
    });
  };

  const handleDuelVictory = (xpEarned: number, coinsEarned: number) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, xpEarned, coinsEarned);
      updated = unlockBadge(updated, 'badge_duel_king');
      return updated;
    });
  };

  const handleTournamentVictory = (xpEarned: number, coinsEarned: number, badgeId?: string) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, xpEarned, coinsEarned);
      if (badgeId) updated = unlockBadge(updated, badgeId);
      return updated;
    });
  };

  const handleFeedPet = () => {
    if (player.coins < 50) {
      soundManager.playWrong();
      return;
    }
    setPlayer((prev) => feedPet(prev));
  };

  const handleBuyShopItem = (item: ShopItem) => {
    setPlayer((prev) => buyShopItem(prev, item));
  };

  const handleEquipTitle = (title: string) => {
    setPlayer((prev) => ({ ...prev, equippedTitle: title }));
  };

  const handleUpdateProfile = (name: string, school: string, avatar: string) => {
    setPlayer((prev) => ({ ...prev, name, school, avatar }));
  };

  const handleClaimDailyReward = (day: number, xpReward: number, coinReward: number) => {
    setPlayer((prev) => {
      let updated = addXpAndCoins(prev, xpReward, coinReward);
      updated.streakDays = prev.streakDays + 1;
      if (updated.streakDays >= 7) {
        updated = unlockBadge(updated, 'badge_streak_7');
      }
      return updated;
    });
    setIsDailyRewardOpen(false);
  };

  const handleLuckySpinWon = (reward: { type: 'xp' | 'coins' | 'energy'; amount: number; label: string }) => {
    setPlayer((prev) => {
      if (reward.type === 'xp') return addXpAndCoins(prev, reward.amount, 0);
      if (reward.type === 'coins') return addXpAndCoins(prev, 0, reward.amount);
      if (reward.type === 'energy') return { ...prev, energy: Math.min(100, prev.energy + reward.amount) };
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Immersive Atmospheric Ambient Backdrops */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, #10b981 0%, transparent 45%), radial-gradient(circle at 0% 100%, #3b82f6 0%, transparent 40%), radial-gradient(circle at 100% 60%, #8b5cf6 0%, transparent 40%)',
        }}
      />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Navbar */}
      <div className="relative z-30">
        <Navbar
          player={player}
          currentView={currentView}
          isMuted={isMuted}
          onNavigate={handleNavigate}
          onToggleMute={handleToggleMute}
          onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
          onOpenDailyReward={() => setIsDailyRewardOpen(true)}
        />
      </div>

      {/* Main Container View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 relative z-10">
        {currentView === 'dashboard' && (
          <Dashboard
            player={player}
            onNavigate={handleNavigate}
            onOpenLuckySpin={() => setIsLuckySpinOpen(true)}
            onOpenDailyReward={() => setIsDailyRewardOpen(true)}
            onFeedPet={handleFeedPet}
          />
        )}

        {currentView === 'world_map' && (
          <WorldMap
            player={player}
            onSelectMission={handleStartMission}
            onSelectBossBattle={() => handleNavigate('boss_battle')}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'question_arena' && activeMission && (
          <QuestionArena
            mission={activeMission}
            onMissionComplete={handleMissionComplete}
            onExit={() => handleNavigate('world_map')}
          />
        )}

        {currentView === 'mini_games' && (
          <MiniGamesHub onSelectMiniGame={(gameId) => handleNavigate(gameId as GameView)} />
        )}

        {currentView === 'game_ecosystem' && (
          <EcosystemBuilderGame
            onComplete={(score, coins) => handleMiniGameComplete(score, coins, 'badge_forest_builder')}
            onBack={() => handleNavigate('mini_games')}
          />
        )}

        {currentView === 'game_foodchain' && (
          <FoodChainRaceGame
            onComplete={(score, coins) => handleMiniGameComplete(score, coins, 'badge_food_web')}
            onBack={() => handleNavigate('mini_games')}
          />
        )}

        {currentView === 'game_hunt' && (
          <BioticAbioticHuntGame
            onComplete={(score, coins) => handleMiniGameComplete(score, coins, 'badge_biotic_pro')}
            onBack={() => handleNavigate('mini_games')}
          />
        )}

        {currentView === 'game_forest' && (
          <SaveTheForestGame
            onComplete={(score, coins) => handleMiniGameComplete(score, coins, 'badge_guardian')}
            onBack={() => handleNavigate('mini_games')}
          />
        )}

        {currentView === 'game_puzzle' && (
          <BiogeochemicalPuzzleGame
            onComplete={(score, coins) => handleMiniGameComplete(score, coins, 'badge_carbon_master')}
            onBack={() => handleNavigate('mini_games')}
          />
        )}

        {currentView === 'boss_battle' && (
          <BossBattleArena
            onVictory={handleBossVictory}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'duel_mode' && (
          <DuelMode
            player={player}
            onVictory={handleDuelVictory}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'tournament_mode' && (
          <TournamentMode
            player={player}
            onVictory={handleTournamentVictory}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'daily_challenge' && (
          <DailyChallenge
            player={player}
            onComplete={(xp, coins) => {
              setPlayer((prev) => addXpAndCoins(prev, xp, coins));
              handleNavigate('dashboard');
            }}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard player={player} onBack={() => handleNavigate('dashboard')} />
        )}

        {currentView === 'badges' && (
          <BadgesView
            player={player}
            onEquipTitle={handleEquipTitle}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            player={player}
            onBuyItem={handleBuyShopItem}
            onFeedPet={handleFeedPet}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            player={player}
            onUpdateProfile={handleUpdateProfile}
            onFeedPet={handleFeedPet}
            onBack={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Modals */}
      <LuckySpinModal
        isOpen={isLuckySpinOpen}
        onClose={() => setIsLuckySpinOpen(false)}
        onRewardWon={handleLuckySpinWon}
      />

      <DailyRewardModal
        isOpen={isDailyRewardOpen}
        player={player}
        onClose={() => setIsDailyRewardOpen(false)}
        onClaimDaily={handleClaimDailyReward}
      />
    </div>
  );
};
export default App;
