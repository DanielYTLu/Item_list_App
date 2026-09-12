import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item } from '../types/item';

interface ItemStore {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  checkExpiry: () => void;
  lendItem: (id: string, borrower: string, borrowDate: string, dueDate?: string) => void;
  returnItem: (id: string) => void;
  updateAuditStatus: (id: string, audited: boolean) => void;
  importData: (items: Item[]) => void;
  exportData: () => Item[];
}

export const useItemStore = create<ItemStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            { 
              ...item, 
              id: Date.now().toString(), 
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
          ],
        })),
      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => 
            i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i
          ),
        })),
      deleteItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      checkExpiry: () => {
        // Logic for expiry check will be implemented here
      },
      lendItem: (id: string, borrower: string, borrowDate: string, dueDate?: string) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'lent',
                  loanInfo: { borrower, borrowDate, dueDate, returned: false },
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
        })),
      returnItem: (id: string) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'available',
                  loanInfo: i.loanInfo ? { ...i.loanInfo, returned: true } : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
        })),
      updateAuditStatus: (id: string, audited: boolean) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? {
                  ...i,
                  lastAuditedAt: audited ? new Date().toISOString() : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : i
          ),
        })),
      importData: (items: Item[]) => set({ items }),
      exportData: () => get().items,
    }),
    { name: 'item-storage' }
  )
);
