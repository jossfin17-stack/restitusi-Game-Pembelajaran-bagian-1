import { PlayerProfile, ShopItem } from '../types';

const STORAGE_KEY = 'ecology_clash_of_champions_v1_data';

export const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  name: 'Champion IPA X',
  avatar: '👨‍🎓',
  school: 'SMA Negeri 1 Indonesia - Kelas X',
  level: 1,
  title: 'Novice Explorer',
  equippedTitle: 'Novice Explorer',
  currentXp: 0,
  nextLevelXp: 200,
  coins: 100,
  energy: 100,
  maxEnergy: 100,
  unlockedWorldId: 1,
  completedMissionIds: [],
  missionStars: {},
  unlockedBadgeIds: ['badge_novice'],
  unlockedTitles: ['Novice Explorer'],
  pet: {
    type: 'jalak_bali',
    name: 'Jali si Jalak Bali',
    stage: 'egg',
    level: 1,
    exp: 0,
    maxExp: 100,
    hunger: 80,
    happiness: 90,
  },
  stats: {
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    highestStreak: 0,
    currentStreak: 0,
    fastestAnswerSec: 0,
    duelsWon: 0,
    duelsPlayed: 0,
    tournamentsWon: 0,
    bossDefeatedCount: 0,
  },
  topicProgress: {
    'Karakteristik Makhluk Hidup': { topic: 'Karakteristik Makhluk Hidup', correctCount: 0, totalAttempted: 0 },
    'Tingkatan Organisasi Kehidupan': { topic: 'Tingkatan Organisasi Kehidupan', correctCount: 0, totalAttempted: 0 },
    'Komponen Biotik dan Abiotik': { topic: 'Komponen Biotik dan Abiotik', correctCount: 0, totalAttempted: 0 },
    'Keanekaragaman Hayati': { topic: 'Keanekaragaman Hayati', correctCount: 0, totalAttempted: 0 },
    'Ekosistem': { topic: 'Ekosistem', correctCount: 0, totalAttempted: 0 },
    'Adaptasi Makhluk Hidup': { topic: 'Adaptasi Makhluk Hidup', correctCount: 0, totalAttempted: 0 },
    'Rantai Makanan': { topic: 'Rantai Makanan', correctCount: 0, totalAttempted: 0 },
    'Simbiosis': { topic: 'Simbiosis', correctCount: 0, totalAttempted: 0 },
    'Aliran Energi': { topic: 'Aliran Energi', correctCount: 0, totalAttempted: 0 },
    'Piramida Ekologi': { topic: 'Piramida Ekologi', correctCount: 0, totalAttempted: 0 },
    'Interaksi Antar Makhluk Hidup': { topic: 'Interaksi Antar Makhluk Hidup', correctCount: 0, totalAttempted: 0 },
    'Pencemaran Lingkungan': { topic: 'Pencemaran Lingkungan', correctCount: 0, totalAttempted: 0 },
    'Pelestarian Lingkungan': { topic: 'Pelestarian Lingkungan', correctCount: 0, totalAttempted: 0 },
    'Perubahan Lingkungan dan Dampaknya': { topic: 'Perubahan Lingkungan dan Dampaknya', correctCount: 0, totalAttempted: 0 },
    'Daur Biogeokimia': { topic: 'Daur Biogeokimia', correctCount: 0, totalAttempted: 0 },
    'Clash of Ecology Final Grand Master': { topic: 'Clash of Ecology Final Grand Master', correctCount: 0, totalAttempted: 0 },
  },
  topicStats: {},
  dailyStreak: 1,
  streakDays: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  claimedDailyRewards: [0], // Day 1 claimed
  lastSpinDate: '',
  inventory: {
    avatarFrames: ['default'],
    selectedFrame: 'default',
    titles: ['Novice Explorer'],
    petFoodCount: 3,
    doubleXpBoosters: 1,
  },
};

export function loadPlayerProfile(): PlayerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PLAYER_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PLAYER_PROFILE, ...parsed };
  } catch {
    return INITIAL_PLAYER_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save player state', err);
  }
}

