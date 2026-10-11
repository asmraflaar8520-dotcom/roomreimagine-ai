import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Maximize2,
  Minimize2,
  Download,
  Info,
  Layers,
  Split,
  Eye,
  Columns,
  RotateCcw
} from 'lucide-react';
import { ShoppableItem } from '../types.ts';

interface CompareSliderProps {
  originalImageUrl: string;
  makeoverImageUrl: string;
  styleName: string;
  isGenerating: boolean;
  shoppableItems: ShoppableItem[];
  onSelectShoppableItem: (item: ShoppableItem) => void;
  designNotes?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalImageUrl,
  makeoverImageUrl,
  styleName,
  isGenerating,
  shoppableItems,
  onSelectShoppableItem,
  designNotes,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'peek-original'>('split');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position from mouse or touch event
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const clampedPercentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(clampedPercentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  // Click directly on container to jump slider
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    handleMove(e.clientX);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = makeoverImageUrl;
    link.download = `AuraSpace-${styleName.replace(/\s+/g, '-')}-Makeover.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hotspot coordinates on the makeover image (scaled % x, y)
  const hotspotCoords = [
    { x: 35, y: 65, index: 0 },
    { x: 68, y: 72, index: 1 },
    { x: 50, y: 32, index: 2 },
    { x: 22, y: 40, index: 3 },
  ];

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E7E2D8] shadow-sm overflow-hidden mb-6 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black/95 flex flex-col p-4 sm:p-6' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-[#EFECE5] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6]">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-semibold text-[#1F1E1B]">
            Interactive Comparison
          </span>
          <span className="text-xs text-[#7F776A] hidden sm:inline">
            · Drag slider or tap to inspect before & after
          </span>
        </div>

        {/* View Mode controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-[#EAE6DE] p-1 rounded-lg text-xs font-medium text-[#504A41]">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white text-[#1F1E1B] shadow-xs' : 'hover:text-[#1F1E1B]'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>

            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'side-by-side' ? 'bg-white text-[#1F1E1B] shadow-xs' : 'hover:text-[#1F1E1B]'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <button
              onMouseDown={() => setViewMode('peek-original')}
              onMouseUp={() => setViewMode('split')}
              onTouchStart={() => setViewMode('peek-original')}
              onTouchEnd={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'peek-original' ? 'bg-[#2B2926] text-white shadow-xs' : 'hover:text-[#1F1E1B]'
              }`}
              title="Press and hold to view original"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Hold to Peek Original</span>
            </button>
          </div>

