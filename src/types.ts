export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'matching'
  | 'ordering'
  | 'drag_drop'
  | 'image_guess'
  | 'fill_blank'
  | 'hots_analysis'
  | 'boss_hots';

export type DifficultyLevel = 'Mudah' | 'Menengah' | 'Sulit' | 'Boss';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Question {
  id: string;
  number: number;
  worldId: number;
  missionNumber: number;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | boolean | string[] | Record<string, string>;
  explanation: string;
  funFact: string;
  xpReward: number;
  coinReward: number;
  diagramUrl?: string; // or SVG diagram descriptor
  diagramType?: 'carbon_cycle' | 'water_cycle' | 'nitrogen_cycle' | 'food_pyramid' | 'population_graph' | 'symbiosis_chart' | 'food_web' | 'organism_levels';
  orderingItems?: { id: string; text: string }[];
  matchingPairs?: MatchingPair[];
  dragDropItems?: { id: string; text: string; category: string }[];
  dragDropCategories?: string[];
  fillBlankHint?: string;
  caseStudyContext?: string;
}

export interface Mission {
  id: string;
  worldId: number;
  missionNumber: number;
  title: string;
  topic: string;
  description: string;
  questions: Question[];
  xpRequiredToUnlock: number;
  rewardBadgeId?: string;
  isBossMission?: boolean;
}

export interface World {
  id: number;
  name: string;
  subtitle: string;
  difficultyLabel: string;
  description: string;
  themeColor: string; // e.g. 'emerald', 'cyan', 'blue', 'amber', 'purple', 'rose'
  iconName: string;
  backgroundImage: string;
  topicsCovered: string[];
  missions: Mission[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'world' | 'streak' | 'combat' | 'special' | 'mastery';
  unlockedAt?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface Champion {
  id: string;
  name: string;
  nickname: string;
  schoolOrUni: string;
  avatar: string;
  specialty: string;
  iqScore: number;
  bio: string;
  winRate: number;
  baseScore: number;
}

export interface PetState {
  type: 'jalak_bali' | 'kupu_sayap_burung' | 'rusa_bawean' | 'harimau_sumatera';
  name: string;
  stage: 'egg' | 'baby' | 'juvenile' | 'guardian';
  level: number;
  exp: number;
  maxExp: number;
  hunger: number; // 0-100
  happiness: number; // 0-100
}

export interface TopicProgress {
  topic: string;
  correctCount: number;
  totalAttempted: number;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'avatar_frame' | 'title' | 'pet_food' | 'booster';
  price: number;
  description: string;
  icon: string;
  value: string;
  glowColor?: string;
}

export interface PlayerStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  highestStreak: number;
  currentStreak: number;
  fastestAnswerSec: number;
  duelsWon: number;
  duelsPlayed: number;
  tournamentsWon: number;
  bossDefeatedCount: number;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  school: string;
  level: number;
  title: string;
  equippedTitle?: string;
  currentXp: number;
  nextLevelXp: number;
  coins: number;
  energy: number;
  maxEnergy: number;
  unlockedWorldId: number;
  completedMissionIds: string[];
  missionStars: Record<string, number>; // missionId -> 1, 2, 3 stars
  unlockedBadgeIds: string[];
  unlockedTitles: string[];
  pet: PetState;
  stats: PlayerStats;
  topicProgress: Record<string, TopicProgress>;
  topicStats: Record<string, { total: number; correct: number }>;
  dailyStreak: number;
  streakDays: number;
  lastLoginDate: string;
  claimedDailyRewards: number[]; // indices of 7-day streak
  lastSpinDate: string;
  inventory: {
    avatarFrames: string[];
    selectedFrame: string;
    titles: string[];
    petFoodCount: number;
    doubleXpBoosters: number;
  };
}

export type GameView =
  | 'dashboard'
  | 'world_map'
  | 'question_arena'
  | 'boss_battle'
  | 'mini_games'
  | 'duel_mode'
  | 'tournament_mode'
  | 'daily_challenge'
  | 'leaderboard'
  | 'badges'
  | 'profile'
  | 'shop';

export type MiniGameType =
  | 'ecosystem_builder'
  | 'food_chain_race'
  | 'symbiosis_match'
  | 'biotic_abiotic_hunt'
  | 'save_the_forest'
  | 'biogeochemical_puzzle';
