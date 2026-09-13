import React, { useState } from 'react';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { Trash2, CheckCircle, Circle, Plus, ShoppingCart } from 'lucide-react';

export const ShoppingListPage: React.FC = () => {
  const { shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem, clearChecked } = useShoppingListStore();
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addShoppingItem(newItemName, 1);
      setNewItemName('');
    }
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="shopping-list-spotlight text-xl font-bold mb-4">購物清單</h2>
      <h2 className="text-xl font-bold mb-4">購物清單</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="新增待買物品..."
          className="flex-1 border rounded-lg p-2 px-4 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 px-4 rounded-lg">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {shoppingList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingCart className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500">購物清單目前是空的</p>
          <p className="text-sm text-gray-400">快去新增一些需要購買的物品吧！</p>
        </div>
      ) : (
        <div className="space-y-2">
          {shoppingList.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border">
              <button onClick={() => toggleShoppingItem(item.id)} className="flex items-center flex-1">
                {item.checked ? 
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" /> : 
                  <Circle className="w-6 h-6 text-gray-300 mr-3" />
                }
                <span className={item.checked ? 'line-through text-gray-400' : ''}>{item.name}</span>
              </button>
              <button onClick={() => removeShoppingItem(item.id)} className="text-red-400 p-1">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          <button 
            onClick={clearChecked}
            className="mt-6 w-full py-2 text-sm text-gray-500 hover:text-red-600"
          >
            清除已購物品
          </button>
        </div>
      )}
    </div>
  );
};

