import React, { useState } from 'react';
import { TutorialModal } from '../../components/Onboarding/TutorialModal';
import { BookOpen, Settings, CheckCheck, Truck, Package, MapPin, ArrowRight, Heart, BarChart3, Layers, ShoppingCart, Clock, UserCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';

export const HomePage: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
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
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      
      {/* 歡迎橫幅 (Welcome Banner) 升級質感 */}
      <div className="welcome-banner-spotlight bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden ring-1 ring-white/20">
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-teal-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-[11px] font-semibold mb-2 border border-white/20 shadow-2xs">
              <Sparkles size={12} className="text-emerald-200 animate-pulse" /> 智能居家收納
            </div>
            <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">歡迎回到宿物</h2>
            <p className="text-emerald-100/90 text-xs mt-0.5 font-normal">你的東西，我幫你記得。</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className="settings-btn-spotlight bg-white/15 hover:bg-white/25 active:scale-95 px-3 py-2 rounded-xl text-xs font-medium backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 text-white border border-white/20 shadow-2xs"
            >
              <Settings size={14} /> 設定
            </button>
            <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/25 shadow-sm">
              <Package size={22} className="text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/15 relative z-10">
          <div 
            onClick={() => navigate('/items')}
            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all duration-200 p-3 rounded-2xl backdrop-blur-md border border-white/15 text-center cursor-pointer group shadow-2xs"
          >
            <div className="text-xl font-black tracking-tight group-hover:scale-105 transition-transform">{items.length}</div>
            <div className="text-[11px] text-emerald-100 font-medium mt-0.5">總物品數</div>
          </div>
          <div 
            onClick={() => navigate('/spaces')}
            className="bg-white/10 hover:bg-white/20 active:scale-[0.98] transition-all duration-200 p-3 rounded-2xl backdrop-blur-md border border-white/15 text-center cursor-pointer group shadow-2xs"
          >
            <div className="text-xl font-black tracking-tight group-hover:scale-105 transition-transform">{spaces.length}</div>
            <div className="text-[11px] text-emerald-100 font-medium mt-0.5">管理空間</div>
          </div>
          <div 
            onClick={() => navigate('/expiry')}
            className={`transition-all duration-200 p-3 rounded-2xl backdrop-blur-md text-center cursor-pointer group border shadow-2xs active:scale-[0.98] ${
              expiredCount > 0 
                ? 'bg-amber-500/25 hover:bg-amber-500/35 border-amber-300/50 text-white' 
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
          >
            <div className="text-xl font-black tracking-tight group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
              {expiredCount > 0 && <AlertTriangle size={14} className="text-amber-200 animate-bounce" />}
              {expiredCount}
            </div>
            <div className="text-[11px] text-emerald-100 font-medium mt-0.5">過期提醒</div>
          </div>
        </div>
      </div>


      {/* 功能導航網格 (Quick Access) */}
      <div className="quick-access-spotlight">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">功能快捷導航</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setShowTutorial(true)} className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shadow-sm"><BookOpen size={22} /></div>
            <div><h4 className="font-bold text-emerald-900 text-sm">新手指南</h4><p className="text-[11px] text-emerald-600">聚光燈導覽所有功能</p></div>
          </button>
          <button onClick={() => navigate('/spaces')} className="space-card-spotlight bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><MapPin size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">空間與位置</h4><p className="text-[11px] text-gray-400">管理房間與抽屜</p></div>
          </button>
          <button onClick={() => navigate('/inventory')} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Layers size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">庫存與消耗品</h4><p className="text-[11px] text-gray-400">數量管控與補貨</p></div>
          </button>
          <button onClick={() => navigate('/lists')} className="shopping-card-spotlight bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
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
          <button onClick={() => navigate('/moving')} className="moving-card-spotlight bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3 hover:border-emerald-500 transition-all text-left">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Truck size={22} /></div>
            <div><h4 className="font-bold text-gray-800 text-sm">搬家模式</h4><p className="text-[11px] text-gray-400">打包行李與進度追蹤</p></div>
          </button>
        </div>
      </div>
      {/* 統計與儀表板快捷卡片 */}
      <div 
        onClick={() => navigate('/stats')}
        className="stats-spotlight bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all group"
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



      {/* 收藏物品預覽 */}
      {favoriteItems.length > 0 && (
        <div className="favorite-items-spotlight">
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
