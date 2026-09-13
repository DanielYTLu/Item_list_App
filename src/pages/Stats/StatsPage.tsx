import React, { useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { BarChart3 } from 'lucide-react';
import { OverviewTab } from '../../components/Stats/OverviewTab';
import { CategoryTab, CategoryStat } from '../../components/Stats/CategoryTab';
import { SpaceTab, SpaceStat } from '../../components/Stats/SpaceTab';

export default function StatsPage() {
  const { items } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'space' | 'category'>('overview');

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const favoriteCount = items.filter(i => i.favorite).length;
  
  const now = new Date();
  const expiredCount = items.filter(item => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate).getTime() < now.getTime();
  }).length;

  const lowStockCount = items.filter(item => item.stockLevel === 'low' || item.stockLevel === 'out').length;

  // 分類統計
  const categoryMap: { [key: string]: { count: number; value: number } } = {};
  items.forEach(item => {
    const cat = item.category || '未分類';
    if (!categoryMap[cat]) categoryMap[cat] = { count: 0, value: 0 };
    categoryMap[cat].count += 1;
    categoryMap[cat].value += (item.price || 0) * (item.quantity || 1);
  });

  const categories: CategoryStat[] = Object.keys(categoryMap).map(cat => ({
    name: cat,
    count: categoryMap[cat].count,
    value: categoryMap[cat].value,
    percentage: totalItems > 0 ? Math.round((categoryMap[cat].count / totalItems) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  // 空間統計
  const spaceMap: { [key: string]: { count: number; value: number } } = {};
  items.forEach(item => {
    const spId = item.spaceId || 'unknown';
    if (!spaceMap[spId]) spaceMap[spId] = { count: 0, value: 0 };
    spaceMap[spId].count += 1;
    spaceMap[spId].value += (item.price || 0) * (item.quantity || 1);
  });

  const spaceStats: SpaceStat[] = spaces.map(space => {
    const data = spaceMap[space.id] || { count: 0, value: 0 };
    return {
      ...space,
      count: data.count,
      value: data.value,
      percentage: totalItems > 0 ? Math.round((data.count / totalItems) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  const unassignedCount = spaceMap['unknown']?.count || 0;
  const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="max-w-md mx-auto p-4 pb-24 space-y-6">
      <div className="stats-spotlight flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-teal-600" size={24} />
          <h1 className="text-xl font-bold text-gray-800">統計與儀表板</h1>
        </div>
        <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium border border-teal-200">
          總覽分析
        </span>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          核心概況
        </button>
        <button
          onClick={() => setActiveTab('category')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'category' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          分類佔比
        </button>
        <button
          onClick={() => setActiveTab('space')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'space' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          空間分佈
        </button>
      </div>

      {activeTab === 'overview' && (
        <OverviewTab
          totalItems={totalItems}
          totalValue={totalValue}
          favoriteCount={favoriteCount}
          expiredCount={expiredCount}
          lowStockCount={lowStockCount}
          spaces={spaces}
          locations={locations}
          categoryCount={categories.length}
        />
      )}

      {activeTab === 'category' && (
        <CategoryTab categories={categories} colors={colors} />
      )}

      {activeTab === 'space' && (
        <SpaceTab spaceStats={spaceStats} unassignedCount={unassignedCount} colors={colors} />
      )}
    </div>
  );
}
