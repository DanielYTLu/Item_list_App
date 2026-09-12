import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { ArrowLeft, Plus, Camera, X } from 'lucide-react';

export default function AddItemPage() {
  const navigate = useNavigate();
  const { addItem } = useItemStore();
  const { spaces, locations } = useSpaceStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [category, setCategory] = useState('其他');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedSpaceId || !selectedLocationId) return;

    addItem({
      name,
      category,
      spaceId: selectedSpaceId,
      locationId: selectedLocationId,
      quantity,
      status: 'available',
      favorite: false,
      tags: [],
      expiryDate: expiryDate || undefined,
      reminderEnabled,
      image: image || undefined,
    });

    navigate(-1);
  };

  const filteredLocations = locations.filter(l => l.spaceId === selectedSpaceId);

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">新增物品</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 圖片上傳區 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">照片</label>
          <div 
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 overflow-hidden relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? (
              <>
                <img src={image} alt="預覽" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Camera size={32} />
                <span className="mt-2 text-sm">點擊上傳照片</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">物品名稱</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="例如：筆記型電腦"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">空間</label>
          <select
            value={selectedSpaceId}
            onChange={(e) => {
              setSelectedSpaceId(e.target.value);
              setSelectedLocationId('');
            }}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">選擇空間</option>
            {spaces.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {selectedSpaceId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="">選擇位置</option>
              {filteredLocations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">數量</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">有效期限 (選填)</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="reminder"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-5 h-5 accent-emerald-600"
          />
          <label htmlFor="reminder" className="text-sm text-gray-700">開啟提醒通知</label>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          確認新增
        </button>
      </form>
    </div>
  );
}
