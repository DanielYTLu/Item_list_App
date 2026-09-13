import React from 'react';
import { Package } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <Package size={48} className="text-gray-300" />, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
      <div className="bg-gray-50 p-6 rounded-full">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4 px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
