import React, { useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { ArrowLeft, User, Calendar, Save, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const LoanManagementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = useItemStore((state) => state.items.find((i) => i.id === id));
  const lendItem = useItemStore((state) => state.lendItem);
  const returnItem = useItemStore((state) => state.returnItem);

  const [borrower, setBorrower] = useState(item?.loanInfo?.borrower || '');
  const [borrowDate, setBorrowDate] = useState(item?.loanInfo?.borrowDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(item?.loanInfo?.dueDate || '');

  if (!item) return <div className="p-4 text-center">物品不存在</div>;

  const handleLend = () => {
    if (!borrower || !borrowDate) return alert('請填寫完整借出資訊');
    lendItem(item.id, borrower, borrowDate, dueDate);
    navigate(-1);
  };

  const handleReturn = () => {
    returnItem(item.id);
    navigate(-1);
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
              <span className="w-2.5 h-7 bg-amber-500 rounded-full mr-3 shadow-sm"></span>
              借出管理：{item.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">記錄借出對象、借出日期與歸還管理</p>
          </div>
        </div>
        <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-amber-100">
          <User className="w-3.5 h-3.5 mr-1.5" />
          {item.status === 'lent' ? '已借出' : '可借出'}
        </div>
      </header>

      {item.status === 'lent' ? (
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
          <p className="text-amber-800 font-bold mb-4">目前狀態：已借出</p>
          <div className="space-y-2 text-sm text-amber-900 mb-6">
            <p>借用人：{item.loanInfo?.borrower}</p>
            <p>借出日期：{item.loanInfo?.borrowDate}</p>
            {item.loanInfo?.dueDate && <p>預計歸還：{item.loanInfo.dueDate}</p>}
          </div>
          <button onClick={handleReturn} className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white p-3 rounded-xl font-bold">
            <RotateCcw size={18} /> 標記為已歸還
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2">借用人</label>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <User size={18} className="text-gray-400" />
              <input className="flex-1 bg-transparent outline-none" value={borrower} onChange={(e) => setBorrower(e.target.value)} placeholder="輸入借用人姓名" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2">借出日期</label>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <Calendar size={18} className="text-gray-400" />
              <input type="date" className="flex-1 bg-transparent outline-none" value={borrowDate} onChange={(e) => setBorrowDate(e.target.value)} />
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-gray-600 mb-2">預計歸還日期 (選填)</label>
            <input type="date" className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 outline-none" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <button onClick={handleLend} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white p-4 rounded-xl font-bold">
            <Save size={18} /> 確認借出
          </button>
        </div>
      )}
    </div>
  );
};
