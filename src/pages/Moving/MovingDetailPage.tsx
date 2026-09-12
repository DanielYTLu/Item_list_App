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
  const { tasks, updateItemStatus, createBox, deleteBox, completeMovingTask } = useMovingStore();
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
    <div className="space-y-3 pb-20 text-xs">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/moving')} className="p-1 hover:bg-gray-100 rounded"><ArrowLeft size={16} /></button>
        <div className="text-center">
          <h2 className="font-bold">{task.name}</h2>
          <p className="text-[10px] text-gray-400">{getSName(task.fromSpaceId)} → <span className="text-orange-600 font-bold">{getSName(task.toSpaceId)}</span></p>
        </div>
        {task.status !== 'completed' ? (
          <button onClick={() => { if (confirm('確認完成？')) { completeMovingTask(task.id); navigate('/moving'); } }} className="bg-orange-600 text-white px-2 py-1 rounded font-bold">完成</button>
        ) : <span className="text-green-600">已完成</span>}
      </div>
      <div className="bg-white p-3 rounded-lg border space-y-1">
        <div className="flex justify-between text-gray-500"><span>打包進度</span><span className="font-bold text-orange-600">{stats.pct}%</span></div>
        <div className="w-full bg-gray-100 h-1 rounded overflow-hidden"><div className="bg-orange-500 h-1" style={{ width: `${stats.pct}%` }} /></div>
        <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-gray-400 pt-1">
          <div><span className="block font-bold text-gray-800">{stats.p}</span>裝箱</div>
          <div><span className="block font-bold text-green-600">{stats.m}</span>已定位</div>
          <div><span className="block font-bold text-red-500">{stats.mis}</span>遺失</div>
          <div><span className="block font-bold text-gray-400">{stats.ig}</span>不帶</div>
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg border space-y-2">
        <div className="flex justify-between items-center"><h3 className="font-bold flex items-center gap-1"><Box size={12} />行李箱</h3><button onClick={() => setShowAdd(!showAdd)} className="text-orange-600">＋新增</button></div>
        {showAdd && (
          <div className="flex gap-1">
            <input type="text" placeholder="箱子名稱" value={newB} onChange={(e) => setNewB(e.target.value)} className="flex-1 p-1.5 border rounded text-xs" />
            <button onClick={() => { if (newB.trim()) { createBox(task.id, newB.trim()); setNewB(''); setShowAdd(false); } }} className="bg-orange-600 text-white px-2 rounded">確定</button>
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setBoxF('all')} className={`px-1.5 py-0.5 rounded border ${boxF === 'all' ? 'border-orange-500 text-orange-600 font-bold' : 'text-gray-500'}`}>全部</button>
          <button onClick={() => setBoxF('unboxed')} className={`px-1.5 py-0.5 rounded border ${boxF === 'unboxed' ? 'border-orange-500 text-orange-600 font-bold' : 'text-gray-500'}`}>未裝箱</button>
          {task.boxes.map((b) => (
            <div key={b.id} className="relative flex items-center bg-gray-50 rounded pl-1.5 pr-4 py-0.5 border">
              <button onClick={() => setBoxF(b.id)} className={boxF === b.id ? 'text-orange-600 font-bold' : 'text-gray-500'}>{b.name}</button>
              <button onClick={(e) => { e.stopPropagation(); if (confirm(`刪除 ${b.name}？`)) deleteBox(task.id, b.id); }} className="absolute right-0.5 text-gray-400 hover:text-red-500"><Trash2 size={8} /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setStatus('all')} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-bold ${status === 'all' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>全部</button>
        <button onClick={() => setStatus('to_pack')} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-bold ${status === 'to_pack' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>待打包</button>
        <button onClick={() => setStatus('packed')} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-bold ${status === 'packed' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>已裝箱</button>
        <button onClick={() => setStatus('moved')} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-bold ${status === 'moved' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>已定位</button>
      </div>
      <div className="flex gap-1">
        <input type="text" placeholder="搜尋行李..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 p-1.5 border rounded" />
        <select value={boxF} onChange={(e) => setBoxF(e.target.value)} className="p-1.5 border rounded bg-white text-[10px]">
          <option value="all">所有箱子</option>
          <option value="unboxed">未裝箱</option>
          {task.boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        {filtered.map(({ itemId, status: s, boxId, item }) => {
          if (!item) return null;
          const curBox = task.boxes.find((b) => b.id === boxId);
          return (
            <div key={itemId} className="bg-white p-2 rounded border flex justify-between items-center gap-1">
              <div className="min-w-0">
                <h4 className="font-bold truncate">{item.name}</h4>
                <div className="text-[10px] text-gray-400 truncate">
                  <MapPin size={8} className="inline mr-0.5" />
                  {getSName(item.spaceId)} • {getLName(item.locationId)}
                  {curBox && <span className="ml-1 bg-amber-100 text-amber-800 px-1 rounded">{curBox.name}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {s === 'to_pack' && (
                  <>
                    <select onChange={(e) => updateItemStatus(task.id, itemId, 'packed', e.target.value)} className="p-0.5 border rounded text-[10px] bg-white">
                      <option value="">選擇箱子...</option>
                      {task.boxes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'packed', task.boxes[0]?.id)} className="px-1.5 py-0.5 bg-amber-500 text-white rounded font-bold">裝箱</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'dont_bring')} className="px-1 py-0.5 bg-gray-50 text-gray-400 rounded">不帶</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'missing')} className="px-1 py-0.5 bg-red-50 text-red-500 rounded">遺失</button>
                  </>
                )}
                {s === 'packed' && (
                  <>
                    <span className="bg-amber-100 text-amber-800 font-bold px-1 rounded py-0.5">已裝箱</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'moved')} className="px-1.5 py-0.5 bg-green-600 text-white rounded font-bold">已定位</button>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack', '')} className="p-0.5 bg-gray-50 rounded text-gray-600"><Undo2 size={10} /></button>
                  </>
                )}
                {s === 'moved' && (
                  <>
                    <span className="bg-green-100 text-green-800 font-bold px-1 rounded py-0.5">已定位</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack', '')} className="p-0.5 bg-gray-50 rounded text-gray-600"><Undo2 size={10} /></button>
                  </>
                )}
                {s === 'dont_bring' && (
                  <>
                    <span className="bg-gray-100 text-gray-500 px-1 rounded py-0.5">不帶</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack')} className="p-0.5 bg-gray-50 rounded text-gray-600"><Undo2 size={10} /></button>
                  </>
                )}
                {s === 'missing' && (
                  <>
                    <span className="bg-red-100 text-red-700 font-bold px-1 rounded py-0.5">遺失</span>
                    <button onClick={() => updateItemStatus(task.id, itemId, 'to_pack')} className="p-0.5 bg-gray-50 rounded text-gray-600"><Undo2 size={10} /></button>
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
