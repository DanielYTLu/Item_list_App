import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { CheckCheck, Truck } from 'lucide-react';
import { Settings } from 'lucide-react';

import { Package, MapPin, ShoppingCart, Clock, PlusCircle, ArrowRight, Heart, Layers, BarChart3, UserCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useItemStore();
  const { spaces } = useSpaceStore();
  const { shoppingList } = useShoppingListStore();

  const now = new Date();
  const expiredCount = items.filter(item => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    return expiry.getTime() < now.getTime();
  }).length;

  const uncheckedShoppingCount = shoppingList.filter(i => !i.checked).length;
  const lentCount = items.filter(i => i.status === 'lent').length;
  const favoriteItems = items.filter(i => i.favorite);

  return (
    <div className="space-y-6 pb-24">
      {/* 歡迎橫幅 */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md relative">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold">歡迎回到 宿物</h2>
            <p className="text-emerald-100 text-xs mt-1">你的東西，我幫你記得。</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-sm transition flex items-center gap-1.5 text-white"
            >
              <Settings size={14} /> 設定
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Package size={22} className="text-white" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20 text-center">
          <div>
            <div className="text-lg font-bold">{items.length}</div>
            <div className="text-[11px] text-emerald-100">總物品數</div>
          </div>
          <div>
            <div className="text-lg font-bold">{spaces.length}</div>
            <div className="text-[11px] text-emerald-100">管理空間</div>
          </div>
          <div>
            <div className="text-lg font-bold">{expiredCount}</div>
            <div className="text-[11px] text-emerald-100">過期提醒</div>
          </div>
        </div>
      </div>

      {/* 功能導航網格 (Quick Access) */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">功能快捷導航</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/spaces')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><MapPin size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">空間與位置</h4><p className="text-[11px] text-gray-400">管理房間與抽屜</p></div>
          </button>
          <button onClick={() => navigate('/inventory')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Layers size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">庫存與消耗品</h4><p className="text-[11px] text-gray-400">數量管控與補貨</p></div>
          </button>
          <button onClick={() => navigate('/lists')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><ShoppingCart size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">購物清單</h4><p className="text-[11px] text-gray-400">待買清單 ({uncheckedShoppingCount})</p></div>
          </button>
          <button onClick={() => navigate('/expiry')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><Clock size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">到期與提醒</h4><p className="text-[11px] text-gray-400">期限檢視 ({expiredCount})</p></div>
          </button>
          <button onClick={() => navigate('/loans')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center"><UserCheck size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">借出管理</h4><p className="text-[11px] text-gray-400">借出紀錄 ({lentCount})</p></div>
          </button>
          <button onClick={() => navigate('/audit')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCheck size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">清點盤點</h4><p className="text-[11px] text-gray-400">核對空間與在位狀態</p></div>
          </button>
          <button onClick={() => navigate('/moving')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Truck size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">搬家模式</h4><p className="text-[11px] text-gray-400">打包行李與進度追蹤</p></div>
          </button>
        </div>
      </div>
      {/* 統計與儀表板快捷卡片 */}
      <div 
        onClick={() => navigate('/stats')}
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all group"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
            <BarChart3 size={22} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">統計與儀表板</h4>
            <p className="text-[11px] text-gray-400">檢視物品總數、分類佔比與空間分佈統計</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
      </div>



      {/* 快速新增動作列 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center"><PlusCircle size={24} /></div>
          <div><h4 className="font-bold text-emerald-900 text-sm">新增隨身物品</h4><p className="text-xs text-emerald-700">記錄位置、分類與期限</p></div>
        </div>
        <button onClick={() => navigate('/add')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">立即新增</button>
      </div>
      {/* 收藏物品預覽 */}
      {favoriteItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Heart size={16} className="text-rose-500 fill-rose-500" /> 我的收藏
            </h3>
            <button 
              onClick={() => navigate('/items')} 
              className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              查看全部 <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {favoriteItems.slice(0, 3).map(item => (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
              >
                <div className="flex items-center space-x-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <Package size={20} />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.category}</p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
