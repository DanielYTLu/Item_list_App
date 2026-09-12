import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Truck, Trash2, MapPin } from 'lucide-react';
import { useMovingStore } from '../../store/useMovingStore';
import { useSpaceStore } from '../../store/useSpaceStore';

export const MovingListPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, createTask, deleteTask } = useMovingStore();
  const { spaces } = useSpaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('我的搬家計畫');
  const [fromId, setFromId] = useState('all');
  const [toId, setToId] = useState('');

  const getSpaceName = (id?: string) => (!id || id === 'all' ? '所有空間' : spaces.find((s) => s.id === id)?.name || '未知');

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl p-4 text-white flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold flex items-center gap-1.5"><Truck size={18} />搬家模式</h2>
          <p className="text-[10px] text-amber-100">打包行李與進度追蹤</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="bg-white text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"><Plus size={14} />建立</button>
      </div>
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border space-y-2">
            <Truck size={28} className="text-orange-500 mx-auto" />
            <h4 className="font-bold text-xs">目前無搬家任務</h4>
            <button onClick={() => setIsOpen(true)} className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">＋ 立即建立</button>
          </div>
        ) : (
          tasks.map((t) => {
            const list = Object.values(t.items);
            const total = list.length;
            const done = list.filter((i) => i.status === 'packed' || i.status === 'moved').length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={t.id} onClick={() => navigate(`/moving/${t.id}`)} className="bg-white p-3 rounded-xl border cursor-pointer space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs">{t.name}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{t.status === 'completed' ? '已完成' : '進行中'}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin size={10} />{getSpaceName(t.fromSpaceId)} → <span className="text-orange-600 font-bold">{getSpaceName(t.toSpaceId)}</span></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('確定刪除？')) deleteTask(t.id); }} className="text-gray-300 hover:text-red-500 p-0.5"><Trash2 size={12} /></button>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-gray-500"><span>打包進度 ({done}/{total})</span><span>{pct}%</span></div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden"><div className="bg-orange-500 h-1" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-4 space-y-3">
            <h3 className="text-sm font-bold">新搬家計畫</h3>
            <input type="text" placeholder="計畫名稱" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 text-xs rounded-lg border focus:border-orange-500" />
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white">
              <option value="all">來源：所有空間</option>
              {spaces.map((s) => <option key={s.id} value={s.id}>來源：{s.name}</option>)}
            </select>
            <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full p-2 text-xs rounded-lg border bg-white">
              <option value="">目標：不指定</option>
              {spaces.map((s) => <option key={s.id} value={s.id}>目標：{s.name}</option>)}
            </select>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs">取消</button>
              <button onClick={() => { if (name.trim()) { createTask(name.trim(), fromId, toId || undefined); setIsOpen(false); } }} className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-xs font-bold">建立</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MovingListPage;
