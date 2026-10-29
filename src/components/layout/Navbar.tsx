import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, Heart, ShoppingBag, Menu, X, Store, Shield, UserCheck, LogIn, LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    navigateTo,
    cartTotalCount,
    wishlist,
    activeRole,
    setActiveRole,
    setIsSearchOpen,
    setCatalogCategoryFilter,
    currentUser,
    authLoading,
    signInWithGoogle,
    signOutUser
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#252321] hover:text-[#B66F7B] transition-colors rounded-full cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Zone 1: Wordmark */}
          <button
            onClick={() => {
              setCatalogCategoryFilter('All');
              navigateTo('home');
            }}
            className="text-2xl sm:text-3xl font-normal tracking-tight text-[#252321] font-editorial whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            Nolok
          </button>

          {/* Zone 2: Nav links (14px minimum, font-medium, rounded-full) */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium tracking-wide text-[#252321]/80">
            <button
              onClick={() => {
                setCatalogCategoryFilter('All');
                navigateTo('catalog');
              }}
              className="px-4 py-2 hover:text-[#B66F7B] hover:bg-[#F3E7E5]/50 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer text-sm"
            >
              New Arrivals
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Dresses & Co-ords');
                navigateTo('catalog', { category: 'Dresses & Co-ords' });
              }}
              className="px-4 py-2 hover:text-[#B66F7B] hover:bg-[#F3E7E5]/50 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer text-sm"
            >
              Clothing
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Sarees');
                navigateTo('catalog', { category: 'Sarees' });
              }}
              className="px-4 py-2 hover:text-[#B66F7B] hover:bg-[#F3E7E5]/50 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer text-sm"
            >
              Traditional Wear
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Modest Fashion');
                navigateTo('catalog', { category: 'Modest Fashion' });
              }}
              className="px-4 py-2 hover:text-[#B66F7B] hover:bg-[#F3E7E5]/50 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer text-sm"
            >
              Modest
            </button>
            <button
              onClick={() => {
                navigateTo('catalog');
              }}
              className="px-4 py-2 hover:text-[#B66F7B] hover:bg-[#F3E7E5]/50 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer text-sm"
            >
              Boutiques
            </button>
          </nav>

          {/* Zone 3: Actions + Firebase Auth + Role Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-[#252321]/80 hover:text-[#B66F7B] transition-colors rounded-full hover:bg-[#F3E7E5]/60 cursor-pointer"
              aria-label="Search collections, fabrics, or boutiques"
              title="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('customer-account')}
              className="relative p-2.5 text-[#252321]/80 hover:text-[#B66F7B] transition-colors rounded-full hover:bg-[#F3E7E5]/60 cursor-pointer"
              aria-label="View saved pieces"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B66F7B] text-[#FAF8F5] text-sm font-medium rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Bag */}
            <button
              onClick={() => navigateTo('cart')}
              className="relative p-2.5 text-[#252321]/80 hover:text-[#B66F7B] transition-colors rounded-full hover:bg-[#F3E7E5]/60 cursor-pointer"
              aria-label="View shopping bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartTotalCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#252321] text-[#FAF8F5] text-sm font-medium rounded-full flex items-center justify-center tabular-nums">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Firebase Auth Status / Button */}
            {!authLoading && (
              currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#F3E7E5] hover:bg-[#ebd8d5] text-[#252321] rounded-full transition-colors cursor-pointer text-sm font-medium"
                    title={currentUser.displayName || currentUser.email || 'My Account'}
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#B66F7B] text-white flex items-center justify-center text-sm font-medium">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden xl:inline text-sm font-medium max-w-[100px] truncate">
                      {currentUser.displayName?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 z-50 text-sm font-medium text-[#252321]"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b-0 bg-[#FAF8F5] rounded-xl mb-1">
                        <p className="text-sm font-medium text-[#252321] truncate">
                          {currentUser.displayName || 'Customer'}
                        </p>
                        <p className="text-sm text-[#A99B8D] truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={() => navigateTo('customer-account')}
                        className="w-full text-left px-4 py-2.5 rounded-full hover:bg-[#FAF8F5] flex items-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#A99B8D]" />
                        <span>Account & Orders</span>
                      </button>
                      <button
                        onClick={() => signOutUser()}
                        className="w-full text-left px-4 py-2.5 rounded-full hover:bg-[#F3E7E5] text-[#B66F7B] flex items-center gap-2 text-sm font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#252321] hover:bg-[#383533] text-white rounded-full text-sm font-medium transition-colors cursor-pointer"
                  title="Sign in with Google"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )
            )}

            {/* Role switch toggle - fully rounded pills, no border/shadow */}
            <div className="hidden sm:flex items-center bg-[#F3E7E5] p-1 rounded-full text-sm font-medium text-[#252321]">
              <button
                onClick={() => {
                  setActiveRole('customer');
                  navigateTo('home');
                }}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-sm ${
                  activeRole === 'customer'
                    ? 'bg-white text-[#252321] font-medium'
                    : 'text-[#252321]/60 hover:text-[#252321]'
                }`}
                title="Customer storefront experience"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden md:inline">Customer</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole('seller');
                  navigateTo('seller-dashboard');
                }}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-sm ${
                  activeRole === 'seller'
                    ? 'bg-white text-[#252321] font-medium'
                    : 'text-[#252321]/60 hover:text-[#252321]'
                }`}
                title="Seller Boutique Portal"
              >
                <Store className="w-4 h-4" />
                <span className="hidden md:inline">Seller Hub</span>
              </button>
              <button
                onClick={() => {
                  setActiveRole('admin');
                  navigateTo('admin');
                }}
                className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-sm ${
                  activeRole === 'admin'
                    ? 'bg-white text-[#252321] font-medium'
                    : 'text-[#252321]/60 hover:text-[#252321]'
                }`}
                title="Marketplace Administration"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden md:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] px-6 pt-3 pb-8 space-y-4">
          <div className="flex flex-col space-y-2 text-sm uppercase tracking-wider text-[#252321]">
            <button
              onClick={() => {
                setCatalogCategoryFilter('All');
                navigateTo('catalog');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-full text-left hover:bg-[#F3E7E5] cursor-pointer"
            >
              New Arrivals
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Dresses & Co-ords');
                navigateTo('catalog', { category: 'Dresses & Co-ords' });
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-full text-left hover:bg-[#F3E7E5] cursor-pointer"
            >
              Clothing
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Sarees');
                navigateTo('catalog', { category: 'Sarees' });
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-full text-left hover:bg-[#F3E7E5] cursor-pointer"
            >
              Traditional Wear
            </button>
            <button
              onClick={() => {
                setCatalogCategoryFilter('Modest Fashion');
                navigateTo('catalog', { category: 'Modest Fashion' });
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-full text-left hover:bg-[#F3E7E5] cursor-pointer"
            >
              Modest Fashion
            </button>
            <button
              onClick={() => {
                navigateTo('customer-account');
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-4 rounded-full text-left hover:bg-[#F3E7E5] cursor-pointer"
            >
              My Account & Tracking
            </button>

            {/* Mobile Auth button */}
            {currentUser ? (
              <button
                onClick={() => {
                  signOutUser();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-4 rounded-full text-left text-[#B66F7B] hover:bg-[#F3E7E5] cursor-pointer flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.displayName || currentUser.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 px-4 rounded-full text-left bg-[#252321] text-white cursor-pointer flex items-center gap-2 justify-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>

          {/* Role switcher for mobile */}
          <div className="pt-2">
            <p className="text-sm text-[#A99B8D] uppercase tracking-wider mb-2 px-2">Switch View Mode</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <button
                onClick={() => {
                  setActiveRole('customer');
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-full cursor-pointer ${
                  activeRole === 'customer'
                    ? 'bg-white font-medium'
                    : 'bg-[#F3E7E5]/70 text-[#252321]/70'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => {
                  setActiveRole('seller');
                  navigateTo('seller-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-full cursor-pointer ${
                  activeRole === 'seller'
                    ? 'bg-white font-medium'
                    : 'bg-[#F3E7E5]/70 text-[#252321]/70'
                }`}
              >
                Seller Hub
              </button>
              <button
                onClick={() => {
                  setActiveRole('admin');
                  navigateTo('admin');
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-2 text-center rounded-full cursor-pointer ${
                  activeRole === 'admin'
                    ? 'bg-white font-medium'
                    : 'bg-[#F3E7E5]/70 text-[#252321]/70'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
