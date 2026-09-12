import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg text-white font-medium text-sm ${
        type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-gray-800'
      }`}>
        {type === 'success' && <CheckCircle2 size={18} />}
        {type === 'error' && <AlertCircle size={18} />}
        <span>{message}</span>
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
