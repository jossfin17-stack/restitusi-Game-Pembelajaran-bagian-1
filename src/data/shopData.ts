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

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'food_berry',
    name: 'Buah Bio-Berry (+30 EXP Pet)',
    category: 'pet_food',
    price: 50,
    description: 'Buah organik kaya nutrisi hutan yang mempercepat evolusi pet virtualmu.',
    icon: '🍎',
    value: '30',
  },
  {
    id: 'food_mega_nectar',
    name: 'Mega Nektar Kehidupan (+100 EXP Pet)',
    category: 'pet_food',
    price: 140,
    description: 'Nektar langka dari bunga hutan primer untuk membangkitkan aura Guardian pet.',
    icon: '🧪',
    value: '100',
  },
  {
    id: 'boost_double_xp',
    name: 'Kartu 2x XP Booster (1 Misi)',
    category: 'booster',
    price: 100,
    description: 'Menggandakan seluruh perolehan XP kamu di misi petualangan berikutnya.',
    icon: '⚡',
    value: '2x_xp',
  },
  {
    id: 'frame_emerald',
    name: 'Bingkai Emerald Rainforest',
    category: 'avatar_frame',
    price: 200,
    description: 'Bingkai profil bercahaya zamrud hutan tropis Nusantara.',
    icon: '🌿',
    value: 'border-emerald-500 shadow-emerald-500/50',
    glowColor: '#10b981',
  },
  {
    id: 'frame_cyber_cyan',
    name: 'Bingkai Cyber Neon Clash',
    category: 'avatar_frame',
    price: 350,
    description: 'Bingkai futuristik bergaya arena Clash of Champions.',
    icon: '💎',
    value: 'border-cyan-400 shadow-cyan-400/60 ring-2 ring-cyan-300',
    glowColor: '#06b6d4',
  },
  {
    id: 'frame_gold_champion',
    name: 'Bingkai Emas Grand Champion',
    category: 'avatar_frame',
    price: 600,
    description: 'Bingkai emas berkilau khusus para juara sains tertinggi.',
    icon: '👑',
    value: 'border-amber-400 shadow-amber-400/80 ring-4 ring-amber-300',
    glowColor: '#f59e0b',
  },
  {
    id: 'title_master_trophic',
    name: 'Gelar: "Pakar Tingkat Trofik"',
    category: 'title',
    price: 150,
    description: 'Gelar intelektual yang ditampilkan di bawah nama profilmu.',
    icon: '📜',
    value: 'Pakar Tingkat Trofik',
  },
  {
    id: 'title_biome_conqueror',
    name: 'Gelar: "Penakluk 6 Bioma"',
    category: 'title',
    price: 250,
    description: 'Gelar kehormatan untuk penjelajah ekosistem darat dan akuatik.',
    icon: '🌍',
    value: 'Penakluk 6 Bioma',
  },
  {
    id: 'title_supreme_champion',
    name: 'Gelar: "COC Ecology Supreme"',
    category: 'title',
    price: 500,
    description: 'Gelar prestisius yang setara dengan jawara Clash of Champions.',
    icon: '🏆',
    value: 'COC Ecology Supreme',
  },
];
