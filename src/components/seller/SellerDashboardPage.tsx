import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCategory, OrderStatus } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Boxes,
  Truck,
  Settings,
  DollarSign,
  Eye,
  Trash2,
  X
} from 'lucide-react';

const CATEGORY_LIST: ProductCategory[] = [
  'Sarees',
  'Kurtis & Tunics',
  'Three-Piece Suits',
  'Modest Fashion',
  'Dresses & Co-ords',
  'Western Wear',
  'Festive Collections',
  'Bags & Accessories'
];

export const SellerDashboardPage: React.FC = () => {
  const {
    boutiques,
    activeSellerBoutiqueId,
    setActiveSellerBoutiqueId,
    products,
    createProduct,
    updateProduct,
    deleteProduct,
    updateBoutiqueSettings,
    orders,
    updateSellerOrderStatus,
    settings,
    navigateTo,
    showToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'add-product' | 'inventory' | 'orders' | 'settings' | 'payouts'
  >('overview');

  // Current active boutique
  const currentBoutique =
    boutiques.find((b) => b.id === activeSellerBoutiqueId) || boutiques[0];

  // Boutique's products & orders
  const boutiqueProducts = useMemo(() => {
    return products.filter((p) => p.boutiqueId === currentBoutique.id);
  }, [products, currentBoutique.id]);

  // Extract seller orders from global orders
  const sellerOrders = useMemo(() => {
    const list: {
      orderNumber: string;
      createdAt: string;
      customer: any;
      group: any;
      paymentStatus: string;
      paymentMethod: string;
    }[] = [];

    orders.forEach((ord) => {
      const matchGroup = ord.sellerGroups.find((g) => g.sellerId === currentBoutique.id);
      if (matchGroup) {
        list.push({
          orderNumber: ord.orderNumber,
          createdAt: ord.createdAt,
          customer: ord.customer,
          group: matchGroup,
          paymentStatus: ord.paymentStatus,
          paymentMethod: ord.paymentMethod
        });
      }
    });

    return list;
  }, [orders, currentBoutique.id]);

  // Metrics
  const grossSales = sellerOrders.reduce((acc, o) => acc + o.group.subtotal, 0);
  const commissionRate = settings.commissionRatePercent / 100;
  const platformCommission = Math.round(grossSales * commissionRate);
  const netEarnings = grossSales - platformCommission;

  const lowStockCount = boutiqueProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Kurtis & Tunics');
  const [newSubcategory, setNewSubcategory] = useState('Festive Kurti');
  const [newPrice, setNewPrice] = useState(2850);
  const [newComparePrice, setNewComparePrice] = useState(3400);
  const [newFabric, setNewFabric] = useState('Pure Cotton Handloom');
  const [newCare, setNewCare] = useState('Gentle hand wash in cold water');
  const [newStock, setNewStock] = useState(12);
  const [newSku, setNewSku] = useState(`SKU-${Date.now().toString().slice(-4)}`);
  const [newSizes, setNewSizes] = useState('38, 40, 42, 44');
  const [newCondition, setNewCondition] = useState<'Brand New' | 'Artisan Handloom' | 'Boutique Exclusive'>('Brand New');
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
  );
  const [newDescription, setNewDescription] = useState(
    'Hand-stitched women’s piece crafted with fine threadwork for comfortable daily elegance.'
  );

  // Order Fulfillment Modal State
  const [selectedOrderToFulfill, setSelectedOrderToFulfill] = useState<{
    orderNumber: string;
    group: any;
  } | null>(null);
  const [courierName, setCourierName] = useState('Pathao Courier');
  const [trackingNumber, setTrackingNumber] = useState('PTH-DH-84912');
  const [newStatus, setNewStatus] = useState<OrderStatus>('shipped');

  // Boutique Settings Form
  const [editName, setEditName] = useState(currentBoutique.name);
  const [editTagline, setEditTagline] = useState(currentBoutique.tagline);
  const [editDesc, setEditDesc] = useState(currentBoutique.description);
  const [editLocation, setEditLocation] = useState(currentBoutique.location);
  const [editCoverage, setEditCoverage] = useState(currentBoutique.deliveryCoverage);
  const [editProcessing, setEditProcessing] = useState(currentBoutique.processingTime);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = newSizes.split(',').map((s) => s.trim()).filter(Boolean);

    createProduct({
      title: newTitle,
      price: Number(newPrice),
      compareAtPrice: Number(newComparePrice) || undefined,
      boutiqueId: currentBoutique.id,
      boutiqueName: currentBoutique.name,
      category: newCategory,
      subcategory: newSubcategory,
      images: [newImage],
      description: newDescription,
      fabric: newFabric,
      care: newCare,
      sizes: sizesArray.length ? sizesArray : ['Free Size'],
      colors: [
        { name: 'Classic Rose', hex: '#B66F7B' },
        { name: 'Warm Cream', hex: '#FAF8F5' }
      ],
      stock: Number(newStock),
      sku: newSku || `SKU-${Date.now().toString().slice(-4)}`,
      status: 'published',
      featured: false,
      condition: newCondition
    });

    showToast(`Piece "${newTitle}" published successfully!`, 'success');
    setActiveTab('products');
    setNewTitle('');
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBoutiqueSettings(currentBoutique.id, {
      name: editName,
      tagline: editTagline,
      description: editDesc,
      location: editLocation,
      deliveryCoverage: editCoverage,
      processingTime: editProcessing
    });
    showToast('Storefront details updated successfully.', 'success');
  };

  const handleFulfillOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderToFulfill) return;
    updateSellerOrderStatus(
      selectedOrderToFulfill.orderNumber,
      currentBoutique.id,
      newStatus,
      courierName,
      trackingNumber
    );
    setSelectedOrderToFulfill(null);
    showToast('Shipment status updated.', 'success');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Top Banner: Boutique Switcher & Storefront Link */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-5">
          <ImageWithFallback
            src={currentBoutique.logo}
            alt={currentBoutique.name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                {currentBoutique.name}
              </h1>
              <span className="text-sm bg-emerald-100 text-emerald-800 font-medium px-3.5 py-1 rounded-full">
                Active Atelier
              </span>
            </div>
            <p className="text-sm text-[#A99B8D] flex items-center gap-2 mt-1">
              <span>{currentBoutique.location}</span>
              <span aria-hidden="true">·</span>
              <span>Commission: {settings.commissionRatePercent}%</span>
            </p>
          </div>
        </div>

        {/* Switch Boutique dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-[#A99B8D]">Switch Boutique:</span>
          <select
            value={currentBoutique.id}
            onChange={(e) => setActiveSellerBoutiqueId(e.target.value)}
            className="bg-[#FAF8F5] rounded-full px-5 py-2.5 text-sm text-[#252321] cursor-pointer focus:outline-none"
          >
            {boutiques.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.location.split(',')[0]})
              </option>
            ))}
          </select>
          <button
            onClick={() => navigateTo('boutique', { boutiqueSlug: currentBoutique.slug })}
            className="px-6 py-2.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] rounded-full text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#B66F7B]" />
            <span>Public Storefront</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Seller Sidebar Navigation (3 cols) */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-4 space-y-2 text-sm font-medium uppercase tracking-wider text-[#252321]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'products' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({boutiqueProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'add-product' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Piece</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'inventory' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Boxes className="w-4 h-4" />
              <span>Inventory</span>
            </div>
            {lowStockCount > 0 && (
              <span className="text-sm bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-mono">
                {lowStockCount} low
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center justify-between transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4" />
              <span>Atelier Orders</span>
            </div>
            <span className="text-sm font-mono tabular-nums">({sellerOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'payouts' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Sales & Payouts</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left py-3 px-4 rounded-full flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#252321] text-white' : 'hover:bg-[#FAF8F5]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Storefront Settings</span>
          </button>
        </aside>

        {/* Tab Content Workspace (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 text-sm">
                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Gross Atelier Sales
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    ৳ {grossSales.toLocaleString('en-IN')}
                  </p>
                  <span className="text-sm text-emerald-700 mt-1 block">Live fulfilled volume</span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Net Earnings (After 8%)
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-emerald-700 mt-2 tabular-nums">
                    ৳ {netEarnings.toLocaleString('en-IN')}
                  </p>
                  <span className="text-sm text-[#A99B8D] mt-1 block">Payable via bKash / Bank</span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Total Orders
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    {sellerOrders.length}
                  </p>
                  <span className="text-sm text-[#A99B8D] mt-1 block">
                    {sellerOrders.filter((o) => o.group.status === 'placed').length} awaiting confirmation
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Listed Pieces
                  </span>
                  <p className="text-2xl sm:text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    {boutiqueProducts.length}
                  </p>
                  <span className="text-sm text-[#A99B8D] mt-1 block">
                    {lowStockCount} with low stock
                  </span>
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                    Recent Atelier Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-[#B66F7B] hover:text-[#9e5c67] font-medium"
                  >
                    View All Orders
                  </button>
                </div>

                {sellerOrders.length === 0 ? (
                  <p className="text-sm text-[#A99B8D] py-8 text-center">
                    No orders placed for this boutique yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="text-[#A99B8D] uppercase text-sm">
                          <th className="py-3 px-3">Order</th>
                          <th className="py-3 px-3">Customer / City</th>
                          <th className="py-3 px-3">Pieces</th>
                          <th className="py-3 px-3">Atelier Total</th>
                          <th className="py-3 px-3">Fulfillment</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        {sellerOrders.slice(0, 5).map((ord) => (
                          <tr key={ord.orderNumber} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                            <td className="py-3.5 px-3 font-mono font-medium">{ord.orderNumber}</td>
                            <td className="py-3.5 px-3">
                              <p className="font-medium text-[#252321]">{ord.customer.fullName}</p>
                              <p className="text-sm text-[#A99B8D]">{ord.customer.division}</p>
                            </td>
                            <td className="py-3.5 px-3">
                              {ord.group.items.map((it: any) => it.product.title).join(', ').slice(0, 30)}...
                            </td>
                            <td className="py-3.5 px-3 font-medium tabular-nums">
                              ৳ {ord.group.subtotal.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-3.5 py-1 rounded-full bg-[#F3E7E5] text-[#252321] font-medium text-sm uppercase">
                                {ord.group.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrderToFulfill({
                                    orderNumber: ord.orderNumber,
                                    group: ord.group
                                  });
                                  setNewStatus(ord.group.status);
                                }}
                                className="px-5 py-2 bg-[#252321] hover:bg-[#383533] text-white text-sm rounded-full font-medium cursor-pointer transition-colors"
                              >
                                Fulfill
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                <div>
                  <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                    Listed Fashion Catalog ({boutiqueProducts.length})
                  </h2>
                  <p className="text-sm text-[#A99B8D] mt-1">
                    Manage active and draft listings for {currentBoutique.name}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="px-6 py-3 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Piece</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Piece</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {boutiqueProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                        <td className="py-3.5 px-3 flex items-center gap-3">
                          <ImageWithFallback
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-14 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-medium text-[#252321] line-clamp-1">{p.title}</p>
                            <p className="text-sm text-[#A99B8D]">SKU: {p.sku}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-[#252321]/80">{p.category}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">
                          ৳ {p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`font-medium tabular-nums ${
                              p.stock <= 3 ? 'text-[#B64545]' : 'text-[#252321]'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() =>
                              updateProduct(p.id, {
                                status: p.status === 'published' ? 'draft' : 'published'
                              })
                            }
                            className={`text-sm font-medium px-3.5 py-1 rounded-full cursor-pointer ${
                              p.status === 'published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          <button
                            onClick={() => navigateTo('product-detail', { productId: p.id })}
                            className="p-2 text-[#A99B8D] hover:text-[#252321] rounded-full hover:bg-white"
                            title="Preview piece"
                          >
                            <Eye className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-2 text-[#A99B8D] hover:text-[#B64545] rounded-full hover:bg-white"
                            title="Remove listing"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ADD PRODUCT */}
          {activeTab === 'add-product' && (
            <form
              onSubmit={handleCreateProduct}
              className="bg-white rounded-2xl p-6 sm:p-10 space-y-6 text-sm"
            >
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Add New Fashion Piece to {currentBoutique.name}
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Publish a new handcrafted saree, kurti, abaya, or suit with size and fabric details.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Block-Printed Khadi Summer Kurti"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none"
                    >
                      {CATEGORY_LIST.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Subcategory</label>
                    <input
                      type="text"
                      placeholder="e.g. Jamdani, Co-ords, Abayas"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Price (৳ BDT) *</label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Compare Price (৳)</label>
                    <input
                      type="number"
                      value={newComparePrice}
                      onChange={(e) => setNewComparePrice(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm tabular-nums focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Fabric & Material *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100% Comilla Khadi Cotton"
                      value={newFabric}
                      onChange={(e) => setNewFabric(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Available Sizes (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="38, 40, 42, 44 or S, M, L, XL"
                      value={newSizes}
                      onChange={(e) => setNewSizes(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Care Instructions</label>
                    <input
                      type="text"
                      placeholder="e.g. Dry clean only or gentle hand wash"
                      value={newCare}
                      onChange={(e) => setNewCare(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Craft Condition</label>
                    <select
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value as any)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Artisan Handloom">Artisan Handloom</option>
                      <option value="Boutique Exclusive">Boutique Exclusive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Image Asset URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Detailed Story & Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the silhouette, fit, motifs, and drape..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-3 bg-[#FAF8F5] text-sm font-medium rounded-full cursor-pointer hover:bg-[#F3E7E5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer transition-colors"
                >
                  Publish Piece
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Atelier Stock & Inventory Control
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Update inventory counts in real-time. When stock reaches 0, pieces are automatically marked as sold out.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-[#A99B8D] uppercase text-sm">
                      <th className="py-3 px-3">Piece</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3">Unit Price</th>
                      <th className="py-3 px-3">Available Stock</th>
                      <th className="py-3 px-3">Stock Warning</th>
                      <th className="py-3 px-3 text-right">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {boutiqueProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5] rounded-xl transition-colors">
                        <td className="py-3.5 px-3 font-medium text-[#252321]">{p.title}</td>
                        <td className="py-3.5 px-3 font-mono text-[#A99B8D]">{p.sku}</td>
                        <td className="py-3.5 px-3 font-medium tabular-nums">
                          ৳ {p.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 font-medium font-mono text-sm tabular-nums">
                          {p.stock}
                        </td>
                        <td className="py-3.5 px-3">
                          {p.stock <= 0 ? (
                            <span className="text-sm bg-rose-100 text-[#B64545] px-3 py-1 rounded-full font-medium">
                              Sold Out
                            </span>
                          ) : p.stock <= 5 ? (
                            <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                              Low Stock ({p.stock})
                            </span>
                          ) : (
                            <span className="text-sm text-emerald-700 font-medium">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center bg-[#FAF8F5] p-1 rounded-full">
                            <button
                              onClick={() =>
                                updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })
                              }
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-sm font-medium cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="px-3 font-mono text-sm">{p.stock}</span>
                            <button
                              onClick={() =>
                                updateProduct(p.id, { stock: p.stock + 5 })
                              }
                              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-sm font-medium cursor-pointer transition-colors"
                              title="+5 units"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Atelier Fulfillment & Couriers
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Confirm orders, generate courier tracking references, and update dispatch status.
                </p>
              </div>

              {sellerOrders.length === 0 ? (
                <p className="text-sm text-[#A99B8D] py-8 text-center">
                  No orders received yet for {currentBoutique.name}.
                </p>
              ) : (
                <div className="space-y-4">
                  {sellerOrders.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="bg-[#FAF8F5] rounded-2xl p-6 space-y-4 text-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                        <div>
                          <span className="font-mono font-medium text-base text-[#252321]">
                            Order {ord.orderNumber}
                          </span>
                          <span className="text-[#A99B8D] ml-3">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium tabular-nums">
                            Atelier Total: ৳ {ord.group.subtotal.toLocaleString('en-IN')}
                          </span>
                          <span className="px-3.5 py-1 rounded-full bg-[#F3E7E5] font-medium text-sm uppercase">
                            {ord.group.status}
                          </span>
                        </div>
                      </div>

                      {/* Recipient summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white p-4 rounded-xl">
                        <div>
                          <p className="font-medium text-[#252321]">{ord.customer.fullName}</p>
                          <p className="text-[#A99B8D] mt-0.5">{ord.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-[#252321]">{ord.customer.streetAddress}, {ord.customer.area}</p>
                          <p className="text-[#A99B8D] mt-0.5">{ord.customer.district}, {ord.customer.division}</p>
                        </div>
                      </div>

                      {/* Ordered pieces */}
                      <div className="space-y-2">
                        {ord.group.items.map((it: any) => (
                          <div key={it.productId} className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl">
                            <span className="font-medium">
                              {it.quantity}x {it.product.title} (Size: {it.selectedSize}, Color: {it.selectedColor.name})
                            </span>
                            <span className="font-medium tabular-nums">
                              ৳ {(it.product.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Dispatch and tracking info */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-sm text-[#A99B8D]">
                          {ord.group.courier ? (
                            <span className="text-emerald-700 font-medium">
                              Dispatched with {ord.group.courier} (Tracking: {ord.group.trackingNumber})
                            </span>
                          ) : (
                            <span>Awaiting dispatch booking</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrderToFulfill({
                              orderNumber: ord.orderNumber,
                              group: ord.group
                            });
                            setNewStatus(ord.group.status);
                          }}
                          className="px-6 py-2.5 bg-[#252321] hover:bg-[#383533] text-white text-sm font-medium rounded-full cursor-pointer transition-colors"
                        >
                          Update Status & Courier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SALES REPORTS & PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-sm">
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Atelier Earnings & Settlement
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Transparent breakdown of gross sales, marketplace commission, and payout withdrawals in Bangladesh.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 bg-[#FAF8F5] rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Gross Merchandise Sales
                  </span>
                  <p className="text-3xl font-medium font-mono text-[#252321] mt-2 tabular-nums">
                    ৳ {grossSales.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-6 bg-[#FAF8F5] rounded-2xl">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Marketplace Fee ({settings.commissionRatePercent}%)
                  </span>
                  <p className="text-3xl font-medium font-mono text-[#B66F7B] mt-2 tabular-nums">
                    -৳ {platformCommission.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-2xl">
                  <span className="text-emerald-800 uppercase font-medium text-sm block">
                    Net Available for Payout
                  </span>
                  <p className="text-3xl font-medium font-mono text-emerald-800 mt-2 tabular-nums">
                    ৳ {netEarnings.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl space-y-4 bg-[#FAF8F5]">
                <h3 className="font-medium text-base text-[#252321]">
                  Request Payout Withdrawal
                </h3>
                <p className="text-sm text-[#252321]/70 leading-relaxed">
                  Transfers are settled weekly directly into your registered bKash Merchant wallet or Bangladeshi bank account (City Bank, BRAC Bank, Dutch-Bangla Bank).
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        `Withdrawal request for ৳ ${netEarnings.toLocaleString('en-IN')} submitted to admin for clearance.`,
                        'success'
                      )
                    }
                    className="px-6 py-3.5 bg-[#252321] hover:bg-[#383533] text-white font-medium rounded-full cursor-pointer transition-colors"
                  >
                    Withdraw via bKash Merchant
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        `Bank NEFT transfer request for ৳ ${netEarnings.toLocaleString('en-IN')} logged.`,
                        'success'
                      )
                    }
                    className="px-6 py-3.5 bg-white hover:bg-[#F3E7E5] text-[#252321] font-medium rounded-full cursor-pointer transition-colors"
                  >
                    Withdraw via Bank Transfer (BEFTN)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: STOREFRONT SETTINGS */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveStoreSettings}
              className="bg-white rounded-2xl p-6 sm:p-10 space-y-6 text-sm"
            >
              <div>
                <h2 className="text-2xl font-editorial font-normal text-[#252321]">
                  Storefront Identity & Policies
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1">
                  Update public details visible on your atelier URL: /shop/{currentBoutique.slug}
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Boutique Name *</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Tagline *</label>
                    <input
                      type="text"
                      required
                      value={editTagline}
                      onChange={(e) => setEditTagline(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2 text-[#252321]">Atelier Story & Bio *</label>
                  <textarea
                    rows={3}
                    required
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Location Hub</label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Processing Time</label>
                    <input
                      type="text"
                      value={editProcessing}
                      onChange={(e) => setEditProcessing(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-[#252321]">Delivery Coverage</label>
                    <input
                      type="text"
                      value={editCoverage}
                      onChange={(e) => setEditCoverage(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-wider font-medium rounded-full cursor-pointer transition-colors"
                >
                  Save Storefront Settings
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Fulfill Order Modal */}
      {selectedOrderToFulfill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative text-sm space-y-5">
            <button
              onClick={() => setSelectedOrderToFulfill(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#252321]/70 hover:text-[#252321] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h3 className="text-xl font-editorial font-normal text-[#252321]">
                Fulfill Order {selectedOrderToFulfill.orderNumber}
              </h3>
              <p className="text-sm text-[#A99B8D] mt-1">
                Update shipment status and assign local Bangladesh courier details.
              </p>
            </div>

            <form onSubmit={handleFulfillOrderSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1.5 text-[#252321]">Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-3.5 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none"
                >
                  <option value="confirmed">Confirmed (Inventory Reserved)</option>
                  <option value="processing">Processing (Ironing & Packing)</option>
                  <option value="shipped">Shipped (Handed to Courier)</option>
                  <option value="delivered">Delivered (Customer Received)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[#252321]">Courier Partner</label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full p-3.5 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none"
                >
                  <option value="Pathao Courier">Pathao Courier</option>
                  <option value="Steadfast Courier">Steadfast Courier</option>
                  <option value="RedX Logistics">RedX Logistics</option>
                  <option value="eCourier BD">eCourier BD</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-[#252321]">Consignment / Tracking Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. PTH-DH-90182"
                  className="w-full p-3.5 bg-[#FAF8F5] rounded-2xl text-sm font-mono focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrderToFulfill(null)}
                  className="px-6 py-3 bg-[#FAF8F5] rounded-full font-medium hover:bg-[#F3E7E5] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#252321] hover:bg-[#383533] text-white font-medium rounded-full cursor-pointer transition-colors"
                >
                  Confirm Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
