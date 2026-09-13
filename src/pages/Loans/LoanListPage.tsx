import React, { useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Search, RotateCcw, ArrowRight } from 'lucide-react';

export const LoanListPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, returnItem } = useItemStore();
  const [filter, setFilter] = useState<'all' | 'lent' | 'returned'>('lent');
  const [search, setSearch] = useState('');

  const loanItems = items.filter((item) => {
    if (!item.loanInfo) return false;
    if (filter === 'lent' && item.status !== 'lent') return false;
    if (filter === 'returned' && item.status === 'lent') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || (item.loanInfo?.borrower?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  const lentCount = items.filter((i) => i.status === 'lent').length;

  return (
    <div className="p-4 pb-24">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
              <span className="w-2.5 h-7 bg-amber-500 rounded-full mr-3 shadow-sm"></span>
              借出物品清單
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">記錄借給親友的物品與歸還狀態追蹤</p>
          </div>
        </div>
        <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-amber-100">
          <UserCheck className="w-3.5 h-3.5 mr-1.5" />
          借出中 {lentCount}
        </div>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-amber-800 font-medium">目前借出中</p>
          <p className="text-2xl font-bold text-amber-900">{lentCount} 件</p>
        </div>
        <div className="w-10 h-10 bg-amber-200/50 rounded-full flex items-center justify-center text-amber-700">
          <UserCheck size={20} />
        </div>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-2 mb-4">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="搜尋物品或借用人..."
          className="flex-1 bg-transparent outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFilter('lent')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${filter === 'lent' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
          借出中 ({lentCount})
        </button>
        <button onClick={() => setFilter('returned')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${filter === 'returned' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
          已歸還
        </button>
        <button onClick={() => setFilter('all')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
          全部
        </button>
      </div>

      {loanItems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <UserCheck size={40} className="mx-auto mb-2 opacity-30 text-amber-600" />
          <p className="text-sm">暫無借出紀錄</p>
        </div>
      ) : (
        <div className="space-y-3">
          {loanItems.map((item) => {
            const isLent = item.status === 'lent';
            return (
              <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500">借給：{item.loanInfo?.borrower}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isLent ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {isLent ? '借出中' : '已歸還'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-xl">
                  <div>借出日期：{item.loanInfo?.borrowDate}</div>
                  {item.loanInfo?.dueDate && <div>應還日期：{item.loanInfo.dueDate}</div>}
                </div>
                <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                  {isLent && (
                    <button onClick={() => returnItem(item.id)} className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-bold">
                      <RotateCcw size={14} className="inline mr-1" /> 歸還
                    </button>
                  )}
                  <button onClick={() => navigate(`/loans/${item.id}`)} className="text-xs text-gray-600 px-2 py-1.5 font-medium">
                    管理 <ArrowRight size={14} className="inline ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default LoanListPage;
