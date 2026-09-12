import { useState, useCallback } from 'react';
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
  { id: 'lists', path: '/lists', icon: List, label: '清單' },
  { id: 'expiry', path: '/expiry', icon: Clock, label: '到期' },
  { id: 'settings', path: '/settings', icon: User, label: '設定' },
];

export const useNavigation = () => {
  const [navIds, setNavIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('customNavItems');
    return saved ? JSON.parse(saved) : ['home', 'items', 'lists', 'expiry'];
  });

  const saveNavItems = useCallback((newIds: string[]) => {
    localStorage.setItem('customNavItems', JSON.stringify(newIds));
    setNavIds(newIds);
  }, []);

  const getVisibleItems = () => {
    const items = navIds.map(id => ALL_ITEMS.find(item => item.id === id)).filter(Boolean) as NavItem[];
    const left = items.slice(0, 2);
    const right = items.slice(2, 4);
    const center: NavItem = { id: 'add', path: '/add', icon: PlusCircle, label: '新增', isCenter: true };
    
    return { left, center, right };
  };

  return { navIds, saveNavItems, getVisibleItems };
};
