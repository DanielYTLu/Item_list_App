import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Button } from '../../components/ui/Button';
import { ChevronDown, MapPin, Package, Tag, Hash } from 'lucide-react';
import { ImagePicker } from '../../components/common/ImagePicker';

const AddItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { spaces, locations } = useSpaceStore();
  const addItem = useItemStore((state) => state.addItem);

  const [formData, setFormData] = useState({
    name: '',
    image: undefined as string | undefined,
    category: '生活用品',
    spaceId: spaces[0]?.id || '',
    locationId: '',
    quantity: 1,
    unit: '個',
    note: ''
  });

  const filteredLocations = locations.filter(l => l.spaceId === formData.spaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.spaceId || !formData.locationId) return;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

    addItem({
      ...formData,
      status: 'available',
      favorite: false,
      tags: []
    });
    navigate('/items');
  };

  return (
    <div className="p-4 bg-cream min-h-screen pb-24">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">新增物品</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 照片上傳 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <ImagePicker 
            value={formData.image} 
            onChange={(base64) => setFormData({...formData, image: base64})} 
          />
        </div>

        {/* 名稱 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-600 mb-2">物品名稱</label>
          <input 
            required
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 outline-none"
            placeholder="例如：延長線"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* 空間與位置 */}
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

        {/* 數量 */}
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
              placeholder="單位"
              value={formData.unit}
              onChange={(e) => setFormData({...formData, unit: e.target.value})}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 text-lg">確認新增</Button>
      </form>
    </div>
  );
};

export default AddItemPage;

