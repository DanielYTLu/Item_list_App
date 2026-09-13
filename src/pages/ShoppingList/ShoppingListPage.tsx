import React, { useState } from 'react';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useItemStore } from '../../store/useItemStore';
import { Trash2, CheckCircle2, Circle, Plus, ShoppingCart, CheckCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ShoppingListPage: React.FC = () => {
  const { shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem, clearChecked } = useShoppingListStore();
  const { items } = useItemStore();
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const navigate = useNavigate();

  const lowStockItems = items.filter(
    (item) => 
      item.minQuantity !== undefined && 
      item.quantity <= item.minQuantity &&
      !shoppingList.some((s) => s.name === item.name && !s.checked)
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addShoppingItem(newItemName.trim(), newItemQty);
      setNewItemName('');
      setNewItemQty(1);
    }
  };

  const handleAddLowStock = (itemName: string, minQty?: number, currentQty?: number) => {
    const qtyNeeded = minQty !== undefined && currentQty !== undefined ? Math.max(1, minQty - currentQty) : 1;
    addShoppingItem(itemName, qtyNeeded);
  };

  const checkedCount = shoppingList.filter((item) => item.checked).length;
  const uncheckedCount = shoppingList.length - checkedCount;
  const progressPercent = shoppingList.length > 0 ? Math.round((checkedCount / shoppingList.length) * 100) : 0;


  return (
    <div className="p-4 pb-28 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="shopping-list-spotlight text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full mr-3 shadow-sm"></span>
            購物清單
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">記錄日常補貨需求，逛街採買不漏勾</p>
        </div>
        {shoppingList.length > 0 && (
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-emerald-100">
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            待買 {uncheckedCount} 項
          </div>
        )}
      </div>

      {shoppingList.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/10 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="flex items-center text-emerald-100">
              <CheckCheck className="w-4 h-4 mr-1.5" /> 採買進度
            </span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {checkedCount} / {shoppingList.length} 已買 ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap sm:flex-nowrap items-center gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="新增想買的物品名稱..."
          className="w-full sm:flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2 flex-1 sm:flex-initial">
            <span className="text-xs text-gray-400 mr-1.5 shrink-0">數量:</span>
            <input 
              type="number" 
              min="1" 
              max="99" 
              value={newItemQty}
              onChange={(e) => setNewItemQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center text-sm font-bold bg-transparent outline-none text-gray-800"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newItemName.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center shrink-0 min-w-[46px] min-h-[46px]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {lowStockItems.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center text-amber-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 mr-2 text-amber-600" />
            庫存不足，建議順便購買：
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddLowStock(item.name, item.minQuantity, item.quantity)}
                className="bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-2xs group"
              >
                <span>{item.name}</span>
                <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md text-[10px]">
                  剩 {item.quantity}{item.unit || ''}
                </span>
                <Plus className="w-3.5 h-3.5 text-amber-600 ml-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}


      {shoppingList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-2xs space-y-3">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShoppingCart size={30} />
          </div>
          <div>
            <p className="text-gray-700 font-bold text-base">購物清單目前是空的</p>
            <p className="text-xs text-gray-400 mt-1">隨手記下想買的物品，逛超市或網購不再忘記！</p>
          </div>
          <button
            onClick={() => navigate('/inventory')}
            className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
          >
            去庫存管理查看消耗品 <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {shoppingList.map((item) => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-xs border transition-all ${
                  item.checked ? 'border-gray-100 bg-gray-50/60 opacity-75' : 'border-gray-100 hover:border-emerald-200 hover:shadow-sm'
                }`}
              >
                <button 
                  onClick={() => toggleShoppingItem(item.id)} 
                  className="flex items-center flex-1 text-left group min-w-0 pr-2"
                >
                  {item.checked ? 
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 shrink-0 transition-transform scale-110" /> : 
                    <Circle className="w-6 h-6 text-gray-300 group-hover:text-emerald-500 mr-3 shrink-0 transition-colors" />
                  }
                  <div className="min-w-0">
                    <span className={`font-medium text-sm block truncate ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {item.name}
                    </span>
                  </div>
                </button>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex items-center bg-gray-100/80 rounded-lg px-2 py-1 text-xs font-semibold text-gray-600">
                    <span>數量: {item.quantity}</span>
                  </div>
                  <button 
                    onClick={() => removeShoppingItem(item.id)} 
                    className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {checkedCount > 0 && (
            <div className="pt-2 flex justify-center">
              <button 
                onClick={clearChecked}
                className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 px-4 py-2.5 rounded-xl border border-gray-200 shadow-2xs transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                清除已購物品 ({checkedCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

