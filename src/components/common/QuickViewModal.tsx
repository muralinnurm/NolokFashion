import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setIsSizeGuideOpen
  } = useMarketplace();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0] || '');
      setSelectedColor(quickViewProduct.colors[0] || null);
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isSaved = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    if (!selectedColor) return;
    const ok = addToCart(quickViewProduct, selectedSize, selectedColor, quantity);
    if (ok) setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252321]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150 p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-5 right-5 z-10 w-9 h-9 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] rounded-full flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-3/4 bg-[#F3E7E5] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.title}
                fallbackCategory={quickViewProduct.category}
                className="w-full h-full object-cover"
              />
            </div>
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2.5">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden cursor-pointer transition-all ${
                      activeImageIdx === idx ? 'ring-2 ring-[#252321]' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Boutique & Category */}
              <div className="flex items-center justify-between text-sm text-[#A99B8D]">
                <span className="font-medium text-[#B66F7B]">
                  {quickViewProduct.boutiqueName}
                </span>
                <span>{quickViewProduct.category}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-normal font-editorial text-[#252321] leading-snug">
                {quickViewProduct.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-medium text-[#252321] tabular-nums">
                  ৳ {quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.compareAtPrice && quickViewProduct.compareAtPrice > quickViewProduct.price && (
                  <span className="text-base text-[#A99B8D] line-through tabular-nums font-normal">
                    ৳ {quickViewProduct.compareAtPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              {/* Fabric tag */}
              <p className="text-sm text-[#252321]/80">
                <span className="text-[#A99B8D]">Fabric:</span> {quickViewProduct.fabric}
              </p>

              {/* Color selector */}
              {quickViewProduct.colors.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-[#252321]">Color:</span>
                    <span className="text-[#A99B8D]">{selectedColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {quickViewProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full p-0.5 flex items-center justify-center cursor-pointer transition-all ${
                          selectedColor?.name === color.name
                            ? 'ring-2 ring-[#252321]'
                            : ''
                        }`}
                      >
                        <span
                          className="w-full h-full rounded-full inline-block"
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-[#252321]">Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[#B66F7B] hover:text-[#9e5c67] font-medium cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#252321] text-white'
                          : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock status */}
              <div className="pt-2 text-sm flex items-center gap-2">
                {quickViewProduct.stock > 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> In Stock ({quickViewProduct.stock} available in atelier)
                  </span>
                ) : (
                  <span className="text-[#B64545] font-medium">Sold Out</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={quickViewProduct.stock <= 0}
                  className="flex-1 bg-[#252321] hover:bg-[#383533] disabled:opacity-40 text-white text-sm uppercase tracking-wider font-medium py-4 px-6 rounded-full cursor-pointer transition-colors flex items-center justify-center gap-2.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    isSaved
                      ? 'bg-[#F3E7E5] text-[#B66F7B]'
                      : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product-detail', { productId: quickViewProduct.id });
                }}
                className="w-full text-center text-sm text-[#252321]/70 hover:text-[#B66F7B] py-2 font-medium flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Atelier Details & Verified Reviews</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
