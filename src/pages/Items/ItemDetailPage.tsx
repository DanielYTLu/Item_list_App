import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Trash2, Edit3, Tag, MapPin, Package, User } from 'lucide-react';

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

        <div className="space-y-2">
          <Button className="w-full" onClick={() => navigate(`/edit/${item.id}`)}>
            <Edit3 size={18} className="mr-2 inline" /> 編輯資料
          </Button>
          <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => navigate(`/loans/${item.id}`)}>
            <User size={18} className="mr-2 inline" /> 借出管理
          </Button>
        </div>
      </div>
    </div>
  );
};
