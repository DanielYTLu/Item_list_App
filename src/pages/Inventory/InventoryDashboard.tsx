import React from 'react';
import { useItemStore } from '../../store/useItemStore';
import { AlertCircle, Plus, Minus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const InventoryDashboard: React.FC = () => {
  const items = useItemStore((state) => state.items);
  const updateItem = useItemStore((state) => state.updateItem);
  const navigate = useNavigate();

  // 篩選出需要補充的消耗品 (假設數量小於或等於 minQuantity)
  const lowStockItems = items.filter(
    (item) => 
      item.minQuantity !== undefined && 
      item.quantity <= item.minQuantity
  );

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4">庫存管理</h2>
      
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

