import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, RotateCcw, ArrowLeft, CheckCheck, AlertCircle, Search, MapPin, Layers, Package 
} from 'lucide-react';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';

export const AuditPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateItem, updateAuditStatus } = useItemStore();
  const { spaces, locations } = useSpaceStore();

  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('all');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'audited' | 'pending' | 'missing'>('all');

  const availableLocations = useMemo(() => {
    if (selectedSpaceId === 'all') return locations;
    return locations.filter((loc) => loc.spaceId === selectedSpaceId);
  }, [locations, selectedSpaceId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedSpaceId !== 'all' && item.spaceId !== selectedSpaceId) return false;
      if (selectedLocationId !== 'all' && item.locationId !== selectedLocationId) return false;
      if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())) return false;
      if (statusFilter === 'audited') return !!item.lastAuditedAt && item.status !== 'missing';
      if (statusFilter === 'pending') return !item.lastAuditedAt && item.status !== 'missing';
      if (statusFilter === 'missing') return item.status === 'missing';
      return true;
    });
  }, [items, selectedSpaceId, selectedLocationId, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const scopeItems = items.filter((item) => {
      if (selectedSpaceId !== 'all' && item.spaceId !== selectedSpaceId) return false;
      if (selectedLocationId !== 'all' && item.locationId !== selectedLocationId) return false;
      return true;
    });
    const total = scopeItems.length;
    const audited = scopeItems.filter((i) => !!i.lastAuditedAt && i.status !== 'missing').length;
    const missing = scopeItems.filter((i) => i.status === 'missing').length;
    const pending = total - audited - missing;
    const percent = total > 0 ? Math.round((audited / total) * 100) : 0;
    return { total, audited, missing, pending, percent };
  }, [items, selectedSpaceId, selectedLocationId]);


  const handleMarkAudited = (id: string) => { updateAuditStatus(id, true); updateItem(id, { status: 'available' }); };
  const handleMarkMissing = (id: string) => { updateItem(id, { status: 'missing' }); };
  const handleResetItem = (id: string) => { updateAuditStatus(id, false); updateItem(id, { status: 'available' }); };
  const handleBatchAuditAll = () => { if (window.confirm('確定確認清單所有物品？')) filteredItems.forEach((i) => i.status !== 'missing' && updateAuditStatus(i.id, true)); };
  const handleResetAllAudit = () => { if (window.confirm('確定重置此範圍盤點狀態？')) filteredItems.forEach((i) => { updateAuditStatus(i.id, false); if (i.status === 'missing') updateItem(i.id, { status: 'available' }); }); };
  const getSpaceName = (id: string) => spaces.find((s) => s.id === id)?.name || '未知';
  const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || '未知';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-black text-gray-850 tracking-tight flex items-center">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full mr-2.5 shadow-sm"></span>
              清點盤點模式
            </h2>
            <p className="text-xs text-gray-500">逐一盤點清點空間內的所有物品狀態</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleResetAllAudit} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all" title="重置盤點"><RotateCcw className="w-4 h-4" /></button>
          <button onClick={handleBatchAuditAll} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-all">全部確認</button>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100/60 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700">盤點進度</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                {stats.audited} / {stats.total} 件
              </span>
            </div>
            <span className="text-sm font-black text-emerald-600">{stats.percent}%</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm" 
              style={{ width: `${stats.percent}%` }} 
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button 
              onClick={() => setStatusFilter(statusFilter === 'audited' ? 'all' : 'audited')}
              className={`p-2 rounded-xl text-center border text-[11px] transition-all ${statusFilter === 'audited' ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800 shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-gray-100/60'}`}
            >
              <div className="text-emerald-600 font-bold text-xs">{stats.audited}</div>
              <div className="text-[10px] text-gray-400">已清點</div>
            </button>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
              className={`p-2 rounded-xl text-center border text-[11px] transition-all ${statusFilter === 'pending' ? 'bg-amber-50 border-amber-300 font-bold text-amber-800 shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-gray-100/60'}`}
            >
              <div className="text-amber-600 font-bold text-xs">{stats.pending}</div>
              <div className="text-[10px] text-gray-400">待清點</div>
            </button>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'missing' ? 'all' : 'missing')}
              className={`p-2 rounded-xl text-center border text-[11px] transition-all ${statusFilter === 'missing' ? 'bg-red-50 border-red-300 font-bold text-red-800 shadow-sm' : 'bg-gray-50/50 border-gray-100 text-gray-600 hover:bg-gray-100/60'}`}
            >
              <div className="text-red-500 font-bold text-xs">{stats.missing}</div>
              <div className="text-[10px] text-gray-400">遺失/異常</div>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select value={selectedSpaceId} onChange={(e) => { setSelectedSpaceId(e.target.value); setSelectedLocationId('all'); }} className="w-full text-xs p-2 rounded-xl border">
              <option value="all">所有空間</option>{spaces.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)} className="w-full text-xs p-2 rounded-xl border">
              <option value="all">所有位置</option>{availableLocations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <input type="text" placeholder="搜尋..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full p-2 text-xs rounded-xl border" />
        </div>
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const isAudited = !!item.lastAuditedAt && item.status !== 'missing';
            const isMissing = item.status === 'missing';
            return (
              <div key={item.id} className={`bg-white rounded-2xl p-3 border flex items-center justify-between ${isAudited ? 'border-green-200' : isMissing ? 'border-red-200' : ''}`}>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">{item.name}</div>
                  <div className="text-[10px] text-gray-400">{getSpaceName(item.spaceId)} • {getLocationName(item.locationId)}</div>
                </div>
                <div className="flex gap-1">
                  {isAudited ? <button onClick={() => handleResetItem(item.id)} className="p-2 bg-green-50 rounded-xl text-softGreen"><CheckCircle2 /></button> : isMissing ? <button onClick={() => handleResetItem(item.id)} className="p-2 bg-red-50 text-red-500 text-[10px] rounded-xl">復原</button> : (
                    <div className="flex gap-1"><button onClick={() => handleMarkAudited(item.id)} className="p-2 bg-gray-50 rounded-xl"><CheckCircle2 size={16}/></button><button onClick={() => handleMarkMissing(item.id)} className="p-2 bg-gray-50 rounded-xl"><AlertCircle size={16}/></button></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AuditPage;
