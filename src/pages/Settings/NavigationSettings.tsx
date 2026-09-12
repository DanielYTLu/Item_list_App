import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowLeft } from 'lucide-react';
import { useNavigation, ALL_ITEMS, NavItem } from '../../hooks/useNavigation/useNavigation';

const SortableItem = ({ item }: { item: NavItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center p-4 bg-white border border-gray-200 rounded-xl mb-3 shadow-sm ${isDragging ? 'opacity-50 border-emerald-500 shadow-md' : ''}`}>
      <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mr-4 p-1 touch-none">
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

  const [items, setItems] = useState<NavItem[]>(() => 
    navIds.map(id => ALL_ITEMS.find(i => i.id === id)!).filter(Boolean)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newArray = arrayMove(items, oldIndex, newIndex);
        saveNavItems(newArray.map(i => i.id));
        return newArray;
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center space-x-3">
        <button 
          type="button"
          onClick={() => navigate('/settings')}
          className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">自定義下方導覽列</h2>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <p className="text-sm text-gray-500">
          按住左側的拖曳圖示上下移動，即可即時調整下方導覽列的顯示順序（前兩個在左側，後兩個在右側）。
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-4">
              {items.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default NavigationSettings;
