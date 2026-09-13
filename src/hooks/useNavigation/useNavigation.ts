import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Home, Package, PlusCircle, Clock, List, User, LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  path: string;
  icon: LucideIcon;
  label: string;
  isCenter?: boolean;
}

export const ALL_ITEMS: NavItem[] = [
  { id: 'home', path: '/', icon: Home, label: '首頁' },
  { id: 'items', path: '/items', icon: Package, label: '物品' },
  { id: 'inventory', path: '/inventory', icon: Package, label: '庫存' },
  { id: 'lists', path: '/lists', icon: List, label: '購物清單' },
  { id: 'expiry', path: '/expiry', icon: Clock, label: '到期' },
  { id: 'loans', path: '/loans', icon: Package, label: '借出' },
  { id: 'stats', path: '/stats', icon: Package, label: '統計' },
  { id: 'audit', path: '/audit', icon: Package, label: '盤點' },
  { id: 'moving', path: '/moving', icon: Package, label: '搬家' },
  { id: 'settings', path: '/settings', icon: User, label: '設定' },
];

interface NavigationStore {
  navIds: string[];
  saveNavItems: (newIds: string[]) => void;
  getVisibleItems: () => { left: NavItem[]; center: NavItem; right: NavItem[] };
}

export const useNavigation = create<NavigationStore>()(
  persist(
    (set, get) => ({
      navIds: ['home', 'items', 'lists', 'expiry'],
      saveNavItems: (newIds: string[]) => {
        set({ navIds: newIds });
      },
      getVisibleItems: () => {
        const { navIds } = get();
        const items = navIds.map(id => ALL_ITEMS.find(item => item.id === id)).filter(Boolean) as NavItem[];
        const left = items.slice(0, 2);
        const right = items.slice(2, 4);
        const center: NavItem = { id: 'add', path: '/add', icon: PlusCircle, label: '新增', isCenter: true };
        
        return { left, center, right };
      },
    }),
    {
      name: 'customNavItems',
      partialize: (state) => ({ navIds: state.navIds }),
    }
  )
);