          {/* Toggle hotspots */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
              showHotspots
                ? 'bg-[#2B2926] text-white border-[#2B2926]'
                : 'bg-white text-[#5F584C] border-[#DCD5C9] hover:bg-[#F4EFE6]'
            }`}
            title="Toggle shoppable item pins"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E7CEA8]" />
            <span className="hidden sm:inline">Item Hotspots</span>
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F3EFE7] text-[#4A443B] transition cursor-pointer"
            title="Download Makeover Image"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F3EFE7] text-[#4A443B] transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      {viewMode === 'side-by-side' ? (
        /* Side by side display */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-[#1A1918]">
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black">
            <img
              src={originalImageUrl}
              alt="Original space"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-medium">
              Original Space
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black">
            <img
              src={makeoverImageUrl}
              alt="AI Reimagined design"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#2A2825]/90 backdrop-blur-sm text-[#F7EEDF] border border-white/20 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#E2CCA5]" />
              <span>AI Reimagined · {styleName}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Split drag slider (or peek original) */
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className="relative select-none overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full max-h-[720px] bg-[#141413] cursor-ew-resize"
        >
          {/* Base Layer: AI Reimagined Makeover Image (Full width background) */}
          <img
            src={viewMode === 'peek-original' ? originalImageUrl : makeoverImageUrl}
            alt="AI Reimagined Interior"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200"
          />

          {/* Overlaid Layer: Original Space Image (Clipped by slider position) */}
          {viewMode !== 'peek-original' && (
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={originalImageUrl}
                alt="Original Space"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Interactive Hotspot pins on the makeover side (if slider is to the left of the hotspot) */}
          {showHotspots && viewMode !== 'peek-original' && !isGenerating && (
            <>
              {hotspotCoords.map((coord, i) => {
                const item = shoppableItems[coord.index];
                if (!item) return null;
                // Only show hotspot if it's on the revealed makeover side (x > sliderPosition)
                const isRevealed = coord.x > sliderPosition - 4;
                if (!isRevealed) return null;

                const isItemActive = activeHotspot === item.id;

                return (
                  <div
                    key={item.id || i}
                    style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(item.id);
                      onSelectShoppableItem(item);
                    }}
                  >
                    <button
                      className="group relative flex items-center justify-center cursor-pointer"
                      title={item.name}
                    >
                      <span className="absolute w-7 h-7 rounded-full bg-white/40 animate-ping" />
                      <span className="relative w-7 h-7 rounded-full bg-[#1E1E1C] border-2 border-white text-white flex items-center justify-center text-[11px] font-bold shadow-lg transition-transform group-hover:scale-110">
                        {i + 1}
                      </span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 bg-[#22211F] text-white text-xs px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col gap-0.5 border border-white/10 z-30">
                        <span className="font-semibold text-[#F7EEDE]">{item.name}</span>
                        <span className="text-[10px] text-[#A8A196]">
                          {item.retailer} · {item.priceRange}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {/* Drag Divider Line & Handle */}
          {viewMode !== 'peek-original' && (
            <div
              className="absolute top-0 bottom-0 z-30 -translate-x-1/2 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Vertical line with subtle glow */}
              <div className="w-[2.5px] h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.6)]" />

              {/* Circular drag handle */}
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#1E1E1C] shadow-[0_4px_20px_rgba(0,0,0,0.4)] border-2 border-[#1E1E1C] flex items-center justify-center cursor-ew-resize pointer-events-auto transition-transform active:scale-95"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold leading-none">‹</span>
                  <div className="w-0.5 h-3.5 bg-[#4A463F] rounded-full" />
                  <span className="text-xs font-bold leading-none">›</span>
                </div>
              </div>
            </div>
          )}

          {/* Left Label: Original Space */}
          <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
            <span className="bg-black/65 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-white/15">
              Original Space
            </span>
          </div>

          {/* Right Label: AI Reimagined */}
          <div className="absolute top-3.5 right-3.5 z-20 pointer-events-none">
            <span className="bg-[#1C1B19]/80 backdrop-blur-md text-[#F7EEDE] text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm border border-white/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E4CCA5]" />
              <span>AI Reimagined · {styleName}</span>
            </span>
          </div>

          {/* Slider percentage badge at bottom */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-70 hover:opacity-100 transition">
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full border border-white/10">
              {Math.round(sliderPosition)}% Original / {Math.round(100 - sliderPosition)}% Reimagined
            </span>
          </div>

          {/* Generating Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-40 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2A2926] border border-[#E8CCA6]/30 flex items-center justify-center text-[#E8CCA6] animate-bounce mb-3 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-xl sm:text-2xl font-semibold text-[#F7EEDE] text-center">
                Architectural Makeover in Progress
              </h4>
              <p className="text-xs sm:text-sm text-[#C4BCAD] mt-1 text-center max-w-md">
                Gemini is analyzing room lighting, geometry, and synthesizing {styleName} textures...
              </p>
              <div className="w-48 h-1 bg-white/20 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#E5CCA6] rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Design notes ticker below visualization */}
      {designNotes && !isFullscreen && (
        <div className="px-4 py-2.5 bg-[#FAF8F4] border-t border-[#EFECE5] flex items-center justify-between text-xs text-[#6B6356] gap-2">
          <div className="flex items-center gap-2 truncate">
            <Info className="w-3.5 h-3.5 text-[#9E9484] shrink-0" />
            <span className="truncate">
              <strong>Architectural Note:</strong> {designNotes}
            </span>
          </div>
          <button
            onClick={() => setSliderPosition(50)}
            className="text-[11px] text-[#4A453F] hover:text-[#1E1E1C] underline shrink-0 cursor-pointer"
          >
            Center Slider (50/50)
          </button>
        </div>
      )}
    </div>
  );
};
