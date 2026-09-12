import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Clock, AlertTriangle, CheckCircle, Bell, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ExpiryPage() {
  const navigate = useNavigate();
  const { items } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  const [filter, setFilter] = useState<'all' | 'expired' | 'expiring' | 'normal'>('all');

  const now = new Date();
  const expiryItems = items.filter(item => item.expiryDate);

  const processedItems = expiryItems.map(item => {
    const expiry = new Date(item.expiryDate!);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status: 'expired' | 'expiring' | 'normal' = 'normal';
    if (diffDays < 0) {
      status = 'expired';
    } else if (diffDays <= 3) {
      status = 'expiring';
    }

    return {
      ...item,
      diffDays,
      statusType: status
    };
  });

  const filteredItems = processedItems.filter(item => {
    if (filter === 'expired') return item.statusType === 'expired';
    if (filter === 'expiring') return item.statusType === 'expiring';
    if (filter === 'normal') return item.statusType === 'normal';
    return true;
  });

  const expiredCount = processedItems.filter(i => i.statusType === 'expired').length;
  const expiringCount = processedItems.filter(i => i.statusType === 'expiring').length;

  const getSpaceName = (spaceId: string) => spaces.find(s => s.id === spaceId)?.name || '未知空間';
  const getLocationName = (locationId: string) => locations.find(l => l.id === locationId)?.name || '未知位置';


  return (
    <div className="max-w-md mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock className="text-emerald-600" size={24} />
          <h1 className="text-xl font-bold">有效期限與提醒</h1>
        </div>
      </div>

      {/* 狀態總覽卡片 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={28} />
          <div>
            <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
            <div className="text-xs text-red-700 font-medium">已過期物品</div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-500" size={28} />
          <div>
            <div className="text-2xl font-bold text-amber-600">{expiringCount}</div>
            <div className="text-xs text-amber-700 font-medium">即將到期 (3天內)</div>
          </div>
        </div>
      </div>

      {/* 篩選標籤 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部 ({processedItems.length})
        </button>
        <button
          onClick={() => setFilter('expired')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'expired'
              ? 'bg-red-600 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          已過期 ({expiredCount})
        </button>
        <button
          onClick={() => setFilter('expiring')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'expiring'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
          }`}
        >
          即將到期 ({expiringCount})
        </button>
        <button
          onClick={() => setFilter('normal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'normal'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          正常
        </button>
      </div>

      {/* 物品清單 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <CheckCircle className="mx-auto text-emerald-400 mb-2" size={48} />
          <p className="text-gray-500 font-medium">目前沒有符合條件的有效期限物品</p>
          <p className="text-xs text-gray-400 mt-1">在新增物品時可設定有效期限與提醒</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map(item => {
            let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            let badgeText = `剩餘 ${item.diffDays} 天`;

            if (item.statusType === 'expired') {
              badgeColor = 'bg-red-100 text-red-800 border-red-200';
              badgeText = `已過期 ${Math.abs(item.diffDays)} 天`;
            } else if (item.statusType === 'expiring') {
              badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
              badgeText = item.diffDays === 0 ? '今天到期' : `剩餘 ${item.diffDays} 天`;
            }

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <Clock size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {getSpaceName(item.spaceId)} › {getLocationName(item.locationId)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}>
                        {badgeText}
                      </span>
                      {item.reminderEnabled && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <Bell size={12} /> 已設提醒
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
