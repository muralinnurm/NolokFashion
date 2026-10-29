import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { OrderStatus } from '../../types';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Store,
  MapPin,
  ShieldCheck,
  Search
} from 'lucide-react';

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Received by marketplace' },
  { status: 'confirmed', label: 'Confirmed', desc: 'Atelier verified inventory' },
  { status: 'processing', label: 'Processing', desc: 'Handcrafted & steam ironed' },
  { status: 'shipped', label: 'Dispatched', desc: 'Handed to courier rider' },
  { status: 'delivered', label: 'Delivered', desc: 'Safely arrived at destination' }
];

export const OrderTrackingPage: React.FC = () => {
  const { orders, selectedOrderNumber, navigateTo, showToast } = useMarketplace();

  const [lookupNumber, setLookupNumber] = useState(selectedOrderNumber || '');

  // Find order
  const activeOrder =
    orders.find((o) => o.orderNumber === (lookupNumber || selectedOrderNumber)) ||
    orders[0];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const handleCancelOrder = () => {
    showToast('Cancellation request submitted to boutique atelier for review.', 'info');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Title & Lookup bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
            Order Tracking & Status
          </h1>
          <p className="text-sm text-[#A99B8D] mt-1.5">
            Real-time status updates from our independent boutique partners across Bangladesh
          </p>
        </div>

        {/* Quick order search */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-full">
          <input
            type="text"
            placeholder="Enter Order # (e.g. NLK-2026-8812)"
            value={lookupNumber}
            onChange={(e) => setLookupNumber(e.target.value.toUpperCase())}
            className="text-sm px-4 py-2.5 bg-transparent rounded-full font-mono focus:outline-none min-w-[240px]"
          />
          <button
            onClick={() => {
              const found = orders.find((o) => o.orderNumber === lookupNumber.trim());
              if (!found) {
                showToast(`Order ${lookupNumber} not found in records.`, 'error');
              } else {
                showToast(`Loaded order ${lookupNumber}`, 'success');
              }
            }}
            className="p-3 bg-[#252321] text-white rounded-full cursor-pointer hover:bg-[#383533] transition-colors"
            title="Search order"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!activeOrder ? (
        <div className="text-center py-20 bg-white rounded-2xl p-8 text-sm text-[#A99B8D]">
          No orders currently recorded. Place an order through checkout to track it here.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Order Header Summary Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <span className="text-sm uppercase tracking-widest text-[#B66F7B] font-medium block">
                  Bangladesh Order Receipt
                </span>
                <h2 className="text-2xl font-medium font-mono text-[#252321] mt-1">
                  {activeOrder.orderNumber}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#A99B8D]">
                  Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-sm px-4 py-1.5 rounded-full bg-[#F3E7E5] text-[#252321] font-medium uppercase tracking-wide">
                  {activeOrder.overallStatus}
                </span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="py-6 px-4 bg-[#FAF8F5] rounded-2xl">
              <div className="grid grid-cols-5 gap-2 relative">
                {TIMELINE_STEPS.map((step, idx) => {
                  const currentIdx = getStepIndex(activeOrder.overallStatus);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={step.status} className="flex flex-col items-center text-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium mb-3 transition-colors ${
                          isDone
                            ? 'bg-[#252321] text-white'
                            : 'bg-[#E8E1DB] text-[#A99B8D]'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <span
                        className={`text-sm font-medium leading-tight ${
                          isCurrent ? 'text-[#B66F7B]' : isDone ? 'text-[#252321]' : 'text-[#A99B8D]'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-sm text-[#A99B8D] hidden sm:block mt-1">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Seller Fulfillment Groups */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-[#252321]">
              Atelier Shipments ({activeOrder.sellerGroups.length})
            </h3>

            {activeOrder.sellerGroups.map((group) => (
              <div
                key={group.sellerId}
                className="bg-white rounded-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B]">
                      <Store className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-base text-[#252321]">{group.sellerName}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-[#A99B8D]">
                      Fulfillment Status: <span className="text-[#252321] font-medium uppercase">{group.status}</span>
                    </span>
                    {group.courier && (
                      <span className="text-sm text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full font-medium">
                        {group.courier}: {group.trackingNumber || 'Pending pickup'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {group.items.map((it) => (
                    <div
                      key={it.productId}
                      className="p-4 rounded-2xl bg-[#FAF8F5] flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-4">
                        <ImageWithFallback
                          src={it.product.images[0]}
                          alt={it.product.title}
                          className="w-14 h-18 object-cover rounded-xl bg-[#F3E7E5]"
                        />
                        <div>
                          <p className="font-medium text-[#252321]">{it.product.title}</p>
                          <p className="text-sm text-[#A99B8D] mt-0.5">
                            Size: {it.selectedSize} · Color: {it.selectedColor.name} · Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium tabular-nums text-[#252321]">
                        ৳ {(it.product.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#252321]">
            {/* Delivery address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#B66F7B] font-medium uppercase text-sm">
                <MapPin className="w-4 h-4" />
                <span>Destination Address</span>
              </div>
              <p className="font-medium text-base text-[#252321]">{activeOrder.customer.fullName}</p>
              <p className="text-[#252321]/80">{activeOrder.customer.streetAddress}, {activeOrder.customer.area}</p>
              <p className="text-[#252321]/80">{activeOrder.customer.district}, {activeOrder.customer.division} Division</p>
              <p className="text-[#A99B8D] pt-1">Phone: {activeOrder.customer.phone}</p>
              {activeOrder.customer.deliveryInstructions && (
                <p className="text-sm text-[#A99B8D] italic pt-1">
                  Note: "{activeOrder.customer.deliveryInstructions}"
                </p>
              )}
            </div>

            {/* Payment & Invoice summary */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-[#B66F7B] font-medium uppercase text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Payment Summary</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B8D]">Payment Method</span>
                <span className="font-medium uppercase">{activeOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B8D]">Payment State</span>
                <span className="font-medium text-emerald-700 capitalize">
                  {activeOrder.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A99B8D]">Shipping Fee</span>
                <span className="font-medium tabular-nums">৳ {activeOrder.shippingFee}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span className="font-medium tabular-nums">-৳ {activeOrder.discount}</span>
                </div>
              )}
              <div className="pt-3 flex justify-between font-medium text-base bg-[#FAF8F5] p-3.5 rounded-xl">
                <span>Grand Total</span>
                <span className="tabular-nums">৳ {activeOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <button
              onClick={() => navigateTo('catalog')}
              className="text-sm uppercase tracking-wider font-medium text-[#252321] hover:text-[#B66F7B] px-6 py-3.5 rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              ← Continue Shopping
            </button>
            <button
              onClick={handleCancelOrder}
              className="px-6 py-3.5 bg-white hover:bg-[#F3E7E5] text-[#252321] hover:text-[#B64545] text-sm font-medium rounded-full cursor-pointer transition-colors"
            >
              Request Order Modification
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
