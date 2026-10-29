import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from '../common/ProductCard';
import { ProductCategory } from '../../types';
import {
  SlidersHorizontal,
  X,
  RotateCcw
} from 'lucide-react';

const ALL_CATEGORIES: ProductCategory[] = [
  'Dresses & Co-ords',
  'Kurtis & Tunics',
  'Sarees',
  'Three-Piece Suits',
  'Modest Fashion',
  'Western Wear',
  'Festive Collections',
  'Bags & Accessories'
];

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '52', '54', '56', 'Free Size'];
const CONDITIONS = ['Brand New', 'Artisan Handloom', 'Boutique Exclusive'];

export const CatalogPage: React.FC = () => {
  const {
    products,
    boutiques,
    catalogCategoryFilter,
    setCatalogCategoryFilter,
    navigateTo
  } = useMarketplace();

  // Filter States
  const [selectedBoutiqueId, setSelectedBoutiqueId] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(15000);
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'price-asc' | 'price-desc'>('recommended');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const resetFilters = () => {
    setCatalogCategoryFilter('All');
    setSelectedBoutiqueId('all');
    setSelectedCondition('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setPriceMax(15000);
    setSortBy('recommended');
  };

  const hasActiveFilters =
    catalogCategoryFilter !== 'All' ||
    selectedBoutiqueId !== 'all' ||
    selectedCondition !== 'all' ||
    selectedSize !== 'all' ||
    inStockOnly ||
    priceMax < 15000;

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.status === 'published')
      .filter((p) => {
        if (catalogCategoryFilter !== 'All' && p.category !== catalogCategoryFilter) return false;
        if (selectedBoutiqueId !== 'all' && p.boutiqueId !== selectedBoutiqueId) return false;
        if (selectedCondition !== 'all' && p.condition !== selectedCondition) return false;
        if (selectedSize !== 'all' && !p.sizes.some((sz) => sz.includes(selectedSize))) return false;
        if (inStockOnly && p.stock <= 0) return false;
        if (p.price > priceMax) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating;
      });
  }, [
    products,
    catalogCategoryFilter,
    selectedBoutiqueId,
    selectedCondition,
    selectedSize,
    inStockOnly,
    priceMax,
    sortBy
  ]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 space-y-8">
      {/* Breadcrumb & Title Area */}
      <div className="flex flex-col gap-3 pb-4">
        <nav className="text-sm text-[#A99B8D] flex items-center gap-2">
          <button onClick={() => navigateTo('home')} className="hover:text-[#252321] cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-[#252321] font-medium">Collections</span>
          {catalogCategoryFilter !== 'All' && (
            <>
              <span>/</span>
              <span className="text-[#B66F7B] font-medium">{catalogCategoryFilter}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-normal font-editorial text-[#252321]">
              {catalogCategoryFilter === 'All' ? "All Women's Collections" : catalogCategoryFilter}
            </h1>
            <p className="text-sm text-[#A99B8D] mt-1">
              Showing {filteredProducts.length} authentic pieces from verified Bangladesh boutiques
            </p>
          </div>

          {/* Sort selector + Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-sm font-medium text-[#252321] cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {hasActiveFilters && '(Active)'}</span>
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#A99B8D] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white rounded-full px-4 py-2.5 text-sm text-[#252321] focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Curator's Choice</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar - rounded-2xl, no borders/shadows */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl">
          <div className="flex items-center justify-between pb-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
              Refine Pieces
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-sm text-[#B66F7B] hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-[#252321] mb-3">Category</h4>
            <div className="space-y-1.5 text-sm text-[#252321]/80">
              <button
                onClick={() => setCatalogCategoryFilter('All')}
                className={`w-full text-left py-2 px-3 rounded-full cursor-pointer transition-colors ${
                  catalogCategoryFilter === 'All'
                    ? 'bg-[#F3E7E5] text-[#252321] font-medium'
                    : 'hover:text-[#B66F7B] hover:bg-[#FAF8F5]'
                }`}
              >
                All Categories ({products.filter((p) => p.status === 'published').length})
              </button>
              {ALL_CATEGORIES.map((cat) => {
                const count = products.filter(
                  (p) => p.category === cat && p.status === 'published'
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`w-full text-left py-2 px-3 rounded-full flex items-center justify-between cursor-pointer transition-colors ${
                      catalogCategoryFilter === cat
                        ? 'bg-[#F3E7E5] text-[#252321] font-medium'
                        : 'hover:text-[#B66F7B] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-sm text-[#A99B8D] tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boutique Selector */}
          <div className="pt-4">
            <h4 className="text-sm font-medium text-[#252321] mb-2.5">Boutique & Atelier</h4>
            <select
              value={selectedBoutiqueId}
              onChange={(e) => setSelectedBoutiqueId(e.target.value)}
              className="w-full bg-[#FAF8F5] rounded-full px-4 py-2.5 text-sm text-[#252321] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Independent Boutiques</option>
              {boutiques.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.location.split(',')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-[#252321]">Max Price</span>
              <span className="font-medium text-[#252321] tabular-nums">
                ৳ {priceMax.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="1500"
              max="15000"
              step="500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#B66F7B] cursor-pointer"
            />
            <div className="flex justify-between text-sm text-[#A99B8D] mt-1">
              <span>৳ 1,500</span>
              <span>৳ 15,000</span>
            </div>
          </div>

          {/* Sizing */}
          <div className="pt-4">
            <h4 className="text-sm font-medium text-[#252321] mb-2.5">Size</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedSize('all')}
                className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-colors ${
                  selectedSize === 'all'
                    ? 'bg-[#252321] text-white font-medium'
                    : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]'
                }`}
              >
                All
              </button>
              {AVAILABLE_SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-sm rounded-full cursor-pointer transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#252321] text-white font-medium'
                      : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="pt-4">
            <h4 className="text-sm font-medium text-[#252321] mb-2.5">Condition</h4>
            <div className="space-y-2 text-sm text-[#252321]/80">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  checked={selectedCondition === 'all'}
                  onChange={() => setSelectedCondition('all')}
                  className="accent-[#B66F7B] w-4 h-4"
                />
                <span>Any Condition</span>
              </label>
              {CONDITIONS.map((c) => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === c}
                    onChange={() => setSelectedCondition(c)}
                    className="accent-[#B66F7B] w-4 h-4"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In Stock toggle */}
          <div className="pt-4">
            <label className="flex items-center justify-between text-sm text-[#252321] cursor-pointer">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-[#B66F7B] rounded"
              />
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl p-8 space-y-3">
              <p className="text-lg font-editorial text-[#252321]">
                No fashion pieces match your current filters.
              </p>
              <p className="text-sm text-[#A99B8D] max-w-sm mx-auto">
                Try widening your price limit or clearing selected size and category filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-3 px-6 py-3 bg-[#252321] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Out Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs lg:hidden">
          <div className="w-full max-w-xs bg-[#FAF8F5] h-full p-6 overflow-y-auto space-y-6 rounded-l-3xl">
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-medium uppercase tracking-wider text-[#252321]">
                Filter Catalog
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 text-[#252321]/70 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <h4 className="text-sm font-medium text-[#252321] mb-2">Category</h4>
              <div className="space-y-1.5 text-sm">
                <button
                  onClick={() => setCatalogCategoryFilter('All')}
                  className={`block w-full text-left py-2 px-3 rounded-full ${
                    catalogCategoryFilter === 'All' ? 'bg-[#F3E7E5] font-medium' : ''
                  }`}
                >
                  All
                </button>
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatalogCategoryFilter(cat)}
                    className={`block w-full text-left py-2 px-3 rounded-full ${
                      catalogCategoryFilter === cat ? 'bg-[#F3E7E5] font-medium' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-3 text-sm font-medium rounded-full bg-white text-[#252321]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-[#252321] text-sm font-medium rounded-full text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
