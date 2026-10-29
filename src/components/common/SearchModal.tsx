import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, X, Store, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    boutiques,
    navigateTo,
    setCatalogCategoryFilter
  } = useMarketplace();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { products: [], boutiques: [], categories: [] };
    const q = query.toLowerCase();

    const matchedProducts = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.boutiqueName.toLowerCase().includes(q)
    );

    const matchedBoutiques = boutiques.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q)
    );

    const categories = Array.from(
      new Set(
        products
          .filter((p) => p.category.toLowerCase().includes(q))
          .map((p) => p.category)
      )
    );

    return {
      products: matchedProducts.slice(0, 5),
      boutiques: matchedBoutiques.slice(0, 3),
      categories
    };
  }, [query, products, boutiques]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#252321]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3 bg-[#FAF8F5] rounded-full">
          <Search className="w-5 h-5 text-[#A99B8D] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search Jamdani sarees, linen co-ords, abayas, or boutiques..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-[#252321] placeholder-[#A99B8D] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#A99B8D] hover:text-[#252321] mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-sm uppercase tracking-wider text-[#A99B8D] hover:text-[#252321] ml-2 px-3 py-1 bg-white rounded-full cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[65vh] overflow-y-auto pt-6 space-y-6">
          {!query.trim() ? (
            <div className="py-6 text-center">
              <p className="text-sm uppercase tracking-widest text-[#A99B8D] mb-4">Popular Searches in Dhaka</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {['Dhakai Jamdani', 'Linen Co-ord', 'Japanese Nida Abaya', 'Silk Saree', 'Chikankari Kurti'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-sm px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] rounded-full transition-colors cursor-pointer font-medium"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Matched Boutiques */}
              {filteredResults.boutiques.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-[#A99B8D] mb-3">
                    Independent Boutiques
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredResults.boutiques.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigateTo('boutique', { boutiqueSlug: b.slug });
                        }}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF8F5] hover:bg-[#F3E7E5]/70 transition-colors text-left cursor-pointer"
                      >
                        <ImageWithFallback
                          src={b.logo}
                          alt={b.name}
                          className="w-12 h-12 rounded-full object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-base font-medium text-[#252321] truncate">{b.name}</p>
                          <p className="text-sm text-[#A99B8D] flex items-center gap-1 mt-0.5">
                            <Store className="w-3.5 h-3.5" /> {b.location}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {filteredResults.products.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-[#A99B8D] mb-3">
                    Fashion Pieces ({filteredResults.products.length})
                  </h4>
                  <div className="space-y-2">
                    {filteredResults.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          navigateTo('product-detail', { productId: p.id });
                        }}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-[#FAF8F5] transition-colors text-left group cursor-pointer"
                      >
                        <ImageWithFallback
                          src={p.images[0]}
                          alt={p.title}
                          className="w-14 h-16 object-cover rounded-xl bg-[#F3E7E5] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#A99B8D] font-medium">{p.boutiqueName}</p>
                          <p className="text-base text-[#252321] group-hover:text-[#B66F7B] transition-colors font-medium truncate mt-0.5">
                            {p.title}
                          </p>
                          <p className="text-sm text-[#252321] font-medium mt-1 tabular-nums">
                            ৳ {p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-[#A99B8D] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {filteredResults.products.length === 0 && filteredResults.boutiques.length === 0 && (
                <div className="py-10 text-center text-[#A99B8D]">
                  <p className="text-base">No pieces matching "{query}" found.</p>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setCatalogCategoryFilter('All');
                      navigateTo('catalog');
                    }}
                    className="mt-3 text-sm text-[#B66F7B] hover:text-[#9e5c67] font-medium px-5 py-2.5 rounded-full bg-[#FAF8F5] cursor-pointer"
                  >
                    Browse all collections
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
