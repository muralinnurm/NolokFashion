import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Shield,
  Trash2,
  LogIn,
  LogOut,
  CheckCircle2
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    navigateTo,
    showToast,
    currentUser,
    signInWithGoogle,
    signOutUser
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'security'>('overview');

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const displayName = currentUser?.displayName || 'Nusrat Jahan';
  const displayEmail = currentUser?.email || 'nusrat.jahan@gmail.com';
  const initial = (displayName[0] || 'N').toUpperCase();

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Account Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          {currentUser?.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#F3E7E5] text-[#B66F7B] flex items-center justify-center font-editorial text-2xl font-medium">
              {initial}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                Welcome, {displayName}
              </h1>
              {currentUser?.emailVerified && (
                <span className="inline-flex items-center gap-1 text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium" title="Google Verified Account">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-[#A99B8D] mt-1">
              {displayEmail} · {currentUser ? 'Connected with Firebase Auth' : 'Guest Account Mode'} · Dhaka, Bangladesh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => signOutUser()}
              className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-sm font-medium rounded-full text-[#B66F7B] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="px-6 py-2.5 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium rounded-full flex items-center gap-2 transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Sidebar Nav (3 cols) */}
        <aside className="md:col-span-3 bg-white rounded-2xl p-4 space-y-2 text-sm font-medium uppercase tracking-wider text-[#252321]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#252321] text-white font-medium' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#252321] text-white font-medium' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4" />
              <span>My Orders</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'bg-[#252321] text-white font-medium' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({savedProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-[#252321] text-white font-medium' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-[#252321] text-white font-medium' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Firebase</span>
          </button>
        </aside>

        {/* Content Area (9 cols) */}
        <div className="md:col-span-9 space-y-6">
          {/* TAB: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Total Orders
                  </span>
                  <p className="text-3xl font-medium font-mono text-[#252321] mt-2">
                    {orders.length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Saved Pieces
                  </span>
                  <p className="text-3xl font-medium font-mono text-[#252321] mt-2">
                    {savedProducts.length}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Sync Status
                  </span>
                  <p className="text-base font-medium text-[#252321] mt-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    {currentUser ? 'Firebase Cloud' : 'Local Storage'}
                  </p>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                    Recent Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-[#B66F7B] hover:text-[#9e5c67] font-medium cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="p-5 bg-[#FAF8F5] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-medium text-base font-mono">{order.orderNumber}</p>
                        <p className="text-[#A99B8D] mt-1">
                          Total: ৳ {order.total.toLocaleString('en-IN')} · {order.sellerGroups.length} boutique group(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full bg-[#F3E7E5] text-[#252321] font-medium uppercase text-sm">
                          {order.overallStatus}
                        </span>
                        <button
                          onClick={() => navigateTo('order-tracking', { orderNumber: order.orderNumber })}
                          className="px-5 py-2.5 bg-[#252321] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-[#383533] transition-colors"
                        >
                          Track Status
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
              <h2 className="text-2xl font-editorial font-normal text-[#252321] pb-2">
                Order History
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-base text-[#A99B8D]">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="mt-4 px-6 py-3 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#383533]"
                  >
                    Explore Boutique Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-6 bg-[#FAF8F5] rounded-2xl space-y-4 text-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-0 pb-2">
                        <div>
                          <p className="font-medium font-mono text-base">{order.orderNumber}</p>
                          <p className="text-[#A99B8D] text-sm mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3.5 py-1 rounded-full bg-[#F3E7E5] text-[#252321] font-medium uppercase text-sm">
                            {order.overallStatus}
                          </span>
                          <button
                            onClick={() => navigateTo('order-tracking', { orderNumber: order.orderNumber })}
                            className="px-4 py-2 bg-[#252321] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-[#383533]"
                          >
                            Track
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                        <div>
                          <span className="text-[#A99B8D] uppercase font-medium block">Delivery Details</span>
                          <p className="text-[#252321] mt-1 font-medium">{order.customer.fullName}</p>
                          <p className="text-[#252321]/80">{order.customer.streetAddress}, {order.customer.area}</p>
                          <p className="text-[#252321]/80">{order.customer.district}, {order.customer.division}</p>
                        </div>
                        <div>
                          <span className="text-[#A99B8D] uppercase font-medium block">Payment Summary</span>
                          <p className="text-[#252321] mt-1 uppercase font-medium">Method: {order.paymentMethod}</p>
                          <p className="text-[#252321]/80">Status: {order.paymentStatus}</p>
                          <p className="text-[#252321] font-medium mt-1">Total: ৳ {order.total.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
              <h2 className="text-2xl font-editorial font-normal text-[#252321] pb-2">
                Saved Wishlist ({savedProducts.length})
              </h2>

              {savedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-base text-[#A99B8D]">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => navigateTo('catalog')}
                    className="mt-4 px-6 py-3 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#383533]"
                  >
                    Discover Fashion Pieces
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedProducts.map((p) => (
                    <div key={p.id} className="bg-[#FAF8F5] rounded-2xl p-4 flex flex-col justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-32 rounded-xl overflow-hidden bg-white shrink-0">
                          <ImageWithFallback
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium text-[#B66F7B] uppercase block">
                            {p.boutiqueName}
                          </span>
                          <h4 className="font-editorial text-base text-[#252321] line-clamp-2">
                            {p.title}
                          </h4>
                          <p className="text-sm font-medium text-[#252321]">
                            ৳ {p.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => addToCart(p, p.sizes[0] || 'Standard', p.colors[0] || { name: 'Natural', hex: '#fff' })}
                          className="flex-1 py-2.5 bg-[#252321] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-[#383533] transition-colors"
                        >
                          Move to Bag
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[#A99B8D] hover:text-[#B64545] hover:bg-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
              <h2 className="text-2xl font-editorial font-normal text-[#252321] pb-2">
                Saved Delivery Addresses
              </h2>
              <div className="rounded-2xl p-5 space-y-2.5 bg-[#FAF8F5]">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-base text-[#252321]">Home (Default)</span>
                  <span className="text-sm bg-emerald-100 text-emerald-800 font-medium px-3.5 py-1 rounded-full">
                    Primary
                  </span>
                </div>
                <p className="text-[#252321]/80">{displayName} · +880 1711-223344</p>
                <p className="text-[#252321]/80">House 42, Road 27, Flat 4B, Dhanmondi</p>
                <p className="text-[#252321]/80">Dhaka South, Dhaka Division, Bangladesh</p>
              </div>
            </div>
          )}

          {/* TAB: Security & Firebase */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
              <h2 className="text-2xl font-editorial font-normal text-[#252321] pb-2">
                Security & Firebase Authentication
              </h2>
              <p className="text-[#A99B8D]">
                Account authenticated securely via Google Firebase Auth & Cloud Firestore.
              </p>

              <div className="space-y-4 max-w-md pt-2">
                <div>
                  <label className="block font-medium mb-1.5 text-[#252321]">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={displayEmail}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm opacity-80"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1.5 text-[#252321]">Firebase User UID</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.uid || 'Not connected (guest)'}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm font-mono opacity-80"
                  />
                </div>
                <div className="pt-2">
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => signOutUser()}
                      className="px-8 py-3.5 bg-[#FAF8F5] text-[#B66F7B] hover:bg-[#F3E7E5] text-sm font-medium rounded-full cursor-pointer transition-colors"
                    >
                      Sign Out of Firebase
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="px-8 py-3.5 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#383533] transition-colors"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
