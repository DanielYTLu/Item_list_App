import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  quantity: number;
}

interface ShoppingListStore {
  shoppingList: ShoppingItem[];
  addShoppingItem: (name: string, quantity: number) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;
  clearChecked: () => void;
}

export const useShoppingListStore = create<ShoppingListStore>()(
  persist(
    (set) => ({
      shoppingList: [],
      addShoppingItem: (name, quantity) =>
        set((state) => ({
          shoppingList: [
            ...state.shoppingList,
            { id: Date.now().toString(), name, quantity, checked: false },
          ],
        })),
      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          ),
        })),
      removeShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),
      clearChecked: () =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => !item.checked),
        })),
    }),
    { name: 'shopping-list-storage' }
  )
);
