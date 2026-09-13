import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box, Check, Trash2, AlertTriangle, Undo2, MapPin } from 'lucide-react';
import { useMovingStore } from '../../store/useMovingStore';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { MovingItemStatus } from '../../types/moving';

export const MovingDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateItemStatus, createBox, deleteBox, completeMovingTask, reopenMovingTask } = useMovingStore();
  const { items } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<MovingItemStatus | 'all'>('all');
  const [boxF, setBoxF] = useState('all');
  const [newB, setNewB] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const task = tasks.find((t) => t.id === id);
  const itemsWithDetails = useMemo(() => {
    if (!task) return [];
    return Object.values(task.items).map((ti) => ({ ...ti, item: items.find((i) => i.id === ti.itemId) })).filter((x) => x.item);
  }, [task, items]);

  const filtered = useMemo(() => {
    return itemsWithDetails.filter(({ item, status: s, boxId }) => {
      if (!item) return false;
      if (q && !item.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (status !== 'all' && s !== status) return false;
      if (boxF === 'unboxed' && boxId) return false;
      if (boxF !== 'all' && boxF !== 'unboxed' && boxId !== boxF) return false;
      return true;
    });
  }, [itemsWithDetails, q, status, boxF]);

  const stats = useMemo(() => {
    const list = itemsWithDetails;
    const tot = list.length;
    const p = list.filter((i) => i.status === 'packed').length;
    const m = list.filter((i) => i.status === 'moved').length;
    const mis = list.filter((i) => i.status === 'missing').length;
    const ig = list.filter((i) => i.status === 'dont_bring').length;
    const pct = tot > 0 ? Math.round(((p + m) / tot) * 100) : 0;
    return { tot, p, m, mis, ig, pct };
  }, [itemsWithDetails]);

  if (!task) return <div className="p-4 text-center text-xs text-gray-500">找不到搬家計畫</div>;
  const getSName = (sId?: string) => spaces.find((s) => s.id === sId)?.name || '未知';
  const getLName = (lId?: string) => locations.find((l) => l.id === lId)?.name || '未知';

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/moving')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"><ArrowLeft size={18} /></button>
        <div className="text-center">
          <h2 className="font-bold text-base text-gray-800">{task.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{getSName(task.fromSpaceId)} → <span className="text-orange-600 font-bold">{getSName(task.toSpaceId)}</span></p>
        </div>
        {task.status !== 'completed' ? (
          <button 
            onClick={() => { 
              if (stats.pct < 100) {
                if (!confirm(`目前打包進度為 ${stats.pct}% (尚未達到 100%)，確定要強制完成此搬家計畫嗎？`)) return;
              } else {
                if (!confirm('確定完成此搬家計畫？')) return;
              }
              completeMovingTask(task.id); 
              navigate('/moving'); 
            }} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            完成
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold text-xs bg-green-50 px-2.5 py-1.5 rounded-xl">已完成</span>
            <button 
              onClick={() => {
                if (!confirm('確定要取消完成此搬家計畫，重新開啟進行中狀態嗎？')) return;
                reopenMovingTask(task.id);
              }}
              className="text-xs font-bold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-xl transition-all"
            >
              重新開啟
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2.5">
        <div className="flex justify-between text-xs text-gray-600 font-medium"><span>打包進度</span><span className="font-bold text-orange-600 text-sm">{stats.pct}%</span></div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${stats.pct}%` }} /></div>
        <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-500 pt-1">
          <div className="bg-gray-50 p-2 rounded-xl"><span className="block font-bold text-gray-800 text-sm">{stats.p}</span>裝箱</div>
          <div className="bg-green-50/50 p-2 rounded-xl"><span className="block font-bold text-green-600 text-sm">{stats.m}</span>已定位</div>
          <div className="bg-red-50/50 p-2 rounded-xl"><span className="block font-bold text-red-500 text-sm">{stats.mis}</span>遺失</div>
          <div className="bg-gray-50 p-2 rounded-xl"><span className="block font-bold text-gray-500 text-sm">{stats.ig}</span>不帶</div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
            <Box size={16} className="text-orange-500" />箱子與行李箱管理
          </h3>
          <button onClick={() => setShowAdd(!showAdd)} className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-all">
            {showAdd ? '收起' : '＋ 新增箱子'}
          </button>
        </div>
        {showAdd && (
          <div className="flex gap-2 pt-1">
            <input type="text" placeholder="輸入箱子名稱 (例如: 客廳書本箱A)" value={newB} onChange={(e) => setNewB(e.target.value)} className="flex-1 p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-orange-500 outline-none font-medium" />
            <button onClick={() => { if (newB.trim()) { createBox(task.id, newB.trim()); setNewB(''); setShowAdd(false); } }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">確定新增</button>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button onClick={() => setBoxF('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${boxF === 'all' ? 'bg-orange-600 text-white border-orange-600 shadow-xs' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>全部箱子</button>
          <button onClick={() => setBoxF('unboxed')} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${boxF === 'unboxed' ? 'bg-orange-600 text-white border-orange-600 shadow-xs' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>未裝箱</button>
          {task.boxes.map((b) => (
            <div key={b.id} className={`relative flex items-center rounded-xl pl-3 pr-7 py-1.5 text-xs font-bold border transition-all ${boxF === b.id ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}>
              <button onClick={() => setBoxF(b.id)} className="truncate max-w-[120px]">{b.name}</button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm(`確定刪除 ${b.name}？`)) deleteBox(task.id, b.id); }} className={`absolute right-1.5 p-0.5 rounded-md transition-colors ${boxF === b.id ? 'text-white/80 hover:text-white hover:bg-amber-600' : 'text-gray-400 hover:text-red-500 hover:bg-gray-200'}`}><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setStatus('all')} className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap font-bold transition-all shadow-xs ${status === 'all' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}>全部狀態</button>
        <button onClick={() => setStatus('to_pack')} className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap font-bold transition-all shadow-xs ${status === 'to_pack' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}>待打包</button>
        <button onClick={() => setStatus('packed')} className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap font-bold transition-all shadow-xs ${status === 'packed' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}>已裝箱</button>
        <button onClick={() => setStatus('moved')} className={`px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap font-bold transition-all shadow-xs ${status === 'moved' ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}>已定位</button>
      </div>

      <div className="flex gap-2">
        <input type="text" placeholder="搜尋行李或物品名稱..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 p-3 text-xs rounded-2xl border border-gray-200 bg-white focus:border-orange-500 outline-none font-medium shadow-xs" />
        <select value={boxF} onChange={(e) => setBoxF(e.target.value)} className="p-3 text-xs rounded-2xl border border-gray-200 bg-white text-gray-700 font-medium focus:border-orange-500 outline-none shadow-xs">
          <option value="all">所有箱子篩選</option>
          <option value="unboxed">未裝箱</option>
          {task.boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        {filtered.map(({ itemId, status: s, boxId, item }) => {
          if (!item) return null;
          const curBox = task.boxes.find((b) => b.id === boxId);
          return (
            <div key={itemId} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center gap-2">
              <div className="min-w-0 space-y-1">
                <h4 className="font-black text-sm text-gray-900 truncate">{item.name}</h4>
                <div className="text-xs text-gray-500 truncate flex items-center gap-1 font-medium">
                  <MapPin size={11} className="text-gray-400 shrink-0" />
                  <span>{getSName(item.spaceId)}</span>
                  <span className="text-gray-300">•</span>
                  <span>{getLName(item.locationId)}</span>
                  {curBox && <span className="ml-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg text-[10px] font-bold">{curBox.name}</span>}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0 items-center">
                {s === 'to_pack' && (
                  <>
                    <select onChange={(e) => updateItemStatus(task.id, itemId, 'packed', e.target.value)} className="p-1.5 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 font-medium focus:outline-none focus:border-orange-500">
                      <option value="">選擇箱子...</option>
                      {task.boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'packed', task.boxes[0]?.id)} className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-sm">裝箱</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'dont_bring')} className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-semibold">不帶</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'missing')} className="px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold">遺失</button>
                  </>
                )}
                {s === 'packed' && (
                  <>
                    <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-xl text-xs">已裝箱</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'moved')} className="px-2.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm">已定位</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack', '')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600" title="復原"><Undo2 size={14} /></button>
                  </>
                )}
                {s === 'moved' && (
                  <>
                    <span className="bg-green-100 text-green-900 font-bold px-2.5 py-1 rounded-xl text-xs">已定位</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack', '')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600" title="復原"><Undo2 size={14} /></button>
                  </>
                )}
                {s === 'dont_bring' && (
                  <>
                    <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-xl text-xs">不帶</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600" title="復原"><Undo2 size={14} /></button>
                  </>
                )}
                {s === 'missing' && (
                  <>
                    <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-xl text-xs">遺失</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack')} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600" title="復原"><Undo2 size={14} /></button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MovingDetailPage;
