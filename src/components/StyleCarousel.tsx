import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Check } from 'lucide-react';
import { InteriorStyle } from '../types.ts';

interface StyleCarouselProps {
  styles: InteriorStyle[];
  activeStyleId: string;
  onSelectStyle: (style: InteriorStyle) => void;
  isGenerating: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({
  styles,
  activeStyleId,
  onSelectStyle,
  isGenerating,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1B] flex items-center gap-2">
            <span>Reimagined Styles</span>
            <span className="text-xs font-sans font-medium text-[#7D766C] tracking-normal">
              ({styles.length} curated aesthetics)
            </span>
          </h2>
          <p className="text-xs text-[#736C61] mt-0.5">
            Select a style aesthetic to instantly redesign your room with AI.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-[#DDD6CB] bg-white hover:bg-[#F3EFE7] flex items-center justify-center text-[#443F38] transition cursor-pointer"
            aria-label="Scroll styles left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-[#DDD6CB] bg-white hover:bg-[#F3EFE7] flex items-center justify-center text-[#443F38] transition cursor-pointer"
            aria-label="Scroll styles right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {styles.map((style) => {
          const isActive = style.id === activeStyleId;

          return (
            <div
              key={style.id}
              onClick={() => {
                if (!isGenerating) {
                  onSelectStyle(style);
                }
              }}
              className={`shrink-0 w-[260px] sm:w-[280px] rounded-2xl border transition-all cursor-pointer snap-start overflow-hidden bg-white ${
                isActive
                  ? 'border-[#22211F] ring-2 ring-[#22211F]/15 shadow-md -translate-y-0.5'
                  : 'border-[#E7E2D8] hover:border-[#CDC4B5] hover:shadow-sm'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-36 w-full overflow-hidden bg-[#ECE8E1]">
                <img
                  src={style.previewThumbnail}
                  alt={style.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Active check badge */}
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 bg-[#22211F] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                )}

                {/* Title overlay */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  <h3 className="font-serif text-lg font-semibold leading-tight drop-shadow-sm">
                    {style.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5">
                <p className="text-xs text-[#635C52] line-clamp-2 leading-relaxed h-8">
                  {style.tagline}
                </p>

                {/* Color Swatches */}
                <div className="mt-3 pt-2.5 border-t border-[#F1EEE8] flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#91887C] font-medium">
                    Palette
                  </span>
                  <div className="flex items-center gap-1">
                    {style.palette.map((color, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      />
                    ))}
                  </div>
                </div>

                {/* Key materials inline */}
                <div className="mt-2 text-[11px] text-[#7F776A] truncate">
                  <span className="text-[#A1988B]">Materials:</span>{' '}
                  {style.keyMaterials.slice(0, 2).join(', ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
