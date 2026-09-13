import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { ArrowLeft, Trash2, Edit3, Tag, MapPin, Package, User, ArrowRight } from 'lucide-react';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const item = useItemStore((state) => state.items.find((i) => i.id === id));
  const deleteItem = useItemStore((state) => state.deleteItem);

  if (!item) {
    return <div className="p-4 text-center">物品不存在</div>;
  }

  const handleDelete = () => {
    if (confirm('確定要刪除這個物品嗎？')) {
      deleteItem(item.id);
      navigate('/items');
    }
  };

  return (
    <div className="pb-20">
      <header className="flex items-center justify-between py-4 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">物品詳情</h1>
        <button onClick={handleDelete} className="p-2 -mr-2 text-red-500 hover:bg-red-50 rounded-full">
          <Trash2 size={20} />
        </button>
      </header>

      {item.image && (
        <div className="w-full h-64 rounded-3xl overflow-hidden shadow-lg mb-6">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-50 p-3 rounded-2xl">
            <div className="text-xs text-emerald-600 mb-1 flex items-center gap-1">
              <Package size={14} /> 庫存
            </div>
            <div className="text-xl font-bold">{item.quantity} {item.unit}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-2xl">
            <div className="text-xs text-yellow-700 mb-1 flex items-center gap-1">
              <Tag size={14} /> 分類
            </div>
            <div className="text-lg font-bold">{item.category}</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin size={20} />
            <span>存放於 {item.spaceId} - {item.locationId}</span>
          </div>
          {item.note && (
            <p className="text-gray-500 bg-gray-50 p-4 rounded-2xl">{item.note}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/loans/${item.id}`)}
            className={`w-full group relative overflow-hidden rounded-2xl p-4 text-white shadow-md transition-all duration-300 hover:shadow-lg active:scale-[0.98] flex items-center justify-between ${
              item.status === 'lent' 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/25 backdrop-blur-xs flex items-center justify-center text-white transition-transform group-hover:scale-110">
                <User size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs text-white/80 font-medium">
                  {item.status === 'lent' ? '目前物品已借出' : '物品出借紀錄'}
                </div>
                <div className="text-lg font-bold tracking-wide">
                  {item.status === 'lent' ? '管理歸還與借用人' : '借出管理與登記'}
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} />
            </div>
          </button>

          <button
            onClick={() => navigate(`/edit/${item.id}`)}
            className="w-full group relative overflow-hidden rounded-2xl p-4 bg-white border border-gray-200 text-gray-700 shadow-xs hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 hover:shadow-md active:scale-[0.98] flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white">
                <Edit3 size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-400 font-medium">修改物品屬性</div>
                <div className="text-lg font-bold text-gray-800 group-hover:text-emerald-900 tracking-wide">
                  編輯物品資料
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 group-hover:bg-emerald-100/60">
              <ArrowRight size={18} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
