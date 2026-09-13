import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Button } from '../../components/ui/Button';
import { MapPin, Package, Hash, DollarSign, Calendar } from 'lucide-react';
import { ImagePicker } from '../../components/common/ImagePicker';

const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, updateItem } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  
  const item = items.find(i => i.id === id);

  const [formData, setFormData] = useState(item || {
    name: '',
    image: undefined as string | undefined,
    spaceId: spaces[0]?.id || '',
    locationId: '',
    quantity: 1,
    unit: '個',
  });

  if (!item) {
    return <div className="p-4">物品不存在</div>;
  }

  const filteredLocations = locations.filter(l => l.spaceId === formData.spaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.spaceId || !formData.locationId) return;

    updateItem(item.id, formData);
    navigate('/items');
  };

  return (
    <div className="p-4 bg-cream min-h-screen pb-24 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full mr-3 shadow-sm"></span>
            編輯物品
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">更新物品照片、名稱、數量與收納位置</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 照片上傳 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <ImagePicker 
            value={formData.image} 
            onChange={(base64) => setFormData({...formData, image: base64})} 
          />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-600 mb-2">物品名稱</label>
          <input 
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><Package size={14} className="mr-1"/> 空間</label>
            <select 
              className="w-full bg-gray-50 p-2 rounded-lg text-sm border-none outline-none"
              value={formData.spaceId}
              onChange={(e) => setFormData({...formData, spaceId: e.target.value, locationId: ''})}
            >
              {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><MapPin size={14} className="mr-1"/> 位置</label>
            <select 
              required
              className="w-full bg-gray-50 p-2 rounded-lg text-sm border-none outline-none"
              value={formData.locationId}
              onChange={(e) => setFormData({...formData, locationId: e.target.value})}
            >
              <option value="">選擇位置</option>
              {filteredLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <label className="flex items-center text-sm font-medium text-gray-600"><Hash size={14} className="mr-1"/> 數量</label>
          <div className="flex items-center gap-2">
            <input 
              type="number" min="1"
              className="w-20 p-2 bg-gray-50 rounded-lg text-center"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
            />
            <input 
              className="w-16 p-2 bg-gray-50 rounded-lg text-center"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            />
          </div>
        </div>

        {/* 單價與有效期限（選填） */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><DollarSign size={14} className="mr-1"/> 單價 (選填)</label>
            <input 
              type="number" 
              min="0"
              step="1"
              placeholder="例如: 250"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-gray-50/50"
              value={formData.price ?? ''}
              onChange={(e) => setFormData({...formData, price: e.target.value ? Number(e.target.value) : undefined})}
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-gray-600 mb-2"><Calendar size={14} className="mr-1"/> 有效期限 (選填)</label>
            <input 
              type="date" 
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-gray-50/50"
              value={formData.expiryDate ?? ''}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value || undefined})}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 text-lg">儲存變更</Button>
      </form>
    </div>
  );
};

export default EditItemPage;
