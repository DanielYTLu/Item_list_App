import React, { useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { AlertCircle, Plus, Minus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const InventoryDashboard: React.FC = () => {
  const items = useItemStore((state) => state.items);
  const updateItem = useItemStore((state) => state.updateItem);
  const { shoppingList } = useShoppingListStore();
  const navigate = useNavigate();
  const [filterMode] = useState<'all' | 'low'>('all');

  const lowStockItems = items.filter(
    (item) =>
      item.minQuantity !== undefined &&
      item.quantity <= item.minQuantity
  );

  return (
    <div className="p-4 pb-28 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-blue-500 rounded-full mr-3 shadow-sm"></span>
            庫存與消耗品管理
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">即時掌握生活物資存量，低庫存一鍵補貨</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-blue-100">
          <Package className="w-3.5 h-3.5 mr-1.5" />
          總品項 {items.length}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Package className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500 mb-4">目前沒有庫存物品</p>
          <Button onClick={() => navigate('/add')} className="bg-emerald-600">馬上新增物品</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r">
              <div className="flex items-center text-amber-800 font-bold mb-2">
                <AlertCircle className="w-5 h-5 mr-2" />
                低庫存警告
              </div>
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0 border-amber-200">
                  <span>{item.name}</span>
                  <span className="font-semibold text-amber-700">{item.quantity} / {item.minQuantity} {item.unit}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">庫存: {item.quantity} {item.unit || ''}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
