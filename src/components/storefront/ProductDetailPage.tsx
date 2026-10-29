import React, { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCard } from '../common/ProductCard';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  Star,
  Store,
  Ruler,
  Check,
  ArrowRight,
  Send
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductId,
    products,
    boutiques,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setIsSizeGuideOpen,
    reviews,
    addReview,
    showToast
  } = useMarketplace();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const boutique = boutiques.find((b) => b.id === product?.boutiqueId) || boutiques[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'boutique'>('details');

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('Dhaka');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || null);
      setActiveImageIdx(0);
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) return null;

  const isSaved = isInWishlist(product.id);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.boutiqueId === product.boutiqueId))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      showToast('Please select your size', 'error');
      return;
    }
    if (!selectedColor) {
      showToast('Please select a color', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please select size and color', 'error');
      return;
    }
    const added = addToCart(product, selectedSize, selectedColor, quantity);
    if (added) navigateTo('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review remarks', 'error');
      return;
    }
    addReview({
      productId: product.id,
      customerName: reviewName,
      customerCity: reviewCity,
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true
    });
    setReviewName('');
    setReviewComment('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#A99B8D] flex items-center gap-2">
        <button onClick={() => navigateTo('home')} className="hover:text-[#252321] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigateTo('catalog', { category: product.category })}
          className="hover:text-[#252321] cursor-pointer"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#252321] font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-3/4 w-full bg-[#F3E7E5] rounded-3xl overflow-hidden relative">
            <ImageWithFallback
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.title}
              fallbackCategory={product.category}
              className="w-full h-full object-cover"
            />
            {product.isNewArrival && (
              <span className="absolute top-4 left-4 bg-[#252321] text-white text-sm font-medium uppercase px-3.5 py-1 tracking-wider rounded-full">
                New Arrival
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden cursor-pointer transition-all ${
                    activeImageIdx === idx
                      ? 'ring-2 ring-[#252321] opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback src={img} alt="Angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module (5 cols) - rounded-3xl, no borders/shadows */}
        <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-3xl space-y-6">
          {/* Boutique Title Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                navigateTo('boutique', {
                  boutiqueSlug: boutique.slug || product.boutiqueName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                })
              }
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#B66F7B] hover:text-[#252321] transition-colors cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>{product.boutiqueName}</span>
            </button>
            <span className="text-sm text-[#A99B8D] font-mono">SKU: {product.sku}</span>
          </div>

          {/* Title & Rating */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#252321] leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-[#A99B8D]">
              <div className="flex items-center text-amber-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-medium text-[#252321] tabular-nums">
                  {product.rating}
                </span>
              </div>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {product.reviewCount} verified reviews
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">{product.condition}</span>
            </div>
          </div>

          {/* Price */}
          <div className="py-4 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-[#252321] tabular-nums">
              ৳ {product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-base text-[#A99B8D] line-through tabular-nums font-normal">
                  ৳ {product.compareAtPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#B66F7B] font-medium">
                  (Save ৳{(product.compareAtPrice - product.price).toLocaleString('en-IN')})
                </span>
              </>
            )}
          </div>

          {/* Color Option Selector */}
          {product.colors.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm mb-2.5">
                <span className="font-medium text-[#252321]">Selected Shade:</span>
                <span className="text-[#A99B8D] font-medium">{selectedColor?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`p-1 rounded-full transition-all cursor-pointer ${
                      selectedColor?.name === color.name
                        ? 'ring-2 ring-[#252321] scale-105'
                        : 'hover:opacity-80'
                    }`}
                    title={color.name}
                  >
                    <span
                      className="w-7 h-7 rounded-full block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2.5">
              <span className="font-medium text-[#252321]">Select Size:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#B66F7B] underline font-medium flex items-center gap-1.5 cursor-pointer text-sm"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2.5 text-sm font-medium rounded-full cursor-pointer transition-colors ${
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

          {/* Quantity & Stock */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center bg-[#FAF8F5] rounded-full p-1 text-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E7E5] transition-colors cursor-pointer font-medium"
              >
                -
              </button>
              <span className="px-4 font-medium tabular-nums">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E7E5] transition-colors disabled:opacity-30 cursor-pointer font-medium"
              >
                +
              </button>
            </div>

            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>{product.stock} units ready in atelier</span>
                </span>
              ) : (
                <span className="text-[#B64545] font-medium">Sold Out</span>
              )}
            </div>
          </div>

          {/* Action CTAs - fully rounded buttons, no borders or shadows */}
          <div className="space-y-3 pt-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-4 bg-[#F3E7E5] hover:bg-[#ebd8d5] text-[#252321] text-sm uppercase tracking-wider font-medium rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-full cursor-pointer transition-colors ${
                  isSaved
                    ? 'bg-[#B66F7B] text-white'
                    : 'bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321]'
                }`}
                aria-label="Save piece"
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-wider font-medium rounded-full transition-colors cursor-pointer"
            >
              Buy Now (Express Checkout)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 space-y-2.5 text-sm text-[#252321]/80">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#B66F7B] shrink-0" />
              <span>Inside Dhaka 24-48 hrs (৳70) · Outside Dhaka 3-4 days (৳130)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#B66F7B] shrink-0" />
              <span>7-Day Inspection & Size Exchange Policy</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B66F7B] shrink-0" />
              <span>Cash on Delivery or bKash / Nagad verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Details / Fabric / Boutique / Shipping - rounded-3xl container */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="flex flex-wrap gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-5 py-2.5 rounded-full cursor-pointer transition-colors ${
              activeTab === 'details'
                ? 'bg-[#252321] text-white font-medium'
                : 'bg-[#FAF8F5] text-[#A99B8D] hover:text-[#252321]'
            }`}
          >
            Fabric & Craft Details
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-2.5 rounded-full cursor-pointer transition-colors ${
              activeTab === 'shipping'
                ? 'bg-[#252321] text-white font-medium'
                : 'bg-[#FAF8F5] text-[#A99B8D] hover:text-[#252321]'
            }`}
          >
            Shipping & Returns
          </button>
          <button
            onClick={() => setActiveTab('boutique')}
            className={`px-5 py-2.5 rounded-full cursor-pointer transition-colors ${
              activeTab === 'boutique'
                ? 'bg-[#252321] text-white font-medium'
                : 'bg-[#FAF8F5] text-[#A99B8D] hover:text-[#252321]'
            }`}
          >
            About {product.boutiqueName}
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#252321] leading-relaxed pt-2">
            <div>
              <h4 className="font-medium text-base mb-2">Description</h4>
              <p className="text-[#252321]/80">{product.description}</p>
            </div>
            <div className="space-y-3.5 bg-[#FAF8F5] p-6 rounded-2xl">
              <div>
                <span className="font-medium text-[#252321]">Fabric Composition:</span>
                <p className="text-[#252321]/80 mt-0.5">{product.fabric}</p>
              </div>
              <div>
                <span className="font-medium text-[#252321]">Care Instructions:</span>
                <p className="text-[#252321]/80 mt-0.5">{product.care}</p>
              </div>
              <div>
                <span className="font-medium text-[#252321]">Category:</span>
                <p className="text-[#252321]/80 mt-0.5">
                  {product.category} · {product.subcategory}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="text-sm text-[#252321] space-y-3 max-w-2xl leading-relaxed pt-2">
            <h4 className="font-medium text-base">Delivery across Bangladesh</h4>
            <p>
              All orders are packed with care directly by {product.boutiqueName} and dispatched via verified couriers (Pathao, Steadfast, or RedX).
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-[#252321]/80 pt-1">
              <li>Inside Dhaka: Delivered within 24 to 48 hours for ৳70.</li>
              <li>Outside Dhaka & Suburbs: Delivered within 3 to 4 business days for ৳130.</li>
              <li>Same-day express dispatch available in Dhaka before 12 PM for ৳150.</li>
              <li>Returns: 7-day inspection window. Unworn items with tags can be exchanged easily.</li>
            </ul>
          </div>
        )}

        {activeTab === 'boutique' && (
          <div className="flex flex-col sm:flex-row gap-6 items-start pt-2">
            <ImageWithFallback
              src={boutique.logo}
              alt={boutique.name}
              className="w-20 h-20 rounded-full object-cover shrink-0"
            />
            <div className="space-y-2 text-sm">
              <h4 className="font-medium text-base text-[#252321]">{boutique.name}</h4>
              <p className="text-[#A99B8D]">{boutique.tagline} · Located in {boutique.location}</p>
              <p className="text-[#252321]/80 leading-relaxed max-w-xl">{boutique.description}</p>
              <button
                onClick={() =>
                  navigateTo('boutique', {
                    boutiqueSlug: boutique.slug || product.boutiqueName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                  })
                }
                className="mt-2 px-5 py-2.5 bg-[#FAF8F5] text-[#B66F7B] hover:text-[#252321] font-medium rounded-full flex items-center gap-2 cursor-pointer w-fit"
              >
                <span>Visit Boutique Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Reviews Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="text-2xl font-editorial font-normal text-[#252321]">
              Verified Customer Reviews
            </h3>
            <p className="text-sm text-[#A99B8D] mt-0.5">
              Authentic feedback from verified Bangladeshi buyers
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#F3E7E5] px-4 py-2 rounded-full text-sm font-medium text-[#252321]">
            <Star className="w-4 h-4 fill-[#B66F7B] text-[#B66F7B]" />
            <span>{product.rating} / 5.0</span>
          </div>
        </div>

        {/* Existing reviews */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-sm text-[#A99B8D]">
              Be the first to review this atelier piece after purchase!
            </p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-5 bg-[#FAF8F5] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-[#252321]">{rev.customerName}</span>
                    <span className="text-[#A99B8D]">({rev.customerCity})</span>
                    {rev.verifiedPurchase && (
                      <span className="text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-medium">
                        <Check className="w-3.5 h-3.5" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-[#A99B8D]">{rev.date}</span>
                </div>
                <div className="flex text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#252321]/80 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Write a review form */}
        <form onSubmit={handleReviewSubmit} className="pt-6 space-y-4">
          <h4 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
            Leave a Review
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Your Full Name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              required
              className="text-sm p-3 bg-[#FAF8F5] rounded-full px-4"
            />
            <input
              type="text"
              placeholder="City (e.g., Dhaka, Chittagong)"
              value={reviewCity}
              onChange={(e) => setReviewCity(e.target.value)}
              className="text-sm p-3 bg-[#FAF8F5] rounded-full px-4"
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="text-sm p-3 bg-[#FAF8F5] rounded-full px-4 cursor-pointer"
            >
              <option value="5">5 Stars - Exceptional Drape & Quality</option>
              <option value="4">4 Stars - Very Good</option>
              <option value="3">3 Stars - Average</option>
            </select>
          </div>
          <textarea
            placeholder="Describe the fabric quality, stitching, and fit..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={2}
            required
            className="w-full text-sm p-4 bg-[#FAF8F5] rounded-2xl"
          />
          <button
            type="submit"
            className="px-7 py-3 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer flex items-center gap-2"
          >
            <span>Submit Verified Review</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-editorial font-normal text-[#252321]">
              You May Also Like
            </h3>
            <button
              onClick={() => navigateTo('catalog', { category: product.category })}
              className="text-sm font-medium text-[#B66F7B] hover:underline"
            >
              View More in {product.category}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
