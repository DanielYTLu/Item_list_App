import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowLeft, Plus } from 'lucide-react';
import { useNavigation, ALL_ITEMS, NavItem } from '../../hooks/useNavigation/useNavigation';
import { toast } from 'sonner';

const SortableItem = ({ item }: { item: NavItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center p-2 bg-white ${isDragging ? 'opacity-50' : ''}`}>
      <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mr-3 p-1 touch-none">
        <GripVertical size={20} />
      </button>
      <div className="flex items-center">
        <item.icon className="text-emerald-600 mr-3" size={20} />
        <span className="font-medium text-gray-700">{item.label}</span>
      </div>
    </div>
  );
};

const NavigationSettings: React.FC = () => {
  const { navIds, saveNavItems } = useNavigation();
  const navigate = useNavigate();

  const [activeItems, setActiveItems] = useState<NavItem[]>(() => 
    navIds.map(id => ALL_ITEMS.find(i => i.id === id)!).filter(Boolean)
  );

  const availableItems = ALL_ITEMS.filter(i => !activeItems.some(act => act.id === i.id));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setActiveItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        saveNavItems(newArray.map(i => i.id));
        return newArray;
      });
      toast.success('已更新導覽列順序');
    }
  };

  const handleSwapIn = (itemToAdd: NavItem) => {
    if (activeItems.length >= 4) {
      toast.error('底部導覽列最多只能放置 4 個快捷按鈕（左右各二），請先移除一個項目。');
      return;
    }
    const newItems = [...activeItems, itemToAdd];
    setActiveItems(newItems);
    saveNavItems(newItems.map(i => i.id));
    toast.success(`已將 "${itemToAdd.label}" 加入導覽列`);
  };

  const handleRemove = (itemId: string) => {
    if (activeItems.length <= 2) {
      toast.error('導覽列至少需要保留 2 個快捷按鈕。');
      return;
    }
    const itemToRemove = activeItems.find(i => i.id === itemId);
    const newItems = activeItems.filter(i => i.id !== itemId);
    setActiveItems(newItems);
    saveNavItems(newItems.map(i => i.id));
    toast.success(`已將 "${itemToRemove?.label}" 移出導覽列`);
  };

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto p-4">
      <header className="flex items-center space-x-3 mb-2">
        <button 
          type="button"
          onClick={() => navigate('/settings')}
          className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-850 tracking-tight flex items-center">
            <span className="w-2.5 h-7 bg-emerald-500 rounded-full mr-3 shadow-sm"></span>
            自定義下方導覽列
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">自由配置喜好的快捷功能按鈕於導覽列</p>
        </div>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">目前顯示中 (左二、右二)</h3>
          <p className="text-xs text-gray-400 mt-1">按住左側圖示上下拖曳可排序，點擊右側可移除。中央固定為「新增」按鈕。</p>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-2 space-y-2">
              {activeItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <SortableItem item={item} />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition mr-2"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {availableItems.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">可加入的功能</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSwapIn(item)}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition group"
              >
                <div className="flex items-center">
                  <item.icon className="text-gray-500 group-hover:text-emerald-600 mr-2" size={18} />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-700">{item.label}</span>
                </div>
                <Plus size={16} className="text-gray-400 group-hover:text-emerald-600" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationSettings;
