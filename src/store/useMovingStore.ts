import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MovingTask, MovingItemStatus } from '../types/moving';
import { useItemStore } from './useItemStore';

interface MovingStore {
  tasks: MovingTask[];
  createTask: (name: string, fromSpaceId?: string, toSpaceId?: string, initialItemIds?: string[]) => string;
  updateTask: (id: string, updates: Partial<MovingTask>) => void;
  deleteTask: (id: string) => void;
  createBox: (taskId: string, name: string, note?: string) => void;
  deleteBox: (taskId: string, boxId: string) => void;
  updateItemStatus: (taskId: string, itemId: string, status: MovingItemStatus, boxId?: string, targetLocationId?: string) => void;
  batchUpdateStatus: (taskId: string, itemIds: string[], status: MovingItemStatus, boxId?: string) => void;
  completeMovingTask: (taskId: string) => void;
  reopenMovingTask: (taskId: string) => void;
}

export const useMovingStore = create<MovingStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      createTask: (name, fromSpaceId, toSpaceId, initialItemIds) => {
        const taskId = Date.now().toString();
        const itemStore = useItemStore.getState();
        const targetItems = itemStore.items.filter(item => {
          if (initialItemIds?.length) return initialItemIds.includes(item.id);
          if (fromSpaceId && fromSpaceId !== 'all') return item.spaceId === fromSpaceId;
          return true;
        });

        const itemsMap: Record<string, { itemId: string; status: MovingItemStatus }> = {};
        targetItems.forEach(item => { itemsMap[item.id] = { itemId: item.id, status: 'to_pack' }; });

        const newTask: MovingTask = {
          id: taskId,
          name,
          fromSpaceId: fromSpaceId || 'all',
          toSpaceId,
          status: 'active',
          items: itemsMap,
          boxes: [{ id: `${taskId}-box-1`, movingTaskId: taskId, name: '第 1 箱 (預設)' }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        return taskId;
      },
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) => task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
      createBox: (taskId, name, note) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const newBox = { id: `${taskId}-box-${Date.now()}`, movingTaskId: taskId, name, note };
            return { ...task, boxes: [...task.boxes, newBox], updatedAt: new Date().toISOString() };
          }),
        })),
      deleteBox: (taskId, boxId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const updatedItems = { ...task.items };
            Object.keys(updatedItems).forEach((itemId) => {
              if (updatedItems[itemId].boxId === boxId) {
                updatedItems[itemId] = { ...updatedItems[itemId], boxId: undefined };
              }
            });
            return { ...task, boxes: task.boxes.filter((b) => b.id !== boxId), items: updatedItems, updatedAt: new Date().toISOString() };
          }),
        })),
      updateItemStatus: (taskId, itemId, status, boxId, targetLocationId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const cur = task.items[itemId] || { itemId, status: 'to_pack' };
            return {
              ...task,
              items: {
                ...task.items,
                [itemId]: {
                  ...cur,
                  status,
                  boxId: boxId !== undefined ? boxId : cur.boxId,
                  targetLocationId: targetLocationId !== undefined ? targetLocationId : cur.targetLocationId,
                },
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        })),
      batchUpdateStatus: (taskId, itemIds, status, boxId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const updatedItems = { ...task.items };
            itemIds.forEach((itemId) => {
              const cur = updatedItems[itemId] || { itemId, status: 'to_pack' };
              updatedItems[itemId] = { ...cur, status, boxId: boxId !== undefined ? boxId : cur.boxId };
            });
            return { ...task, items: updatedItems, updatedAt: new Date().toISOString() };
          }),
        })),
      completeMovingTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        if (task.toSpaceId) {
          const itemStore = useItemStore.getState();
          Object.values(task.items).forEach((itemData) => {
            if (itemData.status === 'packed' || itemData.status === 'moved') {
              itemStore.updateItem(itemData.itemId, {
                spaceId: task.toSpaceId,
                ...(itemData.targetLocationId ? { locationId: itemData.targetLocationId } : {}),
                status: 'available',
              });
            }
          });
        }
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: 'completed', updatedAt: new Date().toISOString() } : t),
        }));
      },
      reopenMovingTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status: 'active', updatedAt: new Date().toISOString() } : t),
        }));
      },
    }),
    { name: 'moving-storage' }
  )
);
