import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemStore } from '../../store/useItemStore';
import { useSpaceStore } from '../../store/useSpaceStore';
import { useMovingStore } from '../../store/useMovingStore';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { Settings, Download, Upload, Trash2, Info, LayoutGrid } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const itemStore = useItemStore();
  const spaceStore = useSpaceStore();
  const movingStore = useMovingStore();
  const shoppingListStore = useShoppingListStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleExport = () => {
    const data = {
      items: itemStore.items,
      spaces: spaceStore.spaces,
      locations: spaceStore.locations,
      movingTasks: movingStore.tasks,
      shoppingList: shoppingListStore.shoppingList,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shuwu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (confirm('匯入資料將會完全覆蓋目前的物品、空間、搬家清單與購物清單，確定繼續嗎？')) {
          // Clear and set new data
          itemStore.importData(importedData.items || []);
          // Note: Since existing stores use persist middleware, direct state set via setter might be needed 
          // if they don't have explicit importData methods. 
          // For simplicity in this structure, we assume we need to update state directly or via dedicated methods.
          
          // Using standard way to update store state (assuming standard Zustand state setters)
          useSpaceStore.setState({ spaces: importedData.spaces || [], locations: importedData.locations || [] });
          useMovingStore.setState({ tasks: importedData.movingTasks || [] });
          useShoppingListStore.setState({ shoppingList: importedData.shoppingList || [] });
          
          alert('資料匯入成功！');
          window.location.reload();
        }
      } catch (err) {
        alert('檔案格式錯誤，無法匯入。');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center space-x-2">
        <Settings className="text-emerald-600" />
        <h2 className="text-xl font-bold">設定與資料備份</h2>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">介面設定</h3>
          <button
            onClick={() => navigate('/settings/nav')}
            className="w-full flex items-center p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition"
          >
            <LayoutGrid className="mr-3 text-emerald-600" />
            <span>自定義下方導覽列</span>
          </button>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100">
          <h3 className="font-semibold text-gray-700">資料管理</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="flex flex-col items-center justify-center p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition"
            >
              <Download className="mb-2" />
              <span>匯出備份 (JSON)</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition"
            >
              <Upload className="mb-2" />
              <span>匯入備份</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <div className="flex items-start space-x-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <p>匯出功能可將您目前的所有物品與資料儲存為 JSON 檔案。匯入時請選擇正確的備份檔案，這將會完全覆蓋目前的資料庫，請謹慎操作。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
