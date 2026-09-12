import React, { useState } from 'react';
import { useSpaceStore } from '../../store/useSpaceStore';
import { Plus } from 'lucide-react';

const SpaceManager: React.FC = () => {
  const { spaces, locations, addSpace, addLocation } = useSpaceStore();
  const [newSpace, setNewSpace] = useState('');

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">空間與位置管理</h2>
      
      <section>
        <h3 className="text-lg font-semibold mb-2">空間</h3>
        <div className="flex gap-2">
          <input 
            className="border p-2 rounded flex-grow"
            value={newSpace}
            onChange={(e) => setNewSpace(e.target.value)}
            placeholder="例如：宿舍、家裡"
          />
          <button 
            onClick={() => { 
              if (newSpace.trim()) {
                addSpace({ id: Date.now().toString(), name: newSpace, createdAt: new Date().toISOString() }); 
                setNewSpace(''); 
              }
            }}
            className="bg-green-500 text-white p-2 rounded"
          >
            <Plus />
          </button>
        </div>
        <ul className="mt-2 space-y-1">
          {spaces.map(s => <li key={s.id} className="bg-white p-2 rounded shadow">{s.name}</li>)}
        </ul>
        <section className="mt-6">
          <h3 className="text-lg font-semibold mb-2">位置管理</h3>
          <div className="space-y-2">
            <select
              className="border p-2 rounded w-full"
              onChange={(e) => {
                const spaceId = e.target.value;
                if (spaceId) {
                  const locationName = prompt('請輸入位置名稱:');
                  if (locationName) {
                    addLocation({ id: Date.now().toString(), spaceId, name: locationName });
                  }
                }
              }}
            >
              <option value="">選擇一個空間新增位置...</option>
              {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ul className="space-y-1">
              {locations.map(l => (
                <li key={l.id} className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                  {spaces.find(s => s.id === l.spaceId)?.name} &gt; {l.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};

export default SpaceManager;
