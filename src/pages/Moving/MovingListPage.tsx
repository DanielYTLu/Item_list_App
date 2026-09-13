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
    <div className="space-y-5 pb-24 max-w-md mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-orange-500 rounded-full mr-3 shadow-sm"></span>
            搬家模式
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">規劃打包行李箱、記錄箱子與搬遷進度追蹤</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all">
          <Plus size={16} />建立計畫
        </button>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm space-y-3">
            <Truck size={32} className="text-orange-500 mx-auto" />
            <h4 className="font-bold text-sm text-gray-800">目前無搬家任務</h4>
            <p className="text-xs text-gray-400">點擊下方按鈕開始規劃您的搬家行程與打包清單</p>
            <button onClick={() => setIsOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">＋ 立即建立計畫</button>
          </div>
        ) : (
          tasks.map((t) => {
            const list = Object.values(t.items);
            const total = list.length;
            const done = list.filter((i) => i.status === 'packed' || i.status === 'moved').length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={t.id} onClick={() => navigate(`/moving/${t.id}`)} className="bg-white p-4 rounded-2xl border border-gray-100 hover:border-orange-300 shadow-sm cursor-pointer space-y-3 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-800">{t.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{t.status === 'completed' ? '已完成' : '進行中'}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" />{getSpaceName(t.fromSpaceId)} → <span className="text-orange-600 font-bold">{getSpaceName(t.toSpaceId)}</span></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); if (confirm('確定刪除？')) deleteTask(t.id); }} className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-600 font-medium"><span>打包進度 ({done}/{total})</span><span className="font-bold text-orange-600">{pct}%</span></div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden"><div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} /></div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-4 shadow-xl border border-gray-100">
            <h3 className="text-base font-bold text-gray-800">新搬家計畫</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">計畫名稱</label>
                <input type="text" placeholder="例如：2026 溫馨新家搬遷" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-orange-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">出發空間</label>
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-orange-500 outline-none font-medium">
                  <option value="all">所有空間</option>
                  {spaces.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">目標新家空間 (選填)</label>
                <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full p-3 text-sm rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-orange-500 outline-none font-medium">
                  <option value="">不指定目標空間</option>
                  {spaces.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl text-xs font-bold transition-all">取消</button>
              <button onClick={() => { if (name.trim()) { createTask(name.trim(), fromId, toId || undefined); setIsOpen(false); } }} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm">建立計畫</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MovingListPage;
