import { Product, Boutique, Coupon, CustomerReview, PlatformSettings } from '../types';

export const INITIAL_BOUTIQUES: Boutique[] = [
  {
    id: 'boutique-1',
    name: 'Roopkotha Atelier',
    slug: 'roopkotha-atelier',
    tagline: 'Authentic Dhakai Jamdani & Handloom Heritage',
    description: 'Founded by master textile revivalist Tasnim Anam in Dhanmondi, Roopkotha Atelier works directly with 40+ traditional weaving families in Sonargaon and Tangail to create exquisite hand-spun muslin and festive sarees.',
    location: 'Dhanmondi, Dhaka',
    division: 'Dhaka',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    categories: ['Sarees', 'Festive Collections', 'Kurtis & Tunics'],
    totalProducts: 12,
    rating: 4.9,
    ordersFulfilled: 342,
    joinedDate: 'Jan 2024',
    deliveryCoverage: 'All 64 districts in Bangladesh',
    processingTime: '1-2 business days',
    policies: {
      shipping: 'Delivered via Pathao / Steadfast. Inside Dhaka 24-48 hrs, Outside Dhaka 3-4 days.',
      returns: '7-day inspection guarantee for unworn items with original boutique tags intact.'
    },
    isApproved: true,
    status: 'active',
    phone: '+880 1712-345678',
    email: 'atelier@roopkotha.com'
  },
  {
    id: 'boutique-2',
    name: 'Aura Modest Studio',
    slug: 'aura-modest-studio',
    tagline: 'Contemporary Modestwear & Premium Abayas',
    description: 'Aura Modest Studio reinterprets traditional modesty with fluid Japanese Nida, lightweight Korean crepe, and elegant neutral palettes tailored for modern women across Dhaka and beyond.',
    location: 'Banani, Dhaka',
    division: 'Dhaka',
    logo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
    categories: ['Modest Fashion', 'Dresses & Co-ords'],
    totalProducts: 8,
    rating: 4.8,
    ordersFulfilled: 215,
    joinedDate: 'Mar 2024',
    deliveryCoverage: 'Nationwide & express pickup in Banani',
    processingTime: 'Same day dispatch before 2 PM',
    policies: {
      shipping: 'Orders packed in dust bags with fragrance sachet. Free delivery on orders over ৳5,000.',
      returns: 'Easy size exchange within 5 days of delivery.'
    },
    isApproved: true,
    status: 'active',
    phone: '+880 1819-876543',
    email: 'hello@auramodest.bd'
  },
  {
    id: 'boutique-3',
    name: "Nabila's Cotton Craft",
    slug: 'nabilas-cotton-craft',
    tagline: 'Breathable Everyday Cotton Kurtis & Co-ords',
    description: 'Specializing in pre-shrunk Comilla khadi, block-printed voiles, and comfortable everyday salwar suits crafted for tropical Bangladesh weather.',
    location: 'Uttara Sector 7, Dhaka',
    division: 'Dhaka',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    categories: ['Kurtis & Tunics', 'Three-Piece Suits', 'Western Wear'],
    totalProducts: 10,
    rating: 4.7,
    ordersFulfilled: 489,
    joinedDate: 'Nov 2023',
    deliveryCoverage: 'All divisions across Bangladesh',
    processingTime: '1 business day',
    policies: {
      shipping: 'Daily pick-ups via RedX and Paperfly.',
      returns: 'Hassle-free 3-day replacement for fitting issues.'
    },
    isApproved: true,
    status: 'active',
    phone: '+880 1623-112233',
    email: 'care@nabilacraft.com'
  },
  {
    id: 'boutique-4',
    name: 'Zohra Festive Wear',
    slug: 'zohra-festive-wear',
    tagline: 'Heavy Embroidered Three-Piece & Wedding Guest Attire',
    description: 'Chittagong-based designer label known for intricate zari needlework, Organza dupattas, and rich jewel-toned Pakistani & Bangladeshi festive ensembles.',
    location: 'Nasirabad, Chattogram',
    division: 'Chattogram',
    logo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80',
    categories: ['Three-Piece Suits', 'Festive Collections', 'Bags & Accessories'],
    totalProducts: 9,
    rating: 4.9,
    ordersFulfilled: 310,
    joinedDate: 'Feb 2024',
    deliveryCoverage: 'Nationwide delivery with priority delivery in Chittagong & Dhaka',
    processingTime: '2-3 business days',
    policies: {
      shipping: 'Insured courier transit for luxury zari and embellished pieces.',
      returns: 'Exchange accepted within 48 hours with security seal unbroken.'
    },
    isApproved: true,
    status: 'active',
    phone: '+880 1911-998877',
    email: 'contact@zohrafestive.com'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Handwoven Dhakai Jamdani Saree (84-Count Muslin)',
    price: 9800,
    compareAtPrice: 12500,
    boutiqueId: 'boutique-1',
    boutiqueName: 'Roopkotha Atelier',
    category: 'Sarees',
    subcategory: 'Jamdani',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An authentic masterpiece hand-woven by master weavers in Sonargaon using fine 84-count pure cotton thread. Features traditional "Panna Hajar" (thousand emeralds) geometric floral motifs with a delicate gold zari pallu.',
    fabric: 'Pure Cotton Muslin with Resham Zari thread',
    care: 'Dry clean only. Store wrapped in pure unbleached muslin cloth.',
    sizes: ['Free Size (5.5m + Unstitched Blouse Piece)'],
    colors: [
      { name: 'Ivory & Antique Gold', hex: '#EBE5D8' },
      { name: 'Rose Blush', hex: '#D99B9B' }
    ],
    stock: 4,
    sku: 'RPK-JAM-001',
    status: 'published',
    condition: 'Artisan Handloom',
    isNewArrival: true,
    isEditorsPick: true,
    featured: true,
    rating: 5.0,
    reviewCount: 14,
    createdAt: '2026-10-18'
  },
  {
    id: 'prod-2',
    title: 'Floral Summer Block-Printed Linen Co-ord Set',
    price: 3250,
    compareAtPrice: 3800,
    boutiqueId: 'boutique-3',
    boutiqueName: "Nabila's Cotton Craft",
    category: 'Dresses & Co-ords',
    subcategory: 'Co-ord Sets',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Chic, relaxed-fit two-piece ensemble featuring a band-collar button-down shirt paired with cropped straight trousers. Hand-block printed with natural madder pigments on breathable organic linen.',
    fabric: '100% Breathable Organic Linen',
    care: 'Gentle hand wash in cold water with mild detergent. Line dry in shade.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dusty Sage', hex: '#9AA08B' },
      { name: 'Terracotta Coral', hex: '#C27D6E' }
    ],
    stock: 18,
    sku: 'NBC-CRD-014',
    status: 'published',
    condition: 'Brand New',
    isNewArrival: true,
    isEditorsPick: false,
    featured: true,
    rating: 4.8,
    reviewCount: 22,
    createdAt: '2026-10-21'
  },
  {
    id: 'prod-3',
    title: 'Embroidered Kashmiri Tilla Three-Piece Suit',
    price: 6450,
    compareAtPrice: 7500,
    boutiqueId: 'boutique-4',
    boutiqueName: 'Zohra Festive Wear',
    category: 'Three-Piece Suits',
    subcategory: 'Festive Suits',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An elegant festive three-piece set comprising an intricately embroidered straight kameez, comfortable silk-blend straight pants, and a scalloped floral organza dupatta with gold tilla borders.',
    fabric: 'Chanderi Silk Kameez, Pure Organza Dupatta, Cotton Silk Pants',
    care: 'Dry clean recommended to preserve metallic zari embroidery.',
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: [
      { name: 'Midnight Emerald', hex: '#1C3A27' },
      { name: 'Burgundy Plum', hex: '#581825' }
    ],
    stock: 9,
    sku: 'ZHR-3PC-089',
    status: 'published',
    condition: 'Boutique Exclusive',
    isNewArrival: true,
    isEditorsPick: true,
    featured: true,
    rating: 4.9,
    reviewCount: 31,
    createdAt: '2026-10-22'
  },
  {
    id: 'prod-4',
    title: 'Minimalist Japanese Nida Kimono Abaya with Inner Slip',
    price: 4850,
    boutiqueId: 'boutique-2',
    boutiqueName: 'Aura Modest Studio',
    category: 'Modest Fashion',
    subcategory: 'Abayas',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Contemporary open-front kimono abaya accompanied by an opaque sleeveless inner dress and a coordinating chiffon hijab. Tailored from premium wrinkle-resistant Japanese Nida with subtle raw-edge stitch detailing.',
    fabric: 'High-Density Japanese Nida & Matte Korean Chiffon',
    care: 'Machine wash on delicate cycle in wash bag or hand wash.',
    sizes: ['52 (Petite)', '54 (Regular)', '56 (Tall)'],
    colors: [
      { name: 'Oatmeal Warm Taupe', hex: '#C2B6A6' },
      { name: 'Classic Charcoal Noir', hex: '#2B2B2B' }
    ],
    stock: 12,
    sku: 'AUR-ABY-102',
    status: 'published',
    condition: 'Brand New',
    isNewArrival: false,
    isEditorsPick: true,
    featured: true,
    rating: 4.9,
    reviewCount: 19,
    createdAt: '2026-10-15'
  },
  {
    id: 'prod-5',
    title: 'Lucknowi Chikankari Pure Georgette Kurti with Slip',
    price: 2950,
    compareAtPrice: 3500,
    boutiqueId: 'boutique-3',
    boutiqueName: "Nabila's Cotton Craft",
    category: 'Kurtis & Tunics',
    subcategory: 'Embroidered Kurtis',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Delicate hand-embroidered shadow work and bakhiya stitch throughout the neckline and daman. Comes paired with a matching soft cotton inner slip.',
    fabric: 'Fine Viscose Georgette with 100% Cotton Slip',
    care: 'Hand wash with mild liquid soap. Do not wring.',
    sizes: ['36', '38', '40', '42', '44'],
    colors: [
      { name: 'Powder Sky Blue', hex: '#B5CFD8' },
      { name: 'Soft Lilac Lavender', hex: '#D2C1DB' },
      { name: 'Ivory Cream', hex: '#F4EFE6' }
    ],
    stock: 15,
    sku: 'NBC-KRT-045',
    status: 'published',
    condition: 'Brand New',
    isNewArrival: true,
    isEditorsPick: false,
    featured: false,
    rating: 4.7,
    reviewCount: 18,
    createdAt: '2026-10-23'
  },
  {
    id: 'prod-6',
    title: 'Katan Silk Festive Saree with Meenakari Weave',
    price: 11500,
    compareAtPrice: 13900,
    boutiqueId: 'boutique-1',
    boutiqueName: 'Roopkotha Atelier',
    category: 'Sarees',
    subcategory: 'Silk Sarees',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heritage Katan silk saree woven with radiant dual-tone threads and elaborate multi-colored meenakari paisleys along the heavy border. Designed for weddings and reception evenings.',
    fabric: '100% Pure Katan Silk with Metallic Gold Zari',
    care: 'Professional dry clean only. Air occasionally in mild shade.',
    sizes: ['Free Size (6.3m with blouse piece)'],
    colors: [
      { name: 'Royal Crimson Red', hex: '#871822' },
      { name: 'Imperial Peacock Teal', hex: '#14464B' }
    ],
    stock: 3,
    sku: 'RPK-KTN-005',
    status: 'published',
    condition: 'Artisan Handloom',
    isNewArrival: false,
    isEditorsPick: true,
    featured: true,
    rating: 5.0,
    reviewCount: 8,
    createdAt: '2026-10-10'
  },
  {
    id: 'prod-7',
    title: 'High-Waisted Tailored Cotton-Linen Trousers',
    price: 1850,
    boutiqueId: 'boutique-3',
    boutiqueName: "Nabila's Cotton Craft",
    category: 'Western Wear',
    subcategory: 'Bottoms',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Smart pleated wide-leg trousers cut from premium washed cotton-linen blend. Features an elasticated back waistband for comfort and clean side slant pockets.',
    fabric: '65% Cotton, 35% Belgian Linen',
    care: 'Machine wash warm, iron while slightly damp.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Warm Sand Taupe', hex: '#C7B9A9' },
      { name: 'Deep Espresso', hex: '#3B312B' }
    ],
    stock: 24,
    sku: 'NBC-TRS-022',
    status: 'published',
    condition: 'Brand New',
    isNewArrival: false,
    isEditorsPick: false,
    featured: false,
    rating: 4.6,
    reviewCount: 29,
    createdAt: '2026-10-12'
  },
  {
    id: 'prod-8',
    title: 'Handcrafted Zari-Embroidered Velvet Potli Bag',
    price: 1650,
    compareAtPrice: 1950,
    boutiqueId: 'boutique-4',
    boutiqueName: 'Zohra Festive Wear',
    category: 'Bags & Accessories',
    subcategory: 'Clutches & Potlis',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Opulent micro-velvet drawstring potli bag accented with dense dabka needlework, pearl bead clusters, and braided silk tassels. Fits a smartphone, lipstick, and essentials.',
    fabric: 'Silk Micro-Velvet with Satin Lining and Metal Wire Zari',
    care: 'Spot clean only with soft cloth.',
    sizes: ['Standard (8" x 9")'],
    colors: [
      { name: 'Rose Gold Champagne', hex: '#CDB19A' },
      { name: 'Emerald Velvet', hex: '#1E3E2B' }
    ],
    stock: 14,
    sku: 'ZHR-ACC-031',
    status: 'published',
    condition: 'Boutique Exclusive',
    isNewArrival: true,
    isEditorsPick: true,
    featured: true,
    rating: 4.8,
    reviewCount: 16,
    createdAt: '2026-10-24'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'NOLOK10',
    discountType: 'percentage',
    value: 10,
    minOrder: 2000,
    validUntil: '2026-12-31',
    isActive: true
  },
  {
    code: 'EID2026',
    discountType: 'flat',
    value: 500,
    minOrder: 5000,
    validUntil: '2026-11-30',
    isActive: true
  },
  {
    code: 'WELCOMEBOUTIQUE',
    discountType: 'flat',
    value: 200,
    minOrder: 1500,
    validUntil: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    customerName: 'Samira Rahman',
    customerCity: 'Gulshan, Dhaka',
    rating: 5,
    date: '22 October 2026',
    comment: 'The drape and weave of this Sonargaon Jamdani is breathtaking. The 84-count muslin feels lighter than air, yet the zari has stunning definition. Roopkotha sent it in a gorgeous keepsake box.',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    customerName: 'Tanjila Ahmed',
    customerCity: 'Khulna',
    rating: 5,
    date: '19 October 2026',
    comment: 'Perfect for Dhaka summers! Linen breathes so well and the color is subtle and earthy. Arrived via Steadfast in 2 days.',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    customerName: 'Farhana Hossain',
    customerCity: 'Uttara, Dhaka',
    rating: 5,
    date: '16 October 2026',
    comment: 'Aura Modest Studio never disappoints. The Nida fabric has real weight and opacity without feeling stifling. The cut is very flattering and modest.',
    verifiedPurchase: true
  }
];

