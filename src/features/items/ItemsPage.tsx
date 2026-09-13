import React, { useState, useMemo } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { EmptyState } from '../../components/common/EmptyState';
import { Package, Trash2, MapPin, Box, Heart, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ItemsPage: React.FC = () => {
  const items = useItemStore((state) => state.items);
  const deleteItem = useItemStore((state) => state.deleteItem);
  const updateItem = useItemStore((state) => state.updateItem);
  const addItem = useItemStore((state) => state.addItem);
  const { spaces, locations } = useSpaceStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // 初始化 Fuse.js
  const fuse = useMemo(() => new Fuse(items, {
    keys: ['name', 'category', 'note', 'brand', 'model'],
    threshold: 0.3,
  }), [items]);

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ['全部', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (searchTerm) {
      result = fuse.search(searchTerm).map(r => r.item);
    }
    return result.filter(item => {
      const matchesFavorite = !filterFavorite || item.favorite;
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
      return matchesFavorite && matchesCategory;
    });
  }, [items, searchTerm, filterFavorite, selectedCategory, fuse]);

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) newSelected.delete(itemId);
    else newSelected.add(itemId);
    setSelectedItems(newSelected);
  };

  const handleBatchDelete = () => {
    if (selectedItems.size === 0) return;
    selectedItems.forEach(id => deleteItem(id));
    toast.success(`已成功刪除 ${selectedItems.size} 個物品`);
    setSelectedItems(new Set());
    setIsBatchMode(false);
  };

  const getFullLocationName = (spaceId: string, locationId: string) => {
    const space = spaces.find(s => s.id === spaceId)?.name || '未知空間';
    const loc = locations.find(l => l.id === locationId)?.name || '未知位置';
    return `${space} > ${loc}`;
  };

  const handleDelete = (item: any) => {
    deleteItem(item.id);
    toast.success(`已刪除物品 "${item.name}"`, {
      action: {
        label: '復原',
        onClick: () => {
          addItem(item);
          toast.success('已復原物品');
        },
      },
    });
  };

  return (
    <div className="p-4 bg-cream min-h-screen pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-blue-500 rounded-full mr-3 shadow-sm"></span>
            {isBatchMode ? `已選取 ${selectedItems.size} 個物品` : `我的物品`}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">即時掌握與管理所有物品資料，支援快速搜尋與篩選</p>
        </div>
        <div className="flex items-center gap-2">
          {!isBatchMode && (
            <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-blue-100">
              <Package className="w-3.5 h-3.5 mr-1.5" />
              總品項 {filteredItems.length}
            </div>
          )}
          <button 
            onClick={() => {
              setIsBatchMode(!isBatchMode);
              setSelectedItems(new Set());
            }}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-bold transition-all"
          >
            {isBatchMode ? '取消' : '批量操作'}
          </button>
        </div>
      </div>

      {isBatchMode && (
        <div className="fixed bottom-24 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-emerald-100 flex gap-2 z-50">
          <button 
            onClick={handleBatchDelete}
            disabled={selectedItems.size === 0}
            className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold disabled:opacity-50"
          >
            刪除 ({selectedItems.size})
          </button>
        </div>
      )}

      {/* 搜尋與篩選列 */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="搜尋物品名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setFilterFavorite(!filterFavorite)}
          className={`p-2 rounded-xl border ${filterFavorite ? 'bg-red-100 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600'}`}
        >
          <Heart size={20} fill={filterFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 分類篩選條 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid gap-3">
        {filteredItems.length === 0 ? (
          <EmptyState 
            title="沒有找到物品" 
            description={items.length === 0 ? "目前還沒有任何物品，快來新增吧！" : "試著調整搜尋條件或類別。"}
            actionLabel={items.length === 0 ? "馬上新增" : undefined}
            onAction={items.length === 0 ? () => navigate('/add') : undefined}
          />
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`bg-white p-5 rounded-2xl shadow-sm border ${selectedItems.has(item.id) ? 'border-emerald-500' : 'border-gray-100'} flex justify-between items-start transition-colors`}
              onClick={() => isBatchMode ? toggleItemSelection(item.id) : navigate(`/items/${item.id}`)}
            >
              <div className="flex-1 flex gap-4 items-center">
                {isBatchMode && (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedItems.has(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                    {selectedItems.has(item.id) && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1.5 text-emerald-500" /> 
                      {getFullLocationName(item.spaceId, item.locationId)}
                    </div>
                    <div className="flex items-center">
                      <Box size={14} className="mr-1.5 text-emerald-500" />
                      數量: {item.quantity} {item.unit}
                    </div>
                  </div>
                </div>
              </div>
              
              {!isBatchMode && (
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateItem(item.id, { favorite: !item.favorite }) }}
                    className={`p-2 rounded-xl transition-colors ${item.favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart size={18} fill={item.favorite ? 'currentColor' : 'none'} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item) }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemsPage;

