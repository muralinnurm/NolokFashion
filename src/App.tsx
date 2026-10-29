import React from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/storefront/HomePage';
import { CatalogPage } from './components/storefront/CatalogPage';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { BoutiqueStorefrontPage } from './components/storefront/BoutiqueStorefrontPage';
import { CartPage } from './components/storefront/CartPage';
import { CheckoutPage } from './components/storefront/CheckoutPage';
import { OrderTrackingPage } from './components/storefront/OrderTrackingPage';
import { CustomerAccountPage } from './components/account/CustomerAccountPage';
import { SellerRegistrationPage } from './components/seller/SellerRegistrationPage';
import { SellerDashboardPage } from './components/seller/SellerDashboardPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { currentView } = useMarketplace();

  return (
    <main className={`min-h-[calc(100vh-160px)] ${currentView === 'home' ? '' : 'pt-4 sm:pt-6'}`}>
      {currentView === 'home' && <HomePage />}
      {currentView === 'catalog' && <CatalogPage />}
      {currentView === 'product-detail' && <ProductDetailPage />}
      {currentView === 'boutique' && <BoutiqueStorefrontPage />}
      {currentView === 'cart' && <CartPage />}
      {currentView === 'checkout' && <CheckoutPage />}
      {(currentView === 'order-confirmation' || currentView === 'order-tracking') && (
        <OrderTrackingPage />
      )}
      {currentView === 'customer-account' && <CustomerAccountPage />}
      {currentView === 'seller-register' && <SellerRegistrationPage />}
      {currentView === 'seller-dashboard' && <SellerDashboardPage />}
      {currentView === 'admin' && <AdminDashboardPage />}
    </main>
  );
};

export function App() {
  return (
    <MarketplaceProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#252321]">
        <AnnouncementBar />
        <Navbar />
        <MainContent />
        <Footer />

        {/* Global Modals & Notifications */}
        <SearchModal />
        <QuickViewModal />
        <SizeGuideModal />
        <ToastContainer />
      </div>
    </MarketplaceProvider>
  );
}

export default App;