export const INITIAL_PLATFORM_SETTINGS: PlatformSettings = [
  {
    announcementText: 'Discover independent women’s fashion across Bangladesh · Free nationwide shipping on orders over ৳5,000',
    announcementVisible: true,
    commissionRatePercent: 8,
    heroHeadline: 'Her Style. Her Choices. All in One Place.',
    heroSubtext: 'Discover women’s fashion from independent boutiques and resellers across Bangladesh.',
    dhakaDeliveryFee: 70,
    outsideDhakaDeliveryFee: 130,
    expressDhakaDeliveryFee: 150
  }
][0];

export const BANGLADESH_DIVISIONS: Record<string, string[]> = {
  'Dhaka': [
    'Dhaka North', 'Dhaka South', 'Gazipur', 'Narayanganj', 'Tangail', 
    'Narsingdi', 'Manikganj', 'Munshiganj', 'Faridpur', 'Kishoreganj'
  ],
  'Chattogram': [
    'Chattogram City', 'Cox’s Bazar', 'Cumilla', 'Feni', 'Brahmanbaria', 
    'Noakhali', 'Chandpur', 'Rangamati', 'Bandarban'
  ],
  'Sylhet': [
    'Sylhet Sadar', 'Moulvibazar', 'Habiganj', 'Sunamganj', 'Sreemangal'
  ],
  'Rajshahi': [
    'Rajshahi City', 'Bogura', 'Pabna', 'Naogaon', 'Sirajganj', 'Natore', 'Chapai Nawabganj'
  ],
  'Khulna': [
    'Khulna City', 'Jashore', 'Kushtia', 'Satkhira', 'Jhenaidah', 'Bagerhat'
  ],
  'Barishal': [
    'Barishal City', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati'
  ],
  'Rangpur': [
    'Rangpur City', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Thakurgaon', 'Saidpur'
  ],
  'Mymensingh': [
    'Mymensingh Sadar', 'Jamalpur', 'Netrokona', 'Sherpur'
  ]
};
