import { useState } from 'react';
import { useSpaceStore } from '../store/useSpaceStore';
import { Space, Location } from '../types/space';
import { Plus, Trash2, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

export default function SpaceManagement() {
  const { spaces, locations, addSpace, removeSpace, addLocation, removeLocation } = useSpaceStore();
  const [newSpaceName, setNewSpaceName] = useState('');
  const [expandedSpaceId, setExpandedSpaceId] = useState<string | null>(null);
  const [newLocationName, setNewLocationName] = useState('');

  const handleAddSpace = () => {
    if (!newSpaceName.trim()) return;
    const newSpace: Space = {
      id: crypto.randomUUID(),
      name: newSpaceName,
      createdAt: new Date().toISOString(),
    };
    addSpace(newSpace);
    setNewSpaceName('');
  };

  const handleAddLocation = (spaceId: string) => {
    if (!newLocationName.trim()) return;
    const newLocation: Location = {
      id: crypto.randomUUID(),
      spaceId,
      name: newLocationName,
    };
    addLocation(newLocation);
    setNewLocationName('');
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full mr-3 shadow-sm"></span>
            空間與位置管理
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">管理您的居家空間、房間與收納位置分佈</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xs border border-emerald-100">
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          空間總數 {spaces.length}
        </div>
      </div>
      
      {/* 新增空間 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSpaceName}
          onChange={(e) => setNewSpaceName(e.target.value)}
          placeholder="輸入新空間名稱 (例如：宿舍)"
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          onClick={handleAddSpace}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* 空間列表 */}
      <div className="space-y-3">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedSpaceId(expandedSpaceId === space.id ? null : space.id)}
            >
              <div className="flex items-center gap-3">
                {expandedSpaceId === space.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <MapPin className="text-emerald-500" />
                <span className="font-medium">{space.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeSpace(space.id); }}
                className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* 位置列表 (展開時顯示) */}
            {expandedSpaceId === space.id && (
              <div className="px-4 pb-4 pt-0 bg-gray-50 border-t">
                <div className="flex gap-2 mt-4 mb-2">
                  <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="新增位置 (例如：書桌)"
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleAddLocation(space.id)}
                    className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-600"
                  >
                    新增
                  </button>
                </div>
                <div className="space-y-1">
                  {locations.filter(l => l.spaceId === space.id).map(loc => (
                    <div key={loc.id} className="flex justify-between items-center p-2 bg-white rounded-lg border text-sm">
                      <span>{loc.name}</span>
                      <button 
                        onClick={() => removeLocation(loc.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
