import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  ShieldCheck,
  Store,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Tag,
  Mail,
  CheckCircle2,
  Star,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    boutiques,
    products,
    orders,
    sellerApplications,
    reviewSellerApplication,
    toggleBoutiqueStatus,
    toggleProductFeatured,
    toggleProductStatus,
    settings,
    updatePlatformSettings,
    coupons,
    addCoupon,
    newsletterSubscribers,
    navigateTo,
    showToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'applications' | 'sellers' | 'products' | 'orders' | 'settings' | 'coupons' | 'newsletter'
  >('overview');

  // Platform Metrics
  const totalPlatformGMV = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingApps = sellerApplications.filter((a) => a.status === 'pending');
  const activeSellers = boutiques.filter((b) => b.status === 'active');
  const publishedProducts = products.filter((p) => p.status === 'published');
  const totalCommissionEarned = Math.round(
    orders.reduce((acc, o) => acc + o.subtotal, 0) * (settings.commissionRatePercent / 100)
  );

  // Settings State Form
  const [announcementText, setAnnouncementText] = useState(settings.announcementText);
  const [announcementVisible, setAnnouncementVisible] = useState(settings.announcementVisible);
  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroSubtext, setHeroSubtext] = useState(settings.heroSubtext);
  const [commissionRate, setCommissionRate] = useState(settings.commissionRatePercent);
  const [dhakaFee, setDhakaFee] = useState(settings.dhakaDeliveryFee);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState(settings.outsideDhakaDeliveryFee);

  // Coupon Creation Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(2500);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      announcementText,
      announcementVisible,
      heroHeadline,
      heroSubtext,
      commissionRatePercent: Number(commissionRate),
      dhakaDeliveryFee: Number(dhakaFee),
      outsideDhakaDeliveryFee: Number(outsideDhakaFee)
    });
    showToast('Platform settings saved successfully.', 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: Number(newCouponValue),
      minOrder: Number(newCouponMinOrder),
      validUntil: '2026-12-31',
      isActive: true
    });
    setNewCouponCode('');
    showToast('New coupon created.', 'success');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Admin Header */}
      <div className="bg-[#252321] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#B66F7B]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-editorial font-normal">Nolok Marketplace Administration</h1>
              <span className="text-sm bg-emerald-900 text-emerald-200 px-3.5 py-1 rounded-full font-mono">
                Super Admin
              </span>
            </div>
            <p className="text-sm text-[#FAF8F5]/70 mt-1">
              Platform governance, artisan boutique curation, commission management & Bangladesh dispatch rules
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors self-start md:self-auto cursor-pointer"
        >
          View Public Storefront
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-4 space-y-2 text-sm font-medium uppercase tracking-wider text-[#252321]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'applications' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4" />
              <span>Seller Applications</span>
            </div>
            {pendingApps.length > 0 && (
              <span className="text-sm bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-mono">
                {pendingApps.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'sellers' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Store className="w-4 h-4" />
              <span>Active Boutiques</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({activeSellers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Catalog Moderation</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Commissions</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Platform Content & Fees</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'coupons' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4" />
              <span>Promotions & Coupons</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'newsletter' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4" />
              <span>Newsletter Subscribers</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({newsletterSubscribers.length})</span>
          </button>
        </aside>

        {/* Tab Workspace (9 cols) */}
        <div className="lg:col-span-9 space-y-6 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Platform GMV
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    ৳ {totalPlatformGMV.toLocaleString('en-IN')}
                  </p>
                  <span className="text-sm text-emerald-700 block mt-1">Live customer checkout volume</span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Marketplace Revenue ({settings.commissionRatePercent}%)
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#B66F7B] mt-2 tabular-nums">
                    ৳ {totalCommissionEarned.toLocaleString('en-IN')}
                  </p>
                  <span className="text-sm text-[#A99B8D] block mt-1">Commission retained</span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Active Boutiques
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    {activeSellers.length}
                  </p>
                  <span className="text-sm text-[#A99B8D] block mt-1">
                    {pendingApps.length} applications pending
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Published Pieces
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    {publishedProducts.length}
                  </p>
                  <span className="text-sm text-[#A99B8D] block mt-1">Across 8 fashion categories</span>
                </div>
              </div>

              {/* Pending Applications Alert Banner */}
              {pendingApps.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
                    <div>
                      <p className="font-medium text-amber-900 text-base">
                        {pendingApps.length} Boutique Application(s) Awaiting Review
                      </p>
                      <p className="text-[#252321]/70 text-sm mt-0.5">
                        Review workshop credentials and approve or reject with feedback notes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('applications')}
                    className="px-6 py-3 bg-amber-800 text-white font-medium rounded-full text-sm cursor-pointer hover:bg-amber-900 transition-colors"
                  >
                    Review Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SELLER APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Boutique & Reseller Applications
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Curate artisan workshops before they can publish listings on Nolok.
                </p>
              </div>

              <div className="space-y-4">
                {sellerApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl p-6 space-y-4 bg-[#FAF8F5]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                      <div>
                        <h3 className="text-lg font-medium text-[#252321]">{app.shopName}</h3>
                        <p className="text-sm text-[#A99B8D] mt-0.5">
                          Founder: {app.fullName} · {app.phone} · {app.email}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium uppercase px-3.5 py-1 rounded-full ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-sm text-[#252321]/80 leading-relaxed">
                      <span className="font-medium text-[#252321]">Craftsmanship Story:</span> {app.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-sm text-[#A99B8D]">
                      <span>Pickup: {app.pickupAddress}, {app.division} Division</span>
                      <span aria-hidden="true">·</span>
                      <span>Categories: {app.categories.join(', ')}</span>
                    </div>

                    {app.status === 'pending' && (
                      <div className="pt-3 flex justify-end gap-3">
                        <button
                          onClick={() => reviewSellerApplication(app.id, false, 'Quality standards')}
                          className="px-6 py-2.5 bg-white text-[#B64545] rounded-full font-medium cursor-pointer hover:bg-rose-50 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => reviewSellerApplication(app.id, true)}
                          className="px-6 py-2.5 bg-[#252321] hover:bg-[#383533] text-white rounded-full font-medium cursor-pointer flex items-center gap-2 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Launch Boutique</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ACTIVE SELLERS */}
          {activeTab === 'sellers' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Active Boutiques ({boutiques.length})
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Suspend or reinstate boutiques and monitor order volume.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Boutique</th>
                      <th className="py-3 px-3">Location</th>
                      <th className="py-3 px-3">Listed Pieces</th>
                      <th className="py-3 px-3">Orders Fulfilled</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {boutiques.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                        <td className="py-3.5 px-3 flex items-center gap-3">
                          <ImageWithFallback
                            src={b.logo}
                            alt={b.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#252321]">{b.name}</p>
                            <p className="text-sm text-[#A99B8D]">{b.tagline}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#252321]/80">{b.location}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">{b.totalProducts}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">{b.ordersFulfilled}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-sm font-medium uppercase px-3 py-1 rounded-full ${
                              b.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-[#B64545]'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() =>
                              toggleBoutiqueStatus(
                                b.id,
                                b.status === 'active' ? 'suspended' : 'active'
                              )
                            }
                            className="text-sm font-medium text-[#B66F7B] hover:text-[#9e5c67] cursor-pointer"
                          >
                            {b.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT CATALOG MODERATION */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Marketplace Product Moderation ({products.length})
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Pin editorial features or toggle visibility of individual listings.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Piece</th>
                      <th className="py-3 px-3">Boutique</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Homepage Featured</th>
                      <th className="py-3 px-3">State</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                        <td className="py-3.5 px-3 flex items-center gap-3">
                          <ImageWithFallback
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#252321] line-clamp-1">{p.title}</p>
                            <p className="text-sm text-[#A99B8D]">{p.category}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#252321]/80">{p.boutiqueName}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">
                          ৳ {p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => toggleProductFeatured(p.id)}
                            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-sm ${
                              p.featured
                                ? 'bg-amber-100 text-amber-900 font-medium'
                                : 'bg-[#FAF8F5] text-[#A99B8D] hover:text-[#252321]'
                            }`}
                          >
                            <Star className={`w-4 h-4 ${p.featured ? 'fill-current' : ''}`} />
                            <span>{p.featured ? 'Featured' : 'Standard'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full uppercase ${
                              p.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() =>
                              toggleProductStatus(
                                p.id,
                                p.status === 'published' ? 'draft' : 'published'
                              )
                            }
                            className="text-sm text-[#B66F7B] hover:text-[#9e5c67] font-medium cursor-pointer"
                          >
                            {p.status === 'published' ? 'Hide' : 'Publish'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS & COMMISSIONS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  All Marketplace Orders & Revenue Breakdown
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Multi-seller order log showing customer payments and seller payouts.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Order</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Gross Total</th>
                      <th className="py-3 px-3">Platform Fee ({settings.commissionRatePercent}%)</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {orders.map((ord) => {
                      const comm = Math.round(
                        ord.subtotal * (settings.commissionRatePercent / 100)
                      );
                      return (
                        <tr key={ord.id} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                          <td className="py-3.5 px-3 font-mono font-medium">{ord.orderNumber}</td>
                          <td className="py-3.5 px-3">
                            <p className="font-medium">{ord.customer.fullName}</p>
                            <p className="text-sm text-[#A99B8D]">{ord.customer.division}</p>
                          </td>
                          <td className="py-3.5 px-3 font-medium tabular-nums">
                            ৳ {ord.total.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 text-emerald-800 font-medium tabular-nums">
                            ৳ {comm.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3 font-medium uppercase">{ord.paymentMethod}</td>
                          <td className="py-3.5 px-3">
                            <span className="px-3 py-1 rounded-full bg-[#F3E7E5] text-sm font-medium uppercase">
                              {ord.overallStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              onClick={() =>
                                navigateTo('order-tracking', { orderNumber: ord.orderNumber })
                              }
                              className="text-sm font-medium text-[#B66F7B] hover:text-[#9e5c67] cursor-pointer"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="bg-white rounded-2xl p-6 sm:p-10 space-y-6"
            >
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Platform Content & Fee Configuration
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Update homepage messaging, shipping fees, and marketplace commission rules without code redeploys.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-medium mb-2 text-[#252321]">
                    Top Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">
                      Marketplace Commission (%)
                    </label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">
                      Inside Dhaka Delivery Fee (৳)
                    </label>
                    <input
                      type="number"
                      value={dhakaFee}
                      onChange={(e) => setDhakaFee(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">
                      Outside Dhaka Delivery Fee (৳)
                    </label>
                    <input
                      type="number"
                      value={outsideDhakaFee}
                      onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Hero Headline</label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Hero Subtitle</label>
                  <textarea
                    rows={2}
                    value={heroSubtext}
                    onChange={(e) => setHeroSubtext(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer transition-colors"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 7: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Coupons & Promotional Codes
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Create seasonal and campaign vouchers for checkout discounts.
                </p>
              </div>

              {/* Create coupon */}
              <form onSubmit={handleCreateCoupon} className="p-6 bg-[#FAF8F5] rounded-2xl space-y-4">
                <h3 className="font-medium text-sm uppercase tracking-wider text-[#252321]">
                  Create New Voucher
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="CODE (e.g. BOISHAKH15)"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="p-3.5 rounded-full text-sm font-mono uppercase bg-white focus:outline-none"
                  />
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="p-3.5 rounded-full text-sm bg-white cursor-pointer focus:outline-none"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="flat">Flat BDT Discount (৳)</option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Discount Value"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="p-3.5 rounded-full text-sm bg-white tabular-nums focus:outline-none"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Min Order (৳)"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="p-3.5 rounded-full text-sm bg-white tabular-nums focus:outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium rounded-full cursor-pointer transition-colors"
                  >
                    Add Coupon
                  </button>
                </div>
              </form>

              {/* Coupons List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Code</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Value</th>
                      <th className="py-3 px-3">Min Order</th>
                      <th className="py-3 px-3">Valid Until</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                        <td className="py-3.5 px-3 font-mono font-medium text-base text-[#252321]">{c.code}</td>
                        <td className="py-3.5 px-3 capitalize text-[#252321]/80">{c.discountType}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">
                          {c.discountType === 'percentage' ? `${c.value}%` : `৳ ${c.value}`}
                        </td>
                        <td className="py-3.5 px-3 tabular-nums font-medium">৳ {c.minOrder.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-3 text-[#A99B8D]">{c.validUntil}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span className="text-sm bg-emerald-100 text-emerald-800 font-medium px-3.5 py-1 rounded-full">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'newsletter' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                    Notes on Style Subscribers ({newsletterSubscribers.length})
                  </h2>
                  <p className="text-sm text-[#A99B8D] mt-1">
                    Real email subscriptions recorded via the homepage dispatch box.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Exported subscriber CSV list', 'success')}
                  className="px-6 py-2.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] rounded-full text-sm font-medium transition-colors cursor-pointer"
                >
                  Export CSV
                </button>
              </div>

              <div className="space-y-3">
                {newsletterSubscribers.map((email) => (
                  <div key={email} className="p-4 bg-[#FAF8F5] rounded-2xl flex items-center justify-between text-sm">
                    <span className="font-medium text-[#252321]">{email}</span>
                    <span className="text-sm text-[#A99B8D]">Verified Subscriber</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
