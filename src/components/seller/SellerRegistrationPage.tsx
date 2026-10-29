import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { BANGLADESH_DIVISIONS } from '../../data/mockData';
import { ProductCategory } from '../../types';
import {
  Store,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_OPTIONS: ProductCategory[] = [
  'Sarees',
  'Kurtis & Tunics',
  'Three-Piece Suits',
  'Modest Fashion',
  'Dresses & Co-ords',
  'Western Wear',
  'Festive Collections',
  'Bags & Accessories'
];

export const SellerRegistrationPage: React.FC = () => {
  const {
    submitSellerApplication,
    setActiveRole,
    navigateTo
  } = useMarketplace();

  // Form State
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+880 1');
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(['Sarees']);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    submitSellerApplication({
      fullName,
      shopName,
      email,
      phone,
      description,
      pickupAddress,
      division,
      categories: selectedCategories
    });

    setSubmittedAppId('submitted');
  };

  if (submittedAppId) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-20 text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
            Application Received
          </h1>
          <p className="text-sm text-[#252321]/80 leading-relaxed">
            Thank you for applying to launch <span className="font-medium text-[#252321]">{shopName}</span> on Nolok. Our marketplace curator team will review your textile craftsmanship standards and reach out via phone or email within 24 hours.
          </p>

          <div className="bg-white rounded-2xl p-6 text-sm text-left space-y-3">
            <div className="flex items-center justify-between text-[#252321] font-medium pb-2">
              <span>Application Status</span>
              <span className="text-sm bg-amber-100 text-amber-800 px-3.5 py-1 rounded-full font-mono uppercase">
                Pending Curation
              </span>
            </div>
            <p className="text-[#A99B8D]">Boutique: <span className="text-[#252321]">{shopName}</span></p>
            <p className="text-[#A99B8D]">Primary Region: <span className="text-[#252321]">{division} Division</span></p>
            <p className="text-[#A99B8D]">Contact: <span className="text-[#252321]">{phone} · {email}</span></p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setActiveRole('admin');
                navigateTo('admin');
              }}
              className="px-8 py-4 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#383533] transition-colors"
            >
              Switch to Admin (Approve Application)
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="px-8 py-4 bg-white text-[#252321] text-sm font-medium rounded-full cursor-pointer hover:bg-[#FAF8F5] transition-colors"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#B66F7B] bg-[#F3E7E5] px-4 py-1.5 rounded-full">
          <Store className="w-4 h-4" />
          <span>Seller Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
          Open Your Boutique Atelier on Nolok
        </h1>
        <p className="text-sm text-[#252321]/70 leading-relaxed font-light">
          Connect your women's fashion brand or handloom weaving workshop with fashion enthusiasts across all 64 districts in Bangladesh.
        </p>
      </div>

      {/* Onboarding Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-10 space-y-8 text-sm">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#252321] pb-1">
            1. Boutique & Owner Identity
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Owner / Founder Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tasnim Anam"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Boutique / Shop Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Handloom Studio"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Contact Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+880 17XX-XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Official Email *</label>
            <input
              type="email"
              required
              placeholder="atelier@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#252321] pb-1">
            2. Workshop & Inventory Focus
          </h2>
        </div>

        <div>
          <label className="block font-medium mb-2 text-[#252321]">Boutique Story & Craftsmanship *</label>
          <textarea
            required
            rows={3}
            placeholder="Tell us about the fabrics, artisan techniques, or modest designs you produce..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Courier Pickup Division *</label>
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            >
              {Object.keys(BANGLADESH_DIVISIONS).map((divName) => (
                <option key={divName} value={divName}>
                  {divName} Division
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 text-[#252321]">Pickup Street Address / Atelier Hub *</label>
            <input
              type="text"
              required
              placeholder="e.g. House 14, Road 4, Sector 7, Uttara, Dhaka"
              value={pickupAddress}
              onChange={(e) => setPickupAddress(e.target.value)}
              className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-3 text-[#252321]">Primary Fashion Categories *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORY_OPTIONS.map((cat) => {
              const selected = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3.5 rounded-full text-center cursor-pointer transition-all ${
                    selected
                      ? 'bg-[#252321] text-white font-medium'
                      : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Seller agreement */}
        <div className="pt-2">
          <label className="flex items-start gap-3 text-sm text-[#252321]/80 cursor-pointer p-4 bg-[#FAF8F5] rounded-2xl">
            <input
              type="checkbox"
              required
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="w-5 h-5 accent-[#B66F7B] mt-0.5 rounded cursor-pointer"
            />
            <span className="leading-relaxed">
              I confirm that all listed fashion products are genuine women's fashion items, adhere to quality craftsmanship standards, and agree to the 8% marketplace curation commission upon fulfilled sales.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agreedTerms}
          className="w-full py-4 bg-[#252321] hover:bg-[#383533] disabled:opacity-40 text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer transition-all"
        >
          Submit Boutique Application
        </button>
      </form>
    </div>
  );
};
