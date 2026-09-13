import React, { useState, useEffect } from 'react';
import { X, Lightbulb, MapPin, Package, BarChart3, Heart, Settings, ShoppingCart, Truck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const TutorialModal: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  const steps = [
    {
      title: "1. 歡迎與狀態總覽 🎉",
      subtitle: "收納從這裡開始",
      content: "這裡為您即時統計總物品數、管理空間與過期提醒。\n\n💡 秘訣：設定好有效期限，App 會自動提醒，不再浪費物資！",
      icon: <Lightbulb className="text-yellow-500" size={28} />,
      selector: ".welcome-banner-spotlight"
    },
    {
      title: "2. 系統設定 ⚙️",
      subtitle: "資料備份與管理",
      content: "點擊右上角設定，您可以隨時進行資料備份、匯出匯入、或切換主題。\n\n💡 秘訣：定期備份重要資料，換手機也安心！",
      icon: <Settings className="text-blue-500" size={28} />,
      selector: ".settings-btn-spotlight"
    },
    {
      title: "3. 空間與位置 🏠",
      subtitle: "建立收納據點",
      content: "管理家中不同的房間、櫥櫃或抽屜。建議從大型空間開始建立。\n\n💡 秘訣：位置越明確，物品就越不容易憑空消失。",
      icon: <MapPin className="text-emerald-500" size={28} />,
      selector: ".space-card-spotlight"
    },
    {
      title: "4. 待買清單 🛒",
      subtitle: "採買日用品與補貨",
      content: "記錄生活日常缺少的消耗品，逛超市或網購時勾選超方便。\n\n💡 秘訣：隨手記下想買的物品，不再漏掉任何該補貨的東西。",
      icon: <ShoppingCart className="text-teal-600" size={28} />,
      selector: ".shopping-card-spotlight"
    },
    {
      title: "5. 清點盤點與搬家 📦",
      subtitle: "實用收納工具",
      content: "使用「清點盤點」核對實體庫存與位置；使用「搬家模式」打包行李與追蹤進度。\n\n💡 秘訣：大掃除或搬家時的神兵利器！",
      icon: <Truck className="text-amber-500" size={28} />,
      selector: ".moving-card-spotlight"
    },
    {
      title: "6. 統計與儀表板 📊",
      subtitle: "全方位資產數據",
      content: "檢視物品總價值、分類佔比與空間分佈圖表，精準掌握收納比例。\n\n💡 秘訣：透過圖表找出哪裡東西最多，是清理雜物的第一步。",
      icon: <BarChart3 className="text-teal-600" size={28} />,
      selector: ".stats-spotlight"
    },
    {
      title: "7. 隨時新增物品 ✨",
      subtitle: "記錄所有家當",
      content: "點擊下方導覽列中央的『+』鍵，隨時隨地拍照、分類並上架新物品。\n\n💡 秘訣：拍照上傳能幫助你一眼識別物品，不用讀冗長文字。",
      icon: <Package className="text-emerald-500" size={28} />,
      selector: ".bottom-nav-center-spotlight"
    }
  ];

  const [tooltipPosition, setTooltipPosition] = useState<'bottom' | 'top'>('bottom');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 在 useEffect 中增加鎖定與解鎖滾動的邏輯
  useEffect(() => {
    // 鎖定滾動
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const updateSpotlight = () => {
      const currentSelector = steps[step].selector;
      const el = document.querySelector(currentSelector) as HTMLElement;
      
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const rafId = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          
          setSpotlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          
          const tooltipHeight = 250;
          const viewportHeight = window.innerHeight;
          
          if (rect.top + rect.height + tooltipHeight + 40 > viewportHeight) {
            setTooltipPosition('top');
          } else {
            setTooltipPosition('bottom');
          }
        });
        return () => cancelAnimationFrame(rafId);
      } else {
        setSpotlightRect(null);
      }
    };

    updateSpotlight();

    window.addEventListener('resize', updateSpotlight);
    // 移除 scroll 監聽，因為我們現在鎖定了 body 的滾動
    
    return () => {
      // 解鎖滾動
      document.body.style.overflow = originalStyle;
      window.removeEventListener('resize', updateSpotlight);
    };
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onClose();
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {spotlightRect && (
        <div 
          className="absolute transition-all duration-300 rounded-lg pointer-events-none"
          style={{
            top: `${spotlightRect.top}px`,
            left: `${spotlightRect.left}px`,
            width: `${spotlightRect.width}px`,
            height: `${spotlightRect.height}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(16, 185, 129, 0.8)'
          }}
        />
      )}

      <div 
        className="absolute w-[calc(100vw-32px)] max-w-sm px-4 transition-all duration-300 z-[10000]"
        style={{
          top: spotlightRect 
            ? (tooltipPosition === 'bottom' ? (spotlightRect.top + spotlightRect.height + 20) : (spotlightRect.top - 20)) 
            : '50%',
          left: '50%',
          transform: tooltipPosition === 'top' ? 'translate(-50%, -100%)' : 'translateX(-50%)',
          maxWidth: '90%',
          width: '100%'
        }}
      >
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              {steps[step].icon}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          
          <h3 className="text-lg font-bold text-gray-800 mb-1">{steps[step].title}</h3>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed whitespace-pre-line">{steps[step].content}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full ${i === step ? 'w-4 bg-emerald-600' : 'w-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              {step > 0 && <button onClick={handlePrev} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">上一步</button>}
              <button onClick={handleNext} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">{step === steps.length - 1 ? '完成' : '下一步'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


