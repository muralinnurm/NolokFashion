import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from '../common/ProductCard';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  MapPin,
  Clock,
  Truck,
  Star,
  Search,
  MessageCircle,
  X,
  Send
} from 'lucide-react';

export const BoutiqueStorefrontPage: React.FC = () => {
  const {
    selectedBoutiqueSlug,
    boutiques,
    products,
    navigateTo,
    showToast
  } = useMarketplace();

  const boutique =
    boutiques.find(
      (b) =>
        b.slug === selectedBoutiqueSlug ||
        b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedBoutiqueSlug
    ) || boutiques[0];

  const [shopSearch, setShopSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const boutiqueProducts = useMemo(() => {
    return products.filter((p) => p.boutiqueId === boutique.id && p.status === 'published');
  }, [products, boutique.id]);

  const filteredProducts = useMemo(() => {
    return boutiqueProducts.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (
        shopSearch &&
        !p.title.toLowerCase().includes(shopSearch.toLowerCase()) &&
        !p.fabric.toLowerCase().includes(shopSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [boutiqueProducts, selectedCategory, shopSearch]);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Inquiry sent directly to ${boutique.name}. They usually reply within 2 hours!`, 'success');
    setIsInquiryModalOpen(false);
    setInquiryName('');
    setInquiryMessage('');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Banner */}
      <div className="relative h-56 sm:h-72 w-full bg-[#252321] overflow-hidden">
        <ImageWithFallback
          src={boutique.banner}
          alt={boutique.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#252321]/80 via-transparent to-black/20" />
      </div>

      {/* Boutique Header Profile */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 -mt-24 sm:-mt-28 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <ImageWithFallback
              src={boutique.logo}
              alt={boutique.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shrink-0"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
                  {boutique.name}
                </h1>
                <span className="text-sm bg-emerald-100 text-emerald-800 font-medium px-3 py-1 rounded-full">
                  Verified Boutique
                </span>
              </div>
              <p className="text-sm text-[#A99B8D] font-medium">{boutique.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-[#252321]/70">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#B66F7B]" /> {boutique.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <Star className="w-4 h-4 fill-current" /> {boutique.rating} Rating
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{boutique.ordersFulfilled}+ Orders Fulfilled</span>
              </div>
            </div>
          </div>

          {/* Contact Inquiry CTA - fully rounded */}
          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="px-7 py-3.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message Atelier</span>
          </button>
        </div>

        {/* Bio & Policies strip - rounded-2xl, no borders/shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-sm text-[#252321]">
          <div className="bg-white p-6 rounded-2xl">
            <span className="font-medium text-sm text-[#B66F7B] uppercase tracking-wider block mb-2">
              About the Atelier
            </span>
            <p className="text-[#252321]/80 leading-relaxed">{boutique.description}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <span className="font-medium text-sm text-[#B66F7B] uppercase tracking-wider block mb-2">
              Delivery & Dispatch
            </span>
            <p className="text-[#252321]/80 leading-relaxed">{boutique.policies.shipping}</p>
            <p className="text-[#A99B8D] mt-3 flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4" /> Processing time: {boutique.processingTime}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl">
            <span className="font-medium text-sm text-[#B66F7B] uppercase tracking-wider block mb-2">
              Return & Sizing Policy
            </span>
            <p className="text-[#252321]/80 leading-relaxed">{boutique.policies.returns}</p>
            <p className="text-[#A99B8D] mt-3 flex items-center gap-1.5 font-medium">
              <Truck className="w-4 h-4" /> Coverage: {boutique.deliveryCoverage}
            </p>
          </div>
        </div>
      </div>

      {/* Catalog in Shop */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 space-y-8">
        {/* Search & Categories inside Boutique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#252321] text-white'
                  : 'bg-white text-[#252321] hover:bg-[#F3E7E5]'
              }`}
            >
              All Pieces ({boutiqueProducts.length})
            </button>
            {boutique.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#252321] text-white'
                    : 'bg-white text-[#252321] hover:bg-[#F3E7E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search inside shop */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#A99B8D]" />
            <input
              type="text"
              placeholder={`Search in ${boutique.name}...`}
              value={shopSearch}
              onChange={(e) => setShopSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-full text-[#252321] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl p-8 text-sm text-[#A99B8D]">
            No pieces match this filter in {boutique.name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-[#252321]/70 rounded-full hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-editorial font-normal text-[#252321]">
              Message {boutique.name}
            </h3>
            <p className="text-sm text-[#A99B8D] mt-1 mb-5">
              Ask about custom alterations, upcoming restocks, or bulk orders in Bangladesh.
            </p>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                required
                className="w-full text-sm p-3.5 bg-[#FAF8F5] rounded-full px-5"
              />
              <textarea
                placeholder="Write your question or request..."
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                rows={4}
                required
                className="w-full text-sm p-4 bg-[#FAF8F5] rounded-2xl"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-[#252321] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
