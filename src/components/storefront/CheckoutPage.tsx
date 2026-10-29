import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CustomerAddress, Coupon } from '../../types';
import { BANGLADESH_DIVISIONS } from '../../data/mockData';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronLeft,
  Tag,
  CreditCard,
  Banknote,
  Smartphone
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    placeOrder,
    coupons,
    navigateTo,
    settings,
    showToast
  } = useMarketplace();

  // Multi-step state: 1: Details, 2: Address, 3: Delivery, 4: Payment, 5: Review
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [fullName, setFullName] = useState('Nusrat Jahan');
  const [phone, setPhone] = useState('+880 1711-223344');
  const [email, setEmail] = useState('nusrat.jahan@gmail.com');

  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka South');
  const [area, setArea] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('House 42, Road 27, Flat 4B');
  const [deliveryInstructions, setDeliveryInstructions] = useState('Please call upon arrival at the gate');

  // Delivery Method
  const [deliveryMethodId, setDeliveryMethodId] = useState('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [bkashNumber, setBkashNumber] = useState('01711223344');
  const [bkashTrxId, setBkashTrxId] = useState('TRX90218BD');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-24 text-center space-y-6">
        <h2 className="text-3xl font-editorial font-normal text-[#252321]">
          No items in cart for checkout
        </h2>
        <button
          onClick={() => navigateTo('catalog')}
          className="px-8 py-4 bg-[#252321] text-white text-sm font-medium uppercase tracking-wider rounded-full cursor-pointer hover:bg-[#383533] transition-colors"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  // Delivery options depending on division
  const deliveryOptions = [
    {
      id: 'standard',
      name: division === 'Dhaka' ? 'Standard Delivery (Inside Dhaka)' : 'Nationwide Courier (Outside Dhaka)',
      price: division === 'Dhaka' ? settings.dhakaDeliveryFee : settings.outsideDhakaDeliveryFee,
      estimatedDelivery: division === 'Dhaka' ? '24 - 48 Hours' : '3 - 4 Business Days'
    },
    ...(division === 'Dhaka'
      ? [
          {
            id: 'express',
            name: 'Same-Day Express Dispatch (Dhaka Metro)',
            price: settings.expressDhakaDeliveryFee,
            estimatedDelivery: 'Same Day (Order before 1 PM)'
          }
        ]
      : [])
  ];

  const selectedDelivery =
    deliveryOptions.find((d) => d.id === deliveryMethodId) || deliveryOptions[0];

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal + selectedDelivery.price - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = coupons.find(
      (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      showToast('Invalid or expired coupon code. Try NOLOK10 or EID2026', 'error');
      return;
    }
    if (cartSubtotal < found.minOrder) {
      showToast(
        `Minimum order value for ${found.code} is ৳ ${found.minOrder.toLocaleString('en-IN')}`,
        'error'
      );
      return;
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied!`, 'success');
  };

  const handleFinalPlaceOrder = async () => {
    const customer: CustomerAddress = {
      fullName,
      phone,
      email,
      division,
      district,
      area,
      streetAddress,
      deliveryInstructions
    };

    const newOrder = await placeOrder(
      customer,
      selectedDelivery,
      paymentMethod,
      appliedCoupon || undefined
    );

    showToast('Order confirmed! We have notified the boutique ateliers.', 'success');
    navigateTo('order-confirmation', { orderNumber: newOrder.orderNumber });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Checkout Steps Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium uppercase tracking-wider">
          {['1. Customer', '2. Delivery', '3. Shipping', '4. Payment', '5. Review'].map(
            (stepName, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <button
                  key={stepName}
                  onClick={() => {
                    if (isPast) setCurrentStep(stepNum);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#252321] text-white font-medium'
                      : isPast
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-[#FAF8F5] text-[#A99B8D] cursor-not-allowed'
                  }`}
                >
                  {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : null}
                  <span>{stepName}</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Steps Form (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-10 space-y-8">
          {/* STEP 1: Customer Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                  Step 1: Customer Contact Details
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1.5">
                  We use this information to send parcel dispatch SMS and courier notifications.
                </p>
              </div>

              <div className="space-y-5 text-sm">
                <div>
                  <label className="block text-[#252321] font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Nusrat Jahan"
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[#252321] font-medium mb-2">
                      Bangladesh Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+880 17XX-XXXXXX"
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                    />
                    <span className="text-sm text-[#A99B8D] block mt-1.5">
                      Required for courier rider delivery verification
                    </span>
                  </div>

                  <div>
                    <label className="block text-[#252321] font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@gmail.com"
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!fullName || !phone) {
                      showToast('Please fill in your name and phone number', 'error');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer flex items-center gap-2 transition-all"
                >
                  <span>Continue to Delivery Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Delivery Address */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                  Step 2: Bangladesh Delivery Address
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1.5">
                  Enter your delivery location. Our partner couriers service all 64 districts in Bangladesh.
                </p>
              </div>

              <div className="space-y-5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Division */}
                  <div>
                    <label className="block text-[#252321] font-medium mb-2">Division *</label>
                    <select
                      value={division}
                      onChange={(e) => {
                        const newDiv = e.target.value;
                        setDivision(newDiv);
                        setDistrict(BANGLADESH_DIVISIONS[newDiv]?.[0] || '');
                      }}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                    >
                      {Object.keys(BANGLADESH_DIVISIONS).map((divName) => (
                        <option key={divName} value={divName}>
                          {divName} Division
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-[#252321] font-medium mb-2">
                      District / City *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                    >
                      {(BANGLADESH_DIVISIONS[division] || []).map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#252321] font-medium mb-2">
                    Area / Thana / Upazila *
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Dhanmondi, Banani, Uttara, Halishahar..."
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                  />
                </div>

                <div>
                  <label className="block text-[#252321] font-medium mb-2">
                    Detailed Street / House / Flat Address *
                  </label>
                  <textarea
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    rows={2}
                    placeholder="House number, road number, flat/floor number..."
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                  />
                </div>

                <div>
                  <label className="block text-[#252321] font-medium mb-2">
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g., Leave with security guard, call before arriving"
                    className="w-full p-4 bg-[#FAF8F5] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B66F7B]/40"
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] font-medium text-sm rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!streetAddress || !area) {
                      showToast('Please specify your street address and area', 'error');
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  className="px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer flex items-center gap-2 transition-all"
                >
                  <span>Select Delivery Option</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Delivery Method */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                  Step 3: Choose Shipping Speed
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1.5">
                  Destination: {district}, {division} Division.
                </p>
              </div>

              <div className="space-y-4">
                {deliveryOptions.map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setDeliveryMethodId(opt.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${
                      deliveryMethodId === opt.id
                        ? 'bg-[#F3E7E5] text-[#252321]'
                        : 'bg-[#FAF8F5] text-[#252321] hover:bg-[#F3E7E5]/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethodId === opt.id}
                        onChange={() => setDeliveryMethodId(opt.id)}
                        className="accent-[#B66F7B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#252321]">{opt.name}</p>
                        <p className="text-sm text-[#A99B8D] flex items-center gap-1.5 mt-0.5">
                          <Truck className="w-4 h-4 text-[#B66F7B]" />
                          <span>Estimated: {opt.estimatedDelivery}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-base font-medium text-[#252321] tabular-nums">
                      ৳ {opt.price}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] font-medium text-sm rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer flex items-center gap-2 transition-all"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                  Step 4: Select Payment Method
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1.5">
                  Choose how you would like to pay for your handcrafted pieces.
                </p>
              </div>

              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#F3E7E5]'
                      : 'bg-[#FAF8F5] hover:bg-[#F3E7E5]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#B66F7B] mt-1 w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Banknote className="w-5 h-5 text-[#B66F7B]" />
                      <span className="text-sm font-medium text-[#252321]">Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-sm text-[#A99B8D] mt-1 leading-relaxed">
                      Pay cash directly to the courier rider upon inspecting your parcel at your doorstep.
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`flex flex-col gap-3 p-5 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#F3E7E5]'
                      : 'bg-[#FAF8F5] hover:bg-[#F3E7E5]/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="accent-[#B66F7B] w-4 h-4"
                    />
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-[#E2136E]" />
                      <span className="text-sm font-medium text-[#252321]">bKash Payment</span>
                    </div>
                  </div>

                  {paymentMethod === 'bkash' && (
                    <div className="mt-2 p-5 bg-white rounded-2xl text-sm space-y-4">
                      <p className="text-[#A99B8D]">
                        Merchant Account: <span className="text-[#252321] font-medium">01700-NOLOK (01700-665650)</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-[#A99B8D] block mb-1.5">bKash Account No.</label>
                          <input
                            type="text"
                            value={bkashNumber}
                            onChange={(e) => setBkashNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full p-3.5 bg-[#FAF8F5] rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-[#A99B8D] block mb-1.5">Transaction ID (TrxID)</label>
                          <input
                            type="text"
                            value={bkashTrxId}
                            onChange={(e) => setBkashTrxId(e.target.value)}
                            placeholder="e.g. TRX90218BD"
                            className="w-full p-3.5 bg-[#FAF8F5] rounded-xl text-sm font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#F3E7E5]'
                      : 'bg-[#FAF8F5] hover:bg-[#F3E7E5]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="accent-[#B66F7B] mt-1 w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-5 h-5 text-[#F7941D]" />
                      <span className="text-sm font-medium text-[#252321]">Nagad Wallet</span>
                    </div>
                    <p className="text-sm text-[#A99B8D] mt-1 leading-relaxed">
                      Fast mobile wallet transaction with instant SMS token confirmation.
                    </p>
                  </div>
                </label>

                {/* Card Payment */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#F3E7E5]'
                      : 'bg-[#FAF8F5] hover:bg-[#F3E7E5]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#B66F7B] mt-1 w-4 h-4"
                  />
                  <div>
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#252321]" />
                      <span className="text-sm font-medium text-[#252321]">Visa / MasterCard / AMEX</span>
                    </div>
                    <p className="text-sm text-[#A99B8D] mt-1 leading-relaxed">
                      Secure encrypted card gateway checkout (SSLCOMMERZ ready).
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] font-medium text-sm rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer flex items-center gap-2 transition-all"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Final Review & Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-editorial font-normal text-[#252321]">
                  Step 5: Review & Confirm Order
                </h2>
                <p className="text-sm text-[#A99B8D] mt-1.5">
                  Verify your shipping address and selected pieces before placing your order.
                </p>
              </div>

              {/* Delivery and Customer Recap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-[#FAF8F5] rounded-2xl text-sm">
                <div className="space-y-1">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Recipient
                  </span>
                  <p className="font-medium text-[#252321]">{fullName}</p>
                  <p className="text-[#252321]/70">{phone}</p>
                  <p className="text-[#252321]/70">{email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#A99B8D] uppercase font-medium text-sm block">
                    Shipping Address
                  </span>
                  <p className="text-[#252321]">{streetAddress}, {area}</p>
                  <p className="text-[#252321]/70">{district}, {division} Division</p>
                  <p className="text-sm text-[#B66F7B] font-medium mt-1">
                    Method: {selectedDelivery.name} ({selectedDelivery.estimatedDelivery})
                  </p>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
                  Pieces in This Order
                </h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={`${item.productId}-${item.selectedSize}`}
                      className="flex items-center justify-between p-4 bg-[#FAF8F5] rounded-2xl text-sm"
                    >
                      <div className="flex items-center gap-4">
                        <ImageWithFallback
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-14 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#252321] line-clamp-1">{item.product.title}</p>
                          <p className="text-[#A99B8D] text-sm mt-0.5">
                            Atelier: {item.product.boutiqueName} · Size {item.selectedSize} · Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium tabular-nums text-[#252321]">
                        ৳ {(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantee Note */}
              <div className="p-5 bg-[#F3E7E5]/70 rounded-2xl text-sm text-[#252321]/80 space-y-1.5">
                <p className="font-medium text-[#252321]">Marketplace Verification Guarantee</p>
                <p className="leading-relaxed">
                  By clicking Place Order, your order will be sent to the independent ateliers who will inspect and pack your items with boutique security seals.
                </p>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#F3E7E5] text-[#252321] font-medium text-sm rounded-full flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinalPlaceOrder}
                  className="px-8 py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer flex items-center gap-2.5 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Place Order (৳ {finalTotal.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#252321] pb-2">
            Summary
          </h2>

          {/* Coupon Field */}
          <form onSubmit={handleApplyCoupon} className="space-y-3">
            <label className="text-sm font-medium uppercase tracking-wider text-[#A99B8D] flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#B66F7B]" />
              <span>Promo or Eid Coupon</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code (e.g. NOLOK10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 text-sm bg-[#FAF8F5] rounded-full font-mono uppercase focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#252321] text-white text-sm font-medium rounded-full cursor-pointer hover:bg-[#383533] transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <p className="text-sm text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Coupon {appliedCoupon.code} applied!</span>
              </p>
            )}
          </form>

          {/* Totals Breakdown */}
          <div className="space-y-3 text-sm text-[#252321] pt-3">
            <div className="flex justify-between">
              <span className="text-[#A99B8D]">Subtotal</span>
              <span className="font-medium tabular-nums">
                ৳ {cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A99B8D]">Shipping Charge ({division})</span>
              <span className="font-medium tabular-nums">
                ৳ {selectedDelivery.price}
              </span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="tabular-nums">-৳ {discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#FAF8F5] rounded-2xl flex justify-between items-baseline">
            <span className="text-sm font-medium text-[#252321]">Order Total</span>
            <span className="text-2xl font-medium text-[#252321] tabular-nums">
              ৳ {finalTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-sm text-[#A99B8D] space-y-1.5">
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Payment: {paymentMethod.toUpperCase()}</span>
            </p>
            <p className="leading-relaxed">Direct tracking provided once boutique fulfills dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
