import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Coins, CheckCircle2, ArrowLeft, Sparkles, Zap, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerProfile, ShopItem } from '../types';
import { SHOP_ITEMS } from '../data/shopData';
import { soundManager } from '../utils/soundEffects';

interface Props {
  player: PlayerProfile;
  onBuyItem: (item: ShopItem) => void;
  onFeedPet: () => void;
  onBack: () => void;
}

export const ShopView: React.FC<Props> = ({ player, onBuyItem, onFeedPet, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = SHOP_ITEMS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleBuy = (item: ShopItem) => {
    if (player.coins < item.price) {
      soundManager.playWrong();
      return;
    }

    soundManager.playLevelUp();
    confetti({ particleCount: 60, spread: 60 });
    onBuyItem(item);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-950/80 border border-amber-400/40 rounded-full font-mono text-amber-300 font-bold text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{player.coins} Koin Ekologi</span>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        {[
          { id: 'all', label: 'Semua Toko' },
          { id: 'avatar_frame', label: 'Bingkai Avatar' },
          { id: 'pet_food', label: 'Pakan Eco-Pet' },
          { id: 'booster', label: 'Booster XP & Energi' },
          { id: 'title', label: 'Gelar Gelora' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory(cat.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isOwned = player.inventory.includes(item.id);
          const canAfford = player.coins >= item.price;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isOwned
                  ? 'bg-slate-900/60 border-slate-800 opacity-70'
                  : 'bg-slate-900 border-slate-700 hover:border-amber-400 shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl p-2.5 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                    {item.icon}
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                    {item.category}
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1 font-mono font-bold text-amber-300 text-sm">
                  <Coins className="w-4 h-4" />
                  <span>{item.price}</span>
                </div>

                <button
                  disabled={isOwned || !canAfford}
                  onClick={() => handleBuy(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                    isOwned
                      ? 'bg-slate-800 text-emerald-400 cursor-not-allowed border border-emerald-500/30'
                      : canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isOwned ? 'Sudah Dimiliki ✓' : canAfford ? 'Beli Item' : 'Koin Kurang'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
