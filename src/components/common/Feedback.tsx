import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-white font-medium text-sm ${
        type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-gray-800'
      }`}>
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        <span className="flex-1">{message}</span>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ text?: string }> = ({ text = '載入中...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="animate-spin text-emerald-600" size={36} />
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );
};
