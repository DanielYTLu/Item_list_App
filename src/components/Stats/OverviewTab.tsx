import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, Heart, AlertTriangle, Layers, PieChart, CheckCircle2 } from 'lucide-react';
import { Space, Location } from '../../types/space';

interface OverviewTabProps {
  totalItems: number;
  totalValue: number;
  favoriteCount: number;
  expiredCount: number;
  lowStockCount: number;
  spaces: Space[];
  locations: Location[];
  categoryCount: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  totalItems,
  totalValue,
  favoriteCount,
  expiredCount,
  lowStockCount,
  spaces,
  locations,
  categoryCount
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* 總結數字卡片 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-100 font-medium">物品總數</span>
            <Package size={20} className="text-emerald-200" />
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black">{totalItems}</div>
            <div className="text-[11px] text-emerald-100 mt-0.5">件建檔物品</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-4 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-teal-100 font-medium">估算總價值</span>
            <TrendingUp size={20} className="text-teal-200" />
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black">NT$ {totalValue.toLocaleString()}</div>
            <div className="text-[11px] text-teal-100 mt-0.5">物品加總總值</div>
          </div>
        </div>
      </div>

      {/* 次要指標快速連結 */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          onClick={() => navigate('/items')}
          className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center cursor-pointer hover:border-emerald-500 transition-all"
        >
          <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-1">
            <Heart size={16} />
          </div>
          <div className="text-lg font-bold text-gray-800">{favoriteCount}</div>
          <div className="text-[11px] text-gray-400">收藏最愛</div>
        </div>

        <div 
          onClick={() => navigate('/expiry')}
          className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center cursor-pointer hover:border-red-500 transition-all"
        >
          <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-1">
            <AlertTriangle size={16} />
          </div>
          <div className="text-lg font-bold text-red-600">{expiredCount}</div>
          <div className="text-[11px] text-gray-400">過期提醒</div>
        </div>

        <div 
          onClick={() => navigate('/inventory')}
          className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm text-center cursor-pointer hover:border-blue-500 transition-all"
        >
          <div className="w-8 h-8 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
            <Layers size={16} />
          </div>
          <div className="text-lg font-bold text-blue-600">{lowStockCount}</div>
          <div className="text-[11px] text-gray-400">庫存偏低</div>
        </div>
      </div>

      {/* 系統健康與統計摘要 */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <PieChart size={16} className="text-teal-600" /> 系統健康與統計摘要
        </h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span>管理中的空間數量</span>
            <span className="font-bold text-gray-800">{spaces.length} 個空間</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span>建立的細部位置/抽屜</span>
            <span className="font-bold text-gray-800">{locations.length} 個位置</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span>已有分類數量</span>
            <span className="font-bold text-gray-800">{categoryCount} 種分類</span>
          </div>
          <div className="flex justify-between items-center py-1.5">
            <span>空間完整度</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={14} /> 運作良好
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
