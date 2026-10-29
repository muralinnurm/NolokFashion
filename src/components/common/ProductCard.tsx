import React, { useState } from 'react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigateTo,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    addToCart
  } = useMarketplace();

  const [isHovered, setIsHovered] = useState(false);
  const isSaved = isInWishlist(product.id);

  const displayImage = isHovered && product.images[1] ? product.images[1] : product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0], 1);
  };

  return (
    <article
      onClick={() => navigateTo('product-detail', { productId: product.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Image container with 3:4 ratio */}
      <div className="relative aspect-3/4 w-full bg-[#F3E7E5] overflow-hidden rounded-t-2xl">
        <ImageWithFallback
          src={displayImage}
          alt={product.title}
          fallbackCategory={product.category}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top badges & Wishlist */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5">
            {product.isNewArrival && (
              <span className="bg-[#252321] text-[#FAF8F5] text-sm uppercase font-medium px-3 py-1 tracking-wider rounded-full pointer-events-auto">
                New
              </span>
            )}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="bg-[#B66F7B] text-white text-sm uppercase font-medium px-3 py-1 tracking-wider rounded-full pointer-events-auto">
                Save ৳{(product.compareAtPrice - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#252321] flex items-center justify-center transition-colors pointer-events-auto cursor-pointer"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isSaved ? 'Saved' : 'Save to Wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-[#B66F7B] text-[#B66F7B]' : 'text-[#252321]'
              }`}
            />
          </button>
        </div>

        {/* Quick View & Quick Add overlay on hover - fully rounded buttons */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-[#252321] text-sm font-medium py-2.5 px-4 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#A99B8D]" />
            <span>Quick View</span>
          </button>
          <button
            onClick={handleQuickAdd}
            className="bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium p-2.5 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            title="Add to bag"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Boutique name */}
          <div className="flex items-center justify-between text-sm text-[#A99B8D] mb-1">
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('boutique', {
                  boutiqueSlug: product.boutiqueName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                });
              }}
              className="hover:text-[#B66F7B] transition-colors line-clamp-1 font-medium"
            >
              {product.boutiqueName}
            </span>
            <span className="text-sm text-[#A99B8D]/80 shrink-0">
              {product.category.split(' ')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-medium text-[#252321] line-clamp-2 leading-snug group-hover:text-[#B66F7B] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Color swatches */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-medium text-[#252321] tabular-nums">
              ৳ {product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-[#A99B8D] line-through tabular-nums font-normal">
                ৳ {product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color preview dots */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5">
              {product.colors.slice(0, 3).map((col) => (
                <span
                  key={col.name}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-sm text-[#A99B8D]">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
