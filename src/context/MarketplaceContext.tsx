import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Boutique,
  CartItem,
  Order,
  SellerOrderGroup,
  SellerApplication,
  Coupon,
  CustomerReview,
  PlatformSettings,
  CustomerAddress,
  OrderStatus,
  ProductCategory
} from '../types';
import {
  INITIAL_BOUTIQUES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_PLATFORM_SETTINGS
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  handleFirestoreError,
  OperationType,
  FirebaseUser
} from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export type UserRole = 'customer' | 'seller' | 'admin';

export type AppView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'boutique'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-tracking'
  | 'customer-account'
  | 'seller-register'
  | 'seller-dashboard'
  | 'admin';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface MarketplaceContextType {
  // Navigation & View
  currentView: AppView;
  selectedProductId: string | null;
  selectedBoutiqueSlug: string | null;
  selectedOrderNumber: string | null;
  catalogCategoryFilter: ProductCategory | 'All';
  setCatalogCategoryFilter: (cat: ProductCategory | 'All') => void;
  catalogSearchQuery: string;
  setCatalogSearchQuery: (q: string) => void;
  navigateTo: (
    view: AppView,
    payload?: { productId?: string; boutiqueSlug?: string; orderNumber?: string; category?: ProductCategory | 'All' }
  ) => void;

  // Auth & Roles
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  isAdminUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeSellerBoutiqueId: string;
  setActiveSellerBoutiqueId: (id: string) => void;

  // Data
  products: Product[];
  boutiques: Boutique[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  sellerApplications: SellerApplication[];
  coupons: Coupon[];
  reviews: CustomerReview[];
  settings: PlatformSettings;
  newsletterSubscribers: string[];

  // Cart operations
  addToCart: (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    quantity?: number
  ) => boolean;
  updateCartQuantity: (productId: string, selectedSize: string, selectedColorName: string, delta: number) => void;
  removeFromCart: (productId: string, selectedSize: string, selectedColorName: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Wishlist operations
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  placeOrder: (
    customer: CustomerAddress,
    deliveryMethod: { id: string; name: string; price: number; estimatedDelivery: string },
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card',
    appliedCoupon?: Coupon
  ) => Promise<Order>;
  updateSellerOrderStatus: (
    orderNumber: string,
    sellerId: string,
    newStatus: OrderStatus,
    courier?: string,
    trackingNumber?: string
  ) => Promise<void>;

  // Seller operations
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateBoutiqueSettings: (boutiqueId: string, updates: Partial<Boutique>) => Promise<void>;
  submitSellerApplication: (appData: Omit<SellerApplication, 'id' | 'createdAt' | 'status'>) => Promise<void>;

  // Admin operations
  reviewSellerApplication: (appId: string, approve: boolean, rejectionReason?: string) => Promise<void>;
  toggleBoutiqueStatus: (boutiqueId: string, status: 'active' | 'suspended') => Promise<void>;
  toggleProductFeatured: (productId: string) => Promise<void>;
  toggleProductStatus: (productId: string, status: 'published' | 'draft' | 'pending') => Promise<void>;
  updatePlatformSettings: (updates: Partial<PlatformSettings>) => Promise<void>;
  addCoupon: (coupon: Coupon) => Promise<void>;

  // Newsletter
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;

  // Reviews
  addReview: (review: Omit<CustomerReview, 'id' | 'date'>) => Promise<void>;

  // Modals & UI Helpers
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBoutiqueSlug, setSelectedBoutiqueSlug] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState<string>('');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const isAdminUser = Boolean(
    currentUser?.email === 'morsalinnurmahim@gmail.com' ||
    currentUser?.email?.endsWith('@admin.nolok.bd')
  );

  // Active Role switcher
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [activeSellerBoutiqueId, setActiveSellerBoutiqueId] = useState<string>('boutique-1');

  // Persistence helpers
  const loadStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`nolok_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStored = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(`nolok_${key}`, JSON.stringify(value));
    } catch {
      // ignore
    }
  };

  // Marketplace Datasets (Optimistic local + Firestore Realtime)
  const [products, setProducts] = useState<Product[]>(() => loadStored('products', INITIAL_PRODUCTS));
  const [boutiques, setBoutiques] = useState<Boutique[]>(() => loadStored('boutiques', INITIAL_BOUTIQUES));
  const [cart, setCart] = useState<CartItem[]>(() => loadStored('cart', []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadStored('wishlist', ['prod-1', 'prod-4']));
  const [orders, setOrders] = useState<Order[]>(() => loadStored('orders', [
    {
      id: 'ord-demo-1',
      orderNumber: 'NLK-2026-8812',
      createdAt: '2026-10-23T14:32:00+06:00',
      customer: {
        fullName: 'Nusrat Jahan',
        phone: '+880 1711-223344',
        email: 'nusrat.jahan@gmail.com',
        division: 'Dhaka',
        district: 'Dhaka South',
        area: 'Dhanmondi Road 27',
        streetAddress: 'House 42, Flat 4B, Dhanmondi',
        deliveryInstructions: 'Please call before arrival'
      },
      deliveryMethod: {
        id: 'standard-dhaka',
        name: 'Standard Dhaka Delivery',
        price: 70,
        estimatedDelivery: '24-48 Hours'
      },
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal: 6450,
      shippingFee: 70,
      discount: 0,
      total: 6520,
      overallStatus: 'confirmed',
      sellerGroups: [
        {
          sellerId: 'boutique-4',
          sellerName: 'Zohra Festive Wear',
          items: [
            {
              productId: 'prod-3',
              product: INITIAL_PRODUCTS[2],
              selectedSize: '40 (M)',
              selectedColor: { name: 'Midnight Emerald', hex: '#1C3A27' },
              quantity: 1
            }
          ],
          subtotal: 6450,
          status: 'confirmed',
          courier: 'Pathao Courier',
          trackingNumber: 'PTH-DH-90182'
        }
      ]
    }
  ]));
  const [sellerApplications, setSellerApplications] = useState<SellerApplication[]>(() => loadStored('seller_apps', [
    {
      id: 'app-1',
      fullName: 'Tahmina Akhter',
      shopName: 'Shuruchi Handcrafts',
      email: 'tahmina@shuruchi.bd',
      phone: '+880 1812-445566',
      description: 'Exclusive handmade Nakshi Kantha stoles and Tangail handloom cotton saris sourced directly from grassroots craftswomen.',
      pickupAddress: 'Sector 4, Uttara, Dhaka',
      division: 'Dhaka',
      categories: ['Sarees', 'Kurtis & Tunics'],
      createdAt: '2026-10-24',
      status: 'pending'
    }
  ]));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStored('coupons', INITIAL_COUPONS));
  const [reviews, setReviews] = useState<CustomerReview[]>(() => loadStored('reviews', INITIAL_REVIEWS));
  const [settings, setSettings] = useState<PlatformSettings>(() => loadStored('settings', INITIAL_PLATFORM_SETTINGS));
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<string[]>(() => loadStored('newsletter', ['lifestyle@dhaka.com']));

  // UI state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => saveStored('products', products), [products]);
  useEffect(() => saveStored('boutiques', boutiques), [boutiques]);
  useEffect(() => saveStored('cart', cart), [cart]);
  useEffect(() => saveStored('wishlist', wishlist), [wishlist]);
  useEffect(() => saveStored('orders', orders), [orders]);
  useEffect(() => saveStored('seller_apps', sellerApplications), [sellerApplications]);
  useEffect(() => saveStored('coupons', coupons), [coupons]);
  useEffect(() => saveStored('reviews', reviews), [reviews]);
  useEffect(() => saveStored('settings', settings), [settings]);
  useEffect(() => saveStored('newsletter', newsletterSubscribers), [newsletterSubscribers]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Register or sync user document
        const userDocRef = doc(db, 'users', user.uid);
        try {
          await setDoc(
            userDocRef,
            {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Customer',
              photoURL: user.photoURL || '',
              role: user.email === 'morsalinnurmahim@gmail.com' ? 'admin' : 'customer',
              updatedAt: new Date().toISOString()
            },
            { merge: true }
          );
        } catch (error) {
          console.warn('User profile sync skipped:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Products
  useEffect(() => {
    const productsPath = 'products';
    const unsubscribe = onSnapshot(
      collection(db, productsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Product[] = [];
          snapshot.forEach((d) => list.push(d.data() as Product));
          setProducts(list);
        }
      },
      (error) => {
        console.warn('Firestore Products sync error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Boutiques
  useEffect(() => {
    const boutiquesPath = 'boutiques';
    const unsubscribe = onSnapshot(
      collection(db, boutiquesPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Boutique[] = [];
          snapshot.forEach((d) => list.push(d.data() as Boutique));
          setBoutiques(list);
        }
      },
      (error) => {
        console.warn('Firestore Boutiques sync error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Coupons
  useEffect(() => {
    const couponsPath = 'coupons';
    const unsubscribe = onSnapshot(
      collection(db, couponsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Coupon[] = [];
          snapshot.forEach((d) => list.push(d.data() as Coupon));
          setCoupons(list);
        }
      },
      (error) => {
        console.warn('Firestore Coupons sync error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Reviews
  useEffect(() => {
    const reviewsPath = 'reviews';
    const unsubscribe = onSnapshot(
      collection(db, reviewsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CustomerReview[] = [];
          snapshot.forEach((d) => list.push(d.data() as CustomerReview));
          setReviews(list);
        }
      },
      (error) => {
        console.warn('Firestore Reviews sync error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Platform Settings
  useEffect(() => {
    const settingsPath = 'settings';
    const unsubscribe = onSnapshot(
      collection(db, settingsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const first = snapshot.docs[0]?.data() as PlatformSettings;
          if (first) setSettings(first);
        }
      },
      (error) => {
        console.warn('Firestore Settings sync error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // User-specific Orders sync when authenticated
  useEffect(() => {
    if (!currentUser) return;
    const ordersPath = 'orders';
    try {
      const q = query(collection(db, ordersPath), where('customerUid', '==', currentUser.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Order[] = [];
            snapshot.forEach((d) => list.push(d.data() as Order));
            setOrders((prev) => {
              const ids = new Set(list.map((o) => o.id));
              const nonUserOrders = prev.filter((o) => !ids.has(o.id));
              return [...list, ...nonUserOrders];
            });
          }
        },
        (error) => {
          console.warn('Firestore Orders sync info:', error);
        }
      );
      return () => unsubscribe();
    } catch {
      // ignore
    }
  }, [currentUser]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      showToast(`Welcome to Nolok, ${result.user.displayName || 'friend'}!`, 'success');
      if (result.user.email === 'morsalinnurmahim@gmail.com') {
        setActiveRole('admin');
      }
    } catch (error) {
      console.error('Google Sign In error:', error);
      showToast('Could not sign in with Google. Please try again.', 'error');
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setActiveRole('customer');
      showToast('Signed out successfully', 'info');
    } catch (error) {
      console.error('Sign Out error:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (
    view: AppView,
    payload?: { productId?: string; boutiqueSlug?: string; orderNumber?: string; category?: ProductCategory | 'All' }
  ) => {
    setCurrentView(view);
    if (payload?.productId !== undefined) setSelectedProductId(payload.productId);
    if (payload?.boutiqueSlug !== undefined) setSelectedBoutiqueSlug(payload.boutiqueSlug);
    if (payload?.orderNumber !== undefined) setSelectedOrderNumber(payload.orderNumber);
    if (payload?.category !== undefined) setCatalogCategoryFilter(payload.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Management
  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: { name: string; hex: string },
    quantity = 1
  ): boolean => {
    if (product.stock <= 0) {
      showToast('This piece is currently out of stock', 'error');
      return false;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor.name === selectedColor.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Only ${product.stock} units available in stock`, 'error');
          return prev;
        }
        updated[existingIdx].quantity = newQty;
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          selectedSize,
          selectedColor,
          quantity
        }
      ];
    });

    showToast(`Added "${product.title.slice(0, 32)}..." to your bag`, 'success');
    return true;
  };

  const updateCartQuantity = (
    productId: string,
    selectedSize: string,
    selectedColorName: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor.name === selectedColorName
          ) {
            const newQty = item.quantity + delta;
            if (newQty > item.product.stock) {
              showToast(`Maximum available stock reached (${item.product.stock})`, 'info');
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
      );
  };

  const removeFromCart = (productId: string, selectedSize: string, selectedColorName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor.name === selectedColorName
          )
      )
    );
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Order Placement (Multi-seller partitioning + Firestore persistence)
  const placeOrder = async (
    customer: CustomerAddress,
    deliveryMethod: { id: string; name: string; price: number; estimatedDelivery: string },
    paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card',
    appliedCoupon?: Coupon
  ): Promise<Order> => {
    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const inCartItems = cart.filter((item) => item.productId === prod.id);
        const qtyToDeduct = inCartItems.reduce((acc, it) => acc + it.quantity, 0);
        if (qtyToDeduct > 0) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - qtyToDeduct)
          };
        }
        return prod;
      })
    );

    // Group items by Boutique / Seller
    const groupsMap = new Map<string, { sellerName: string; items: CartItem[]; subtotal: number }>();

    cart.forEach((item) => {
      const sellerId = item.product.boutiqueId;
      const sellerName = item.product.boutiqueName;
      const current = groupsMap.get(sellerId) || { sellerName, items: [], subtotal: 0 };
      current.items.push(item);
      current.subtotal += item.product.price * item.quantity;
      groupsMap.set(sellerId, current);
    });

    const sellerGroups: SellerOrderGroup[] = Array.from(groupsMap.entries()).map(
      ([sellerId, data]) => ({
        sellerId,
        sellerName: data.sellerName,
        items: data.items,
        subtotal: data.subtotal,
        status: 'placed'
      })
    );

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      } else {
        discount = appliedCoupon.value;
      }
    }

    const orderNumber = `NLK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer,
      deliveryMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: cartSubtotal,
      shippingFee: deliveryMethod.price,
      discount,
      couponCode: appliedCoupon?.code,
      total: Math.max(0, cartSubtotal + deliveryMethod.price - discount),
      sellerGroups,
      overallStatus: 'placed'
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Firestore with error handling
    const orderDocPath = `orders/${newOrder.id}`;
    try {
      await setDoc(doc(db, 'orders', newOrder.id), {
        ...newOrder,
        customerUid: currentUser?.uid || null
      });
    } catch (error) {
      console.warn('Firestore write warning:', error);
      // In offline or guest scenario, local state is already saved
    }

    return newOrder;
  };

  const updateSellerOrderStatus = async (
    orderNumber: string,
    sellerId: string,
    newStatus: OrderStatus,
    courier?: string,
    trackingNumber?: string
  ) => {
    let targetOrder: Order | null = null;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber !== orderNumber) return ord;

        const updatedGroups = ord.sellerGroups.map((group) => {
          if (group.sellerId === sellerId) {
            return {
              ...group,
              status: newStatus,
              courier: courier || group.courier,
              trackingNumber: trackingNumber || group.trackingNumber,
              dispatchedAt: newStatus === 'shipped' ? new Date().toISOString() : group.dispatchedAt
            };
          }
          return group;
        });

        // Determine parent status
        const statuses = updatedGroups.map((g) => g.status);
        let overall: OrderStatus = ord.overallStatus;
        if (statuses.every((s) => s === 'delivered')) overall = 'delivered';
        else if (statuses.some((s) => s === 'shipped')) overall = 'shipped';
        else if (statuses.some((s) => s === 'processing')) overall = 'processing';
        else if (statuses.some((s) => s === 'confirmed')) overall = 'confirmed';
        else if (statuses.every((s) => s === 'cancelled')) overall = 'cancelled';

        const updated = {
          ...ord,
          sellerGroups: updatedGroups,
          overallStatus: overall
        };
        targetOrder = updated;
        return updated;
      })
    );

    if (targetOrder) {
      const path = `orders/${(targetOrder as Order).id}`;
      try {
        await updateDoc(doc(db, 'orders', (targetOrder as Order).id), {
          sellerGroups: (targetOrder as Order).sellerGroups,
          overallStatus: (targetOrder as Order).overallStatus
        });
      } catch (error) {
        console.warn('Firestore update status warning:', error);
      }
    }

    showToast(`Order status updated to ${newStatus}`, 'success');
  };

  // Seller CRUD
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProducts((prev) => [newProduct, ...prev]);

    // increment boutique totalProducts
    setBoutiques((prev) =>
      prev.map((b) =>
        b.id === productData.boutiqueId ? { ...b, totalProducts: b.totalProducts + 1 } : b
      )
    );

    const path = `products/${newProduct.id}`;
    try {
      await setDoc(doc(db, 'products', newProduct.id), newProduct);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }

    showToast('New fashion piece published to your shop', 'success');
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === productId ? { ...prod, ...updates } : prod))
    );

    const path = `products/${productId}`;
    try {
      await updateDoc(doc(db, 'products', productId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }

    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }

    showToast('Product listing removed', 'info');
  };

  const updateBoutiqueSettings = async (boutiqueId: string, updates: Partial<Boutique>) => {
    setBoutiques((prev) =>
      prev.map((b) => (b.id === boutiqueId ? { ...b, ...updates } : b))
    );

    const path = `boutiques/${boutiqueId}`;
    try {
      await updateDoc(doc(db, 'boutiques', boutiqueId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }

    showToast('Storefront profile updated', 'success');
  };

  const submitSellerApplication = async (appData: Omit<SellerApplication, 'id' | 'createdAt' | 'status'>) => {
    const newApp: SellerApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setSellerApplications((prev) => [newApp, ...prev]);

    const path = `sellerApplications/${newApp.id}`;
    try {
      await setDoc(doc(db, 'sellerApplications', newApp.id), {
        ...newApp,
        applicantUid: currentUser?.uid || null
      });
    } catch (error) {
      console.warn('Firestore application write warning:', error);
    }

    showToast('Your boutique application has been submitted for review!', 'success');
  };

  // Admin moderation
  const reviewSellerApplication = async (appId: string, approve: boolean, rejectionReason?: string) => {
    const targetApp = sellerApplications.find((a) => a.id === appId);
    if (!targetApp) return;

    setSellerApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: approve ? 'approved' : 'rejected', rejectionReason }
          : a
      )
    );

    const appPath = `sellerApplications/${appId}`;
    try {
      await updateDoc(doc(db, 'sellerApplications', appId), {
        status: approve ? 'approved' : 'rejected',
        rejectionReason: rejectionReason || ''
      });
    } catch (error) {
      console.warn('Firestore app review warning:', error);
    }

    if (approve) {
      const newBoutique: Boutique = {
        id: `boutique-${Date.now()}`,
        name: targetApp.shopName,
        slug: targetApp.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: 'Curated Boutique Partner',
        description: targetApp.description,
        location: `${targetApp.pickupAddress}, ${targetApp.division}`,
        division: targetApp.division,
        logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        categories: targetApp.categories,
        totalProducts: 0,
        rating: 5.0,
        ordersFulfilled: 0,
        joinedDate: 'Oct 2026',
        deliveryCoverage: 'All 64 districts in Bangladesh',
        processingTime: '1-2 business days',
        policies: {
          shipping: 'Dispatched via verified courier inside Dhaka 48h, Nationwide 72h.',
          returns: '7-day replacement for unworn pieces with tags.'
        },
        isApproved: true,
        status: 'active',
        phone: targetApp.phone,
        email: targetApp.email
      };
      setBoutiques((prev) => [...prev, newBoutique]);

      try {
        await setDoc(doc(db, 'boutiques', newBoutique.id), newBoutique);
      } catch (err) {
        console.warn('Firestore boutique create warning:', err);
      }

      showToast(`Boutique "${targetApp.shopName}" approved and published!`, 'success');
    } else {
      showToast(`Application for "${targetApp.shopName}" was rejected`, 'info');
    }
  };

  const toggleBoutiqueStatus = async (boutiqueId: string, status: 'active' | 'suspended') => {
    setBoutiques((prev) =>
      prev.map((b) => (b.id === boutiqueId ? { ...b, status } : b))
    );

    const path = `boutiques/${boutiqueId}`;
    try {
      await updateDoc(doc(db, 'boutiques', boutiqueId), { status });
    } catch (error) {
      console.warn('Firestore update boutique status warning:', error);
    }

    showToast(`Boutique status set to ${status}`, 'info');
  };

  const toggleProductFeatured = async (productId: string) => {
    let nextFeatured = false;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          nextFeatured = !p.featured;
          return { ...p, featured: nextFeatured };
        }
        return p;
      })
    );

    try {
      await updateDoc(doc(db, 'products', productId), { featured: nextFeatured });
    } catch (error) {
      console.warn('Firestore toggle featured warning:', error);
    }
  };

  const toggleProductStatus = async (productId: string, status: 'published' | 'draft' | 'pending') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status } : p))
    );

    try {
      await updateDoc(doc(db, 'products', productId), { status });
    } catch (error) {
      console.warn('Firestore update product status warning:', error);
    }

    showToast(`Product listing set to ${status}`, 'info');
  };

  const updatePlatformSettings = async (updates: Partial<PlatformSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));

    try {
      await setDoc(doc(db, 'settings', 'global'), updates, { merge: true });
    } catch (error) {
      console.warn('Firestore settings update warning:', error);
    }

    showToast('Platform settings updated', 'success');
  };

  const addCoupon = async (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev.filter((c) => c.code !== coupon.code)]);

    try {
      await setDoc(doc(db, 'coupons', coupon.code), coupon);
    } catch (error) {
      console.warn('Firestore coupon add warning:', error);
    }

    showToast(`Coupon code ${coupon.code} created`, 'success');
  };

  // Newsletter
  const subscribeNewsletter = async (email: string) => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    const cleanEmail = email.toLowerCase().trim();
    if (newsletterSubscribers.includes(cleanEmail)) {
      return { success: false, message: 'You are already subscribed to Notes on Style.' };
    }

    setNewsletterSubscribers((prev) => [...prev, cleanEmail]);

    const sanitizedId = cleanEmail.replace(/[^a-zA-Z0-9_-]/g, '_');
    try {
      await setDoc(doc(db, 'newsletterSubscribers', sanitizedId), {
        id: sanitizedId,
        email: cleanEmail,
        subscribedAt: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Firestore newsletter write warning:', error);
    }

    showToast('Thank you for subscribing to Notes on Style', 'success');
    return { success: true, message: 'Thank you for subscribing to Notes on Style.' };
  };

  const addReview = async (reviewData: Omit<CustomerReview, 'id' | 'date'>) => {
    const newRev: CustomerReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    setReviews((prev) => [newRev, ...prev]);

    // update product rating
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const totalRating = p.rating * p.reviewCount + reviewData.rating;
          const newCount = p.reviewCount + 1;
          return {
            ...p,
            rating: Number((totalRating / newCount).toFixed(1)),
            reviewCount: newCount
          };
        }
        return p;
      })
    );

    const path = `reviews/${newRev.id}`;
    try {
      await setDoc(doc(db, 'reviews', newRev.id), {
        ...newRev,
        customerUid: currentUser?.uid || null
      });
    } catch (error) {
      console.warn('Firestore review write warning:', error);
    }

    showToast('Thank you for your verified review!', 'success');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentView,
        selectedProductId,
        selectedBoutiqueSlug,
        selectedOrderNumber,
        catalogCategoryFilter,
        setCatalogCategoryFilter,
        catalogSearchQuery,
        setCatalogSearchQuery,
        navigateTo,

        currentUser,
        authLoading,
        isAdminUser,
        signInWithGoogle,
        signOutUser,
        activeRole,
        setActiveRole,
        activeSellerBoutiqueId,
        setActiveSellerBoutiqueId,

        products,
        boutiques,
        cart,
        wishlist,
        orders,
        sellerApplications,
        coupons,
        reviews,
        settings,
        newsletterSubscribers,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,

        toggleWishlist,
        isInWishlist,

        placeOrder,
        updateSellerOrderStatus,

        createProduct,
        updateProduct,
        deleteProduct,
        updateBoutiqueSettings,
        submitSellerApplication,

        reviewSellerApplication,
        toggleBoutiqueStatus,
        toggleProductFeatured,
        toggleProductStatus,
        updatePlatformSettings,
        addCoupon,

        subscribeNewsletter,
        addReview,

        quickViewProduct,
        setQuickViewProduct,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isSearchOpen,
        setIsSearchOpen,

        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
  return context;
};
