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

