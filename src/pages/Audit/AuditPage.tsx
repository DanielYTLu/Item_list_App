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
    <div className="min-h-screen bg-warmGray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-warmGray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl text-warmGray-600 hover:bg-warmGray-100"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-lg font-bold">清點盤點模式</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleResetAllAudit} className="p-2 rounded-xl text-warmGray-500"><RotateCcw className="w-4 h-4" /></button>
          <button onClick={handleBatchAuditAll} className="text-xs bg-softGreen text-white px-3 py-1.5 rounded-xl">全部確認</button>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between text-xs mb-2 text-warmGray-500"><span>進度</span><span>{stats.percent}%</span></div>
          <div className="w-full bg-warmGray-100 rounded-full h-2"><div className="bg-softGreen h-2 rounded-full" style={{ width: `${stats.percent}%` }} /></div>
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
