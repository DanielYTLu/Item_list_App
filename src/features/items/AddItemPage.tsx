import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Button } from '../../components/ui/Button';
import { ChevronDown, ChevronUp, MapPin, Package, Hash, Camera, Calendar, DollarSign } from 'lucide-react';
import { ImagePicker } from '../../components/common/ImagePicker';

const QuantitySelector = ({ value, onChange, unit, setUnit }: { value: number, onChange: (val: number) => void, unit: string, setUnit: (val: string) => void }) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <label className="flex items-center text-sm font-medium text-gray-500"><Hash size={16} className="mr-2" /> 數量</label>
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold hover:bg-gray-200"
        >-</button>
        <span className="w-8 text-center font-bold text-lg">{value}</span>
        <button 
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold hover:bg-emerald-200"
        >+</button>
        <select 
          className="ml-2 p-2 bg-gray-50 rounded-xl text-sm border-none outline-none"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="個">個</option>
          <option value="包">包</option>
          <option value="盒">盒</option>
          <option value="瓶">瓶</option>
          <option value="組">組</option>
        </select>
      </div>
    </div>
  );
};

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
    note: '',
    price: undefined as number | undefined,
    expiryDate: undefined as string | undefined
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const filteredLocations = locations.filter(l => l.spaceId === formData.spaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.spaceId || !formData.locationId) return;

    addItem({
      ...formData,
      status: 'available',
      favorite: false,
      tags: []
    });
    navigate('/items');
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen pb-24 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full mr-3 shadow-sm"></span>
            新增物品
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">拍照並記錄物品詳細資訊與收納位置</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 名稱 */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <input 
            required
            className="w-full text-lg p-2 outline-none"
            placeholder="請輸入物品名稱"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* 空間與位置 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider"><Package size={14} className="mr-1"/> 空間</label>
            <select 
              className="w-full bg-gray-50 p-2 rounded-lg text-sm border-none outline-none"
              value={formData.spaceId}
              onChange={(e) => setFormData({...formData, spaceId: e.target.value, locationId: ''})}
            >
              {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex items-center text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider"><MapPin size={14} className="mr-1"/> 位置</label>
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
        <QuantitySelector 
          value={formData.quantity} 
          onChange={(val) => setFormData({...formData, quantity: val})}
          unit={formData.unit}
          setUnit={(val) => setFormData({...formData, unit: val})}
        />

        {/* 進階收折區塊 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button 
            type="button"
            className="w-full p-4 flex items-center justify-between text-sm font-medium text-gray-600 hover:bg-gray-50"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <span>更多選項 (照片/期限/備註)</span>
            {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {showAdvanced && (
            <div className="p-4 border-t border-gray-50 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center"><Camera size={14} className="mr-1"/> 照片</label>
                <ImagePicker 
                  value={formData.image} 
                  onChange={(base64) => setFormData({...formData, image: base64})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center"><DollarSign size={14} className="mr-1"/> 單價 (選填)</label>
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
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center"><Calendar size={14} className="mr-1"/> 有效期限</label>
                <input 
                  type="date" 
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-emerald-500 bg-gray-50/50"
                  value={formData.expiryDate ?? ''}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value || undefined})}
                />
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 text-lg rounded-2xl shadow-lg shadow-emerald-200">確認新增</Button>
      </form>
    </div>
  );
};

export default AddItemPage;
