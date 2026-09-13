import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigation } from '../../hooks/useNavigation/useNavigation';

const BottomNav: React.FC = () => {
  const { getVisibleItems } = useNavigation();
  const { left, center, right } = getVisibleItems();

  const renderLink = (item: any) => {
    const isItemsPage = item.path === '/items';
    const isCenterButton = item.isCenter;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
            isActive ? 'text-emerald-600 font-semibold' : 'text-gray-400 hover:text-gray-600'
          } ${isCenterButton ? '-mt-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md border-4 border-cream bottom-nav-center-spotlight' : ''} ${isItemsPage ? 'items-nav-spotlight' : ''}`
        }
      >
        <item.icon size={isCenterButton ? 26 : 22} />
        {!isCenterButton && <span className="text-[11px] mt-1 tracking-tight">{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-16 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-40">
      {left.map(renderLink)}
      {renderLink(center)}
      {right.map(renderLink)}
    </nav>
  );
};

export default BottomNav;

