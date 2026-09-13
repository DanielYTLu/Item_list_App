import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { Settings } from 'lucide-react';
import { OnboardingTooltip } from '../Onboarding/OnboardingTooltip';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // 檢查用戶是否第一次訪問
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasVisited', 'true');
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream text-gray-800 antialiased selection:bg-softGreen selection:text-white">
      {showOnboarding && <OnboardingTooltip onClose={handleCloseOnboarding} />}
      {/* 頂部導覽列 (App Header Bar) */}
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-gray-200/60 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-full bg-softGreen flex items-center justify-center text-white font-bold shadow-sm">
            宿
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">宿物</h1>
            <p className="text-[10px] text-gray-500">你的東西，我幫你記得。</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="p-2 bg-white/80 hover:bg-white text-gray-700 border border-gray-200/80 rounded-xl transition shadow-sm flex items-center justify-center"
            title="設定"
          >
            <Settings size={18} className="text-emerald-600" />
          </button>
        </div>
      </header>

      {/* 頁面主內容 */}
      <main className="flex-grow pb-24 w-full max-w-md mx-auto touch-manipulation">
        <div className="px-4 py-2">
          <Outlet />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;

