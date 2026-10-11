import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, Check, ArrowRight } from 'lucide-react';
import { SampleRoom } from '../types.ts';

interface RoomUploadProps {
  currentImageUrl: string;
  onImageSelected: (dataUrl: string, sampleRoom?: SampleRoom) => void;
  sampleRooms: SampleRoom[];
  isGenerating: boolean;
}

export const RoomUpload: React.FC<RoomUploadProps> = ({
  currentImageUrl,
  onImageSelected,
  sampleRooms,
  isGenerating,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSamplesModal, setShowSamplesModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelected(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4 sm:p-6 shadow-sm mb-6 transition-all">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-[#EFECE6]">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1B]">
            Your Space
          </h2>
          <p className="text-xs sm:text-sm text-[#736C61] mt-0.5">
            Upload a snapshot of your room or test with one of our curated spaces.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F3EEE5] text-[#2F2C27] border border-[#DBD4C7] rounded-lg text-xs font-medium transition cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#887E6E]" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Sample Rooms Quick Picker Row */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-[#7D766B] uppercase tracking-wider">
            Sample Spaces To Test
          </span>
          <span className="text-[11px] text-[#A1998E]">Click any room to test instant makeover</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleRooms.map((room) => {
            const isSelected = currentImageUrl === room.originalImage;
            return (
              <button
                key={room.id}
                onClick={() => onImageSelected(room.originalImage, room)}
                disabled={isGenerating}
                className={`group text-left rounded-xl p-2.5 border transition-all relative overflow-hidden flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7F4EE] border-[#2A2926] shadow-sm'
                    : 'bg-[#FAF9F6] hover:bg-white border-[#E8E3DA] hover:border-[#D1C9BE]'
                }`}
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-black/10">
                  <img
                    src={room.originalImage}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#2A2926]/40 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-semibold text-[#1F1E1B] truncate">
                      {room.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-[#787166] mt-0.5 line-clamp-1">
                    {room.roomType} · {room.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & drop dropzone hint when uploading custom photo */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#2B2926] bg-[#F4EFE6]'
            : 'border-[#E2DDD3] hover:border-[#C4BCAD] bg-[#FCFBF8]'
        }`}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-[#6B6356]">
          <UploadCloud className="w-4 h-4 text-[#948A7A]" />
          <span>
            Drag & drop your own room photo here or <strong className="underline text-[#1F1E1B]">browse</strong> (PNG, JPG, WebP)
          </span>
        </div>
      </div>
    </div>
  );
};
