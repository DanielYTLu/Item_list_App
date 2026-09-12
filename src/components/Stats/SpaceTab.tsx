import React from 'react';
import { MapPin } from 'lucide-react';
import { Space } from '../../types/space';

export interface SpaceStat extends Space {
  count: number;
  value: number;
  percentage: number;
}

interface SpaceTabProps {
  spaceStats: SpaceStat[];
  unassignedCount: number;
  colors: string[];
}

export const SpaceTab: React.FC<SpaceTabProps> = ({ spaceStats, unassignedCount, colors }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <MapPin size={16} className="text-emerald-600" /> 空間分佈統計
        </h3>

        {spaceStats.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">尚無空間資料</div>
        ) : (
          <div className="space-y-3">
            {spaceStats.map((space, index) => (
              <div key={space.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-800">{space.name}</span>
                  <span className="text-gray-500">
                    {space.count} 件 ({space.percentage}%) · NT$ {space.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(space.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}

            {unassignedCount > 0 && (
              <div className="space-y-1 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-500">未指定空間</span>
                  <span className="text-gray-400">{unassignedCount} 件</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
