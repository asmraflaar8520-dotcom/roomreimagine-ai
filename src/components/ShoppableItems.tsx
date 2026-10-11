import React, { useState } from 'react';
import { ExternalLink, ShoppingBag, Bookmark, Check, Sparkles, Filter } from 'lucide-react';
import { ShoppableItem } from '../types.ts';

interface ShoppableItemsProps {
  items: ShoppableItem[];
  selectedItem?: ShoppableItem | null;
  onSelectItem: (item: ShoppableItem) => void;
  styleName: string;
}

export const ShoppableItems: React.FC<ShoppableItemsProps> = ({
  items,
  selectedItem,
  onSelectItem,
  styleName,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [savedItemIds, setSavedItemIds] = useState<Set<string>>(new Set());

  const categories = ['All', 'Furniture', 'Lighting', 'Textiles', 'Decor', 'Plants'];

  const filteredItems =
    activeCategory === 'All'
      ? items
      : items.filter((item) => item.category.toLowerCase() === activeCategory.toLowerCase());

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getShoppingUrl = (item: ShoppableItem) => {
    if (item.productUrl) return item.productUrl;
    return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(item.searchQuery || `${item.retailer} ${item.name}`)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E7E2D8] p-4 sm:p-6 shadow-sm mb-6 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#EFECE5]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1E1B]">
              Shoppable Curations
            </h2>
            <span className="text-xs bg-[#F4EFE7] text-[#635A4D] font-medium px-2.5 py-0.5 rounded-full border border-[#DDD5C7]">
              {items.length} Sourced Items
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#736C61] mt-0.5">
            Architecturally matched pieces featured in this {styleName} makeover.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#22211F] text-white shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-[#F3EFE7] text-[#5C5549] border border-[#E5DFD4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {filteredItems.map((item, idx) => {
          const isSelected = selectedItem?.id === item.id;
          const isSaved = savedItemIds.has(item.id);

          return (
            <div
              key={item.id || idx}
              onClick={() => onSelectItem(item)}
              className={`group rounded-xl border p-4 transition-all flex flex-col justify-between cursor-pointer bg-white relative ${
                isSelected
                  ? 'border-[#22211F] ring-2 ring-[#22211F]/20 shadow-md bg-[#FAF9F6]'
                  : 'border-[#EAE5DC] hover:border-[#CDC4B6] hover:shadow-sm'
              }`}
            >
              {/* Header info */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8375]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-semibold text-[#30593B] bg-[#EDF4EE] px-1.5 py-0.5 rounded-md">
                      {item.matchScore}% match
                    </span>
                    <button
                      onClick={(e) => toggleSave(e, item.id)}
                      className={`p-1 rounded-md transition cursor-pointer ${
                        isSaved
                          ? 'text-[#B85D38] bg-[#FAEDE8]'
                          : 'text-[#968E82] hover:text-[#22211F] hover:bg-[#F3EFE7]'
                      }`}
                      title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-base font-semibold text-[#1F1E1B] group-hover:text-[#8C5D30] transition-colors line-clamp-2 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-[#6F675B] mt-2 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Material / Color tag */}
                {(item.material || item.colorway) && (
                  <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-[#7A7366]">
                    {item.material && (
                      <span className="bg-[#F6F4EE] border border-[#E4DFD4] px-2 py-0.5 rounded-md">
                        {item.material}
                      </span>
                    )}
                    {item.colorway && (
                      <span className="bg-[#F6F4EE] border border-[#E4DFD4] px-2 py-0.5 rounded-md">
                        {item.colorway}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer: Price & Shoppable CTA */}
              <div className="mt-4 pt-3 border-t border-[#F1EEE8] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-[#9E9588] block">Estimated</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#1F1E1B]">
                    {item.priceRange}
                  </span>
                </div>

                <a
                  href={getShoppingUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#22211F] hover:bg-[#3B3935] shadow-xs transition cursor-pointer"
                >
                  <span>Shop at {item.retailer}</span>
                  <ExternalLink className="w-3 h-3 text-[#E2CCA5]" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
