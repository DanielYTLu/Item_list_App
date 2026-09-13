import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const OnboardingTooltip: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "歡迎使用宿物 App",
      content: "這是一個幫助你整理生活物品的工具。讓我們帶你快速入門！",
    },
    {
      title: "第一步：空間管理",
      content: "點擊「空間與位置」，先建立你的房間或抽屜。",
    },
    {
      title: "第二步：新增物品",
      content: "回到這裡，使用「+」按鈕或直接到物品頁面新增你的東西。",
    }
  ];

  if (step >= steps.length) {
    onClose();
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Lightbulb size={20} />
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{steps[step].title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{steps[step].content}</p>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-emerald-500' : 'w-1.5 bg-gray-200'}`} />
            ))}
          </div>
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
          >
            {step === steps.length - 1 ? '開始使用' : '下一步'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
