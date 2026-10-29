import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from '../common/ProductCard';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ProductCategory } from '../../types';
import {
  ArrowRight,
  Store,
  Sparkles,
  ChevronRight,
  Send,
  MapPin,
  Star,
  ShieldCheck,
  Truck
} from 'lucide-react';

const CATEGORY_TILES: { name: ProductCategory; image: string; description: string }[] = [
  {
    name: 'Sarees',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Dhakai Jamdani & Katan silks'
  },
  {
    name: 'Kurtis & Tunics',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    description: 'Chikankari & breathable cotton'
  },
  {
    name: 'Modest Fashion',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80',
    description: 'Japanese Nida abayas & hijabs'
  },
  {
    name: 'Three-Piece Suits',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-embroidered salwar sets'
  },
  {
    name: 'Dresses & Co-ords',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    description: 'Breezy linen & relaxed silhouettes'
  },
  {
    name: 'Western Wear',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    description: 'Tailored trousers & everyday shirts'
  },
  {
    name: 'Festive Collections',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    description: 'Zari craftsmanship & occasion wear'
  },
  {
    name: 'Bags & Accessories',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    description: 'Zari velvet potlis & artisan totes'
  }
];

export const HomePage: React.FC = () => {
  const {
    products,
    boutiques,
    settings,
    navigateTo,
    setCatalogCategoryFilter,
    subscribeNewsletter
  } = useMarketplace();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await subscribeNewsletter(newsletterEmail);
    setNewsletterStatus({ message: result.message, isError: !result.success });
    if (result.success) setNewsletterEmail('');
  };

  const newArrivals = products.filter((p) => p.isNewArrival && p.status === 'published').slice(0, 4);
  const editorsPicks = products.filter((p) => p.isEditorsPick && p.status === 'published').slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* Modern High-Impact Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
          <div className="bg-gradient-to-br from-[#FAF8F5] via-[#F3E7E5]/50 to-[#FAF8F5] rounded-3xl p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left z-10">
                <div className="inline-flex items-center gap-2 bg-white/90 text-[#B66F7B] px-4 py-2 rounded-full text-sm font-medium tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>Curated Women's Fashion · Bangladesh</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-editorial tracking-tight text-[#252321] leading-[1.12]">
                  {settings.heroHeadline}
                </h1>

                <p className="text-base sm:text-lg text-[#252321]/75 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  {settings.heroSubtext}
                </p>

                {/* Fully rounded CTA buttons without borders or shadows */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={() => {
                      setCatalogCategoryFilter('All');
                      navigateTo('catalog');
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium rounded-full transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>Explore Collections</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const elem = document.getElementById('meet-the-boutiques');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      else navigateTo('catalog');
                    }}
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F3E7E5] text-[#252321] text-sm font-medium rounded-full transition-all cursor-pointer"
                  >
                    Discover Boutiques
                  </button>
                </div>

                {/* Trust Badges - modern soft cards */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#252321]">Handloom Jamdani</p>
                      <p className="text-sm text-[#A99B8D]">Heritage Sonargaon weave</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B] shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#252321]">Cash on Delivery</p>
                      <p className="text-sm text-[#A99B8D]">64 districts nationwide</p>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B] shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#252321]">7-Day Inspection</p>
                      <p className="text-sm text-[#A99B8D]">Hassle-free exchange</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Modern Layered Editorial Composition */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Primary Editorial Image */}
                  <div className="aspect-4/5 rounded-3xl overflow-hidden bg-[#F3E7E5]">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                      alt="Handwoven Dhakai Jamdani Saree"
                      fallbackCategory="Jamdani Saree"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                    />
                  </div>

                  {/* Modern Floating Atelier Pill Card */}
                  <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-5 rounded-2xl max-w-[260px] text-left space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-[#252321]">5.0 Atelier Rating</span>
                    </div>
                    <p className="text-sm font-editorial text-[#252321] font-medium">
                      Sonargaon 84-Count Muslin
                    </p>
                    <p className="text-sm text-[#A99B8D]">
                      Preserving traditional geometric needle motifs in pure cotton.
                    </p>
                  </div>

                  {/* Modern Floating Top Badge */}
                  <div className="absolute top-4 right-4 bg-[#252321]/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                    New Season '26
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category - 1440px container, rounded-2xl, no borders/shadows */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B] mb-1">
              Curated Wardrobe
            </p>
            <h2 className="text-3xl font-normal font-editorial text-[#252321]">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => {
              setCatalogCategoryFilter('All');
              navigateTo('catalog');
            }}
            className="text-sm font-medium text-[#252321] hover:text-[#B66F7B] transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-5 py-2.5 rounded-full"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          {CATEGORY_TILES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => {
                setCatalogCategoryFilter(cat.name);
                navigateTo('catalog', { category: cat.name });
              }}
              className="group relative flex flex-col rounded-2xl overflow-hidden bg-white cursor-pointer transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="aspect-4/3 w-full bg-[#F3E7E5] overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  fallbackCategory={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-[#252321] group-hover:text-[#B66F7B] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#A99B8D] mt-0.5">{cat.description}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#252321] group-hover:bg-[#F3E7E5] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Just Arrived - New Arrivals Grid */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B] mb-1">
              Fresh from Independent Ateliers
            </p>
            <h2 className="text-3xl font-normal font-editorial text-[#252321]">
              Just Arrived
            </h2>
          </div>
          <button
            onClick={() => {
              setCatalogCategoryFilter('All');
              navigateTo('catalog');
            }}
            className="text-sm font-medium text-[#252321] hover:text-[#B66F7B] transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-5 py-2.5 rounded-full"
          >
            <span>View All New Arrivals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Curated Collections (Editorial) - Rounded-3xl container */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#F3E7E5]/40 rounded-3xl p-8 sm:p-14">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B] mb-1">
              Curated Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-editorial text-[#252321]">
              Editorial Collections
            </h2>
            <p className="text-sm text-[#252321]/70 mt-2 font-light">
              Thoughtfully curated fashion stories for the contemporary Bangladeshi wardrobe.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Collection 1 */}
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-16/10 bg-[#F3E7E5] overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80"
                  alt="Dhakai Heritage"
                  fallbackCategory="Heritage Sarees"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-editorial font-normal text-[#252321]">
                    Traditional Favorites
                  </h3>
                  <p className="text-sm text-[#252321]/70 mt-2 leading-relaxed">
                    Centuries-old Jamdani handweaves, Tangail cottons, and heirloom Katan silks sourced directly from master artisan families.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Sarees');
                    navigateTo('catalog', { category: 'Sarees' });
                  }}
                  className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Shop Saree Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collection 2 */}
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-16/10 bg-[#F3E7E5] overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=700&q=80"
                  alt="Modest & Modern"
                  fallbackCategory="Modest Gowns"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-editorial font-normal text-[#252321]">
                    Modest & Modern
                  </h3>
                  <p className="text-sm text-[#252321]/70 mt-2 leading-relaxed">
                    Flowing Japanese Nida kimonos, breathable layered co-ords, and elegant neutral tones designed for effortless everyday grace.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Modest Fashion');
                    navigateTo('catalog', { category: 'Modest Fashion' });
                  }}
                  className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Shop Modest Edits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Collection 3 */}
            <div className="bg-white rounded-2xl overflow-hidden flex flex-col justify-between group transition-transform duration-300 hover:-translate-y-1">
              <div className="aspect-16/10 bg-[#F3E7E5] overflow-hidden rounded-t-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=80"
                  alt="Everyday Elegance"
                  fallbackCategory="Linen Sets"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-editorial font-normal text-[#252321]">
                    Everyday Elegance
                  </h3>
                  <p className="text-sm text-[#252321]/70 mt-2 leading-relaxed">
                    Comilla khadi, pure organic linen separates, and easy-care block prints tailored for Dhaka's climate and everyday errands.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCatalogCategoryFilter('Dresses & Co-ords');
                    navigateTo('catalog', { category: 'Dresses & Co-ords' });
                  }}
                  className="w-full py-3 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] text-sm font-medium rounded-full transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Shop Everyday Linen</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Boutiques - 1440px container, rounded-2xl cards */}
      <section id="meet-the-boutiques" className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B] mb-1">
              Independent Resellers & Boutiques
            </p>
            <h2 className="text-3xl font-normal font-editorial text-[#252321]">
              Meet the Boutiques
            </h2>
            <p className="text-sm text-[#A99B8D] mt-1">
              Connect directly with verified independent boutiques across Dhaka, Chittagong, and beyond.
            </p>
          </div>
          <button
            onClick={() => navigateTo('catalog')}
            className="text-sm font-medium text-[#252321] hover:text-[#B66F7B] transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-5 py-2.5 rounded-full"
          >
            <span>Browse All Boutiques</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {boutiques.map((boutique) => (
            <div
              key={boutique.id}
              onClick={() => navigateTo('boutique', { boutiqueSlug: boutique.slug })}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 cursor-pointer group"
            >
              <div>
                {/* Logo & Info */}
                <div className="flex items-center gap-3.5 mb-4">
                  <ImageWithFallback
                    src={boutique.logo}
                    alt={boutique.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-medium text-[#252321] group-hover:text-[#B66F7B] transition-colors leading-snug">
                      {boutique.name}
                    </h3>
                    <p className="text-sm text-[#A99B8D] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B66F7B]" />
                      <span>{boutique.location}</span>
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[#252321]/75 line-clamp-3 leading-relaxed mb-4">
                  {boutique.description}
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {boutique.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-sm text-[#252321]/70 bg-[#FAF8F5] px-3 py-1 rounded-full font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info & CTA */}
              <div className="pt-4 flex items-center justify-between text-sm">
                <span className="text-[#A99B8D] font-medium tabular-nums">
                  {boutique.totalProducts} pieces
                </span>
                <span className="text-[#B66F7B] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Visit Shop <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B] mb-1">
              Curated Selection
            </p>
            <h2 className="text-3xl font-normal font-editorial text-[#252321]">
              Editor's Picks
            </h2>
          </div>
          <button
            onClick={() => {
              setCatalogCategoryFilter('All');
              navigateTo('catalog');
            }}
            className="text-sm font-medium text-[#252321] hover:text-[#B66F7B] transition-colors flex items-center gap-1.5 cursor-pointer bg-white px-5 py-2.5 rounded-full"
          >
            <span>Explore All Picks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {editorsPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Seller Invitation Banner - rounded-3xl, no borders, fully rounded buttons */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#252321] text-[#FAF8F5] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
          <div className="max-w-xl space-y-5 relative z-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm uppercase tracking-wider text-[#B66F7B] font-medium">
              <Store className="w-4 h-4" />
              <span>For Independent Resellers & Boutiques</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-editorial tracking-tight text-white leading-tight">
              Your Boutique Deserves a Bigger Audience.
            </h2>

            <p className="text-base text-[#FAF8F5]/80 font-light leading-relaxed">
              Bring your women's fashion collection online, manage your products in one place, and connect with customers across Bangladesh.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button
                onClick={() => navigateTo('seller-register')}
                className="w-full sm:w-auto px-8 py-4 bg-[#B66F7B] hover:bg-[#a55f6b] text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
              >
                Start Selling
              </button>
              <button
                onClick={() => navigateTo('seller-register')}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors cursor-pointer"
              >
                Learn How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section: Notes on Style - rounded-3xl, fully rounded buttons */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 text-center">
        <div className="bg-white rounded-3xl p-10 sm:p-16 space-y-4 max-w-3xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest text-[#B66F7B]">
            Fashion Dispatch
          </p>
          <h2 className="text-3xl font-normal font-editorial text-[#252321]">
            Notes on Style
          </h2>
          <p className="text-sm text-[#252321]/70 max-w-md mx-auto leading-relaxed">
            Get new collection updates and discover boutiques worth knowing across Bangladesh.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="flex-1 px-5 py-3.5 text-sm bg-[#FAF8F5] rounded-full text-[#252321] placeholder-[#A99B8D] focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-7 py-3.5 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium rounded-full cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            {newsletterStatus && (
              <p
                className={`text-sm ${
                  newsletterStatus.isError ? 'text-[#B64545]' : 'text-emerald-700'
                }`}
              >
                {newsletterStatus.message}
              </p>
            )}

            <p className="text-sm text-[#A99B8D] pt-1">
              We respect your inbox. Unsubscribe anytime with one click.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};
