import React, { useRef } from 'react';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

interface ImagePickerProps {
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <ImageIcon size={16} className="text-emerald-600" />
        物品照片
      </label>
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group w-28 h-28 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-lg">
            <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="bg-white/90 text-red-500 rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all duration-300"
          >
            <Camera size={28} className="mb-2" />
            <span className="text-xs font-medium">點擊拍照</span>
          </button>
        )}
        <div className="flex-1 text-sm text-gray-400">
          <p>清晰的照片能讓你更輕鬆地找到物品。</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
