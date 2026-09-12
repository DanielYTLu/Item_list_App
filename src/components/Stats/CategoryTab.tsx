import React from 'react';
import { Tag } from 'lucide-react';

export interface CategoryStat {
  name: string;
  count: number;
  value: number;
  percentage: number;
}

interface CategoryTabProps {
  categories: CategoryStat[];
  colors: string[];
}

export const CategoryTab: React.FC<CategoryTabProps> = ({ categories, colors }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <Tag size={16} className="text-emerald-600" /> 物品分類佔比統計
        </h3>

        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">尚無分類資料</div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat, index) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-gray-800">{cat.name}</span>
                  <span className="text-gray-500">
                    {cat.count} 件 ({cat.percentage}%) · NT$ {cat.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(cat.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
