import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldCheck, Truck, RefreshCw, Sparkles, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setCatalogCategoryFilter, setActiveRole } = useMarketplace();

  return (
    <footer className="bg-[#FAF8F5] text-[#252321] pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        {/* Marketplace Trust Pillars - soft surfaces, no borders, no shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-16">
          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#F3E7E5] flex items-center justify-center shrink-0 text-[#B66F7B]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                Nationwide Delivery
              </h4>
              <p className="text-sm text-[#A99B8D] mt-1">
                Fast courier delivery across all 64 districts in Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#F3E7E5] flex items-center justify-center shrink-0 text-[#B66F7B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                Independent Boutiques
              </h4>
              <p className="text-sm text-[#A99B8D] mt-1">
                Curated collections from local artisans, designers & ateliers
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#F3E7E5] flex items-center justify-center shrink-0 text-[#B66F7B]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                7-Day Inspection
              </h4>
              <p className="text-sm text-[#A99B8D] mt-1">
                Easy size exchange or return if unworn with boutique tags
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 bg-white rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-[#F3E7E5] flex items-center justify-center shrink-0 text-[#B66F7B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                Local Payment Options
              </h4>
              <p className="text-sm text-[#A99B8D] mt-1">
                Cash on Delivery, bKash, Nagad, or secure card transactions
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <h3 className="text-3xl font-normal font-editorial tracking-tight text-[#252321]">
              Nolok
            </h3>
            <p className="text-sm text-[#252321]/70 leading-relaxed max-w-sm">
              A curated multi-vendor marketplace celebrating independent women’s fashion designers, traditional textile weavers, and modern modest boutiques across Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-sm text-[#A99B8D] pt-2">
              <MapPin className="w-4 h-4 text-[#B66F7B]" />
              <span>Headquartered in Dhaka · Serving Bangladesh</span>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-[#252321]/80">
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('All');
                    navigateTo('catalog');
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Sarees');
                    navigateTo('catalog', { category: 'Sarees' });
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Dhakai Jamdani & Sarees
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Kurtis & Tunics');
                    navigateTo('catalog', { category: 'Kurtis & Tunics' });
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Kurtis & Tunics
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Modest Fashion');
                    navigateTo('catalog', { category: 'Modest Fashion' });
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Modest Fashion & Abayas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Dresses & Co-ords');
                    navigateTo('catalog', { category: 'Dresses & Co-ords' });
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Dresses & Co-ords
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Three-Piece Suits');
                    navigateTo('catalog', { category: 'Three-Piece Suits' });
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Three-Piece Salwar Suits
                </button>
              </li>
            </ul>
          </div>

          {/* Marketplace & Sellers */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
              Boutiques
            </h4>
            <ul className="space-y-2.5 text-sm text-[#252321]/80">
              <li>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Browse All Boutiques
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('seller-register')}
                  className="hover:text-[#B66F7B] transition-colors text-[#B66F7B] font-medium cursor-pointer text-left"
                >
                  Open Your Boutique
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveRole('seller');
                    navigateTo('seller-dashboard');
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Seller Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveRole('admin');
                    navigateTo('admin');
                  }}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Admin Oversight
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-[#252321]/80">
              <li>
                <button
                  onClick={() => navigateTo('customer-account')}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('customer-account')}
                  className="hover:text-[#B66F7B] transition-colors cursor-pointer text-left"
                >
                  Wishlist & Account
                </button>
              </li>
              <li>
                <span className="text-[#A99B8D]">Inside Dhaka: ৳70 Delivery</span>
              </li>
              <li>
                <span className="text-[#A99B8D]">Outside Dhaka: ৳130 Delivery</span>
              </li>
              <li>
                <span className="text-[#A99B8D]">Payment: COD / bKash / Nagad</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#A99B8D]">
          <p>© 2026 Nolok Marketplace Bangladesh. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <span>Currency: ৳ BDT</span>
            <span aria-hidden="true">·</span>
            <span>Language: English (Bangla ready)</span>
            <span aria-hidden="true">·</span>
            <span>Demo Platform Preview</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