export function calculateLevelFromXp(xp: number): { level: number; title: string; currentLevelXp: number; nextLevelXp: number } {
  // Level threshold curve: 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5400, 6500...
  const thresholds = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4400, 5400, 6500, 8000, 10000];
  const titles = [
    'Novice Explorer',
    'Junior Naturalist',
    'Ecosystem Scout',
    'Biotic Sentinel',
    'Trophic Strategist',
    'Biome Navigator',
    'Eco Master',
    'Biogeo Specialist',
    'Earth Guardian',
    'Pollution Slayer',
    'Grand Ecology Champion',
    'Supreme COC Legend',
  ];

  let level = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentLevelXp = thresholds[level - 1] || 0;
  const nextLevelXp = thresholds[level] || (thresholds[thresholds.length - 1] + 2000);
  const title = titles[Math.min(level - 1, titles.length - 1)];

  return { level, title, currentLevelXp, nextLevelXp };
}

export function updatePetEvolution(pet: PlayerProfile['pet'], addedExp: number): PlayerProfile['pet'] {
  const newExp = pet.exp + addedExp;
  let newLevel = pet.level;
  let newStage = pet.stage;
  const maxExp = 100 * newLevel;

  if (newExp >= maxExp) {
    newLevel += 1;
  }

  if (newLevel >= 8) {
    newStage = 'guardian';
  } else if (newLevel >= 4) {
    newStage = 'juvenile';
  } else if (newLevel >= 2) {
    newStage = 'baby';
  } else {
    newStage = 'egg';
  }

  return {
    ...pet,
    level: newLevel,
    exp: newExp,
    maxExp: 100 * newLevel,
    stage: newStage,
    happiness: Math.min(100, pet.happiness + 5),
  };
}

export function addXpAndCoins(profile: PlayerProfile, xpToAdd: number, coinsToAdd: number): PlayerProfile {
  const totalXp = profile.currentXp + xpToAdd;
  const totalCoins = profile.coins + coinsToAdd;
  const { level, title, nextLevelXp } = calculateLevelFromXp(totalXp);
  const updatedTitles = profile.unlockedTitles ? Array.from(new Set([...profile.unlockedTitles, title])) : [title];

  let unlockedWorldId = profile.unlockedWorldId;
  if (totalXp >= 2500) unlockedWorldId = Math.max(unlockedWorldId, 6);
  else if (totalXp >= 1800) unlockedWorldId = Math.max(unlockedWorldId, 5);
  else if (totalXp >= 1200) unlockedWorldId = Math.max(unlockedWorldId, 4);
  else if (totalXp >= 700) unlockedWorldId = Math.max(unlockedWorldId, 3);
  else if (totalXp >= 300) unlockedWorldId = Math.max(unlockedWorldId, 2);

  return {
    ...profile,
    currentXp: totalXp,
    coins: totalCoins,
    level,
    title,
    nextLevelXp,
    unlockedWorldId,
    unlockedTitles: updatedTitles,
  };
}

export function feedPet(profile: PlayerProfile): PlayerProfile {
  if (profile.coins < 50) return profile;
  const updatedPet = updatePetEvolution(profile.pet, 35);
  return {
    ...profile,
    coins: profile.coins - 50,
    pet: updatedPet,
  };
}

export function buyShopItem(profile: PlayerProfile, item: ShopItem): PlayerProfile {
  if (profile.coins < item.price) return profile;
  const updatedCoins = profile.coins - item.price;
  let updated = { ...profile, coins: updatedCoins };

  if (item.category === 'pet_food') {
    const addedExp = parseInt(item.value, 10) || 30;
    updated.pet = updatePetEvolution(updated.pet, addedExp);
  } else if (item.category === 'title') {
    const titles = Array.from(new Set([...(updated.unlockedTitles || []), item.name]));
    updated.unlockedTitles = titles;
    updated.equippedTitle = item.name;
  } else if (item.category === 'booster') {
    updated.energy = Math.min(100, updated.energy + 50);
  }

  return updated;
}

export function unlockBadge(profile: PlayerProfile, badgeId: string): PlayerProfile {
  if (profile.unlockedBadgeIds.includes(badgeId)) return profile;
  return {
    ...profile,
    unlockedBadgeIds: [...profile.unlockedBadgeIds, badgeId],
  };
}
