import React from 'react';
import { Sparkles, Download, RefreshCw, Layers, Compass, HelpCircle } from 'lucide-react';

interface HeaderProps {
  roomType: string;
  onRoomTypeChange: (room: string) => void;
  onReset: () => void;
  onDownload: () => void;
  isGenerating: boolean;
  activeStyleName: string;
}

const ROOM_OPTIONS = [
  'Living Room',
  'Master Bedroom',
  'Dining Area',
  'Home Office',
  'Studio Apartment',
  'Open Concept Lounge'
];

export const Header: React.FC<HeaderProps> = ({
  roomType,
  onRoomTypeChange,
  onReset,
  onDownload,
  isGenerating,
  activeStyleName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E4DC] px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#232220] flex items-center justify-center text-[#F4EFEA] shadow-sm">
            <Compass className="w-5 h-5 text-[#E3CCA4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#1E1E1C]">
                AuraSpace
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#7D766D] font-medium border-l border-[#D5CEC4] pl-2">
                Studio Edition
              </span>
            </div>
            <p className="text-xs text-[#7A7368]">
              AI Architectural Interior Makeover & Styling Consultant
            </p>
          </div>
        </div>

        {/* Center / Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
          {/* Room Selector */}
          <div className="flex items-center gap-1.5 bg-[#EFECE5] rounded-lg px-2.5 py-1 text-xs text-[#4A453F] border border-[#DDD7CD]">
            <Layers className="w-3.5 h-3.5 text-[#8A8275]" />
            <span className="text-[#8A8275] hidden sm:inline">Space:</span>
            <select
              value={roomType}
              onChange={(e) => onRoomTypeChange(e.target.value)}
              className="bg-transparent font-medium text-[#1E1E1C] focus:outline-none cursor-pointer"
            >
              {ROOM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Current Style indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#5E584F] bg-[#FAF8F3] border border-[#E4DFD5] px-3 py-1 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#3B5F43] animate-pulse"></span>
            <span>Style:</span>
            <strong className="text-[#1E1E1C] font-semibold">{activeStyleName}</strong>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B645B] hover:text-[#1E1E1C] bg-white hover:bg-[#F3EFE8] border border-[#DDD7CC] rounded-lg transition-colors cursor-pointer"
            title="Reset space to default sample"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Space</span>
          </button>

          <button
            onClick={onDownload}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#22211F] hover:bg-[#383633] disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#E6CCA4]" />
            <span>Export Design</span>
          </button>
        </div>
      </div>
    </header>
  );
};
