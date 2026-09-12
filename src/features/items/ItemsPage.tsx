import React, { useState, useMemo } from 'react';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Button } from '../../components/ui/Button';
import { Package, Trash2, MapPin, Box, Heart, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ItemsPage: React.FC = () => {
  const { items, deleteItem, updateItem } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = useMemo(() => {
    const cats = new Set(items.map(i => i.category));
    return ['全部', ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorite = !filterFavorite || item.favorite;
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
      return matchesSearch && matchesFavorite && matchesCategory;
    });
  }, [items, searchTerm, filterFavorite, selectedCategory]);

  const getFullLocationName = (spaceId: string, locationId: string) => {
    const space = spaces.find(s => s.id === spaceId)?.name || '未知空間';
    const loc = locations.find(l => l.id === locationId)?.name || '未知位置';
    return `${space} > ${loc}`;
  };

  return (
    <div className="p-4 bg-cream min-h-screen pb-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">我的物品 ({filteredItems.length})</h2>
      </div>

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
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <Package className="mx-auto text-gray-300 mb-2" size={40} />
            <p className="text-gray-500">目前沒有符合的物品</p>
            {items.length === 0 && (
              <Button className="mt-4 bg-emerald-600" onClick={() => navigate('/add')}>馬上新增</Button>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
              <div className="flex-1" onClick={() => navigate(`/items/${item.id}`)}>
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
              
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => updateItem(item.id, { favorite: !item.favorite })}
                  className={`p-2 rounded-xl transition-colors ${item.favorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart size={18} fill={item.favorite ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemsPage;

