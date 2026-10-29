import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Store,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotalCount,
    navigateTo,
    settings
  } = useMarketplace();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F3E7E5] text-[#B66F7B] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-[#252321]/70 max-w-md mx-auto font-light leading-relaxed">
          Explore handcrafted Jamdani sarees, breathable summer co-ords, and modest essentials from independent Bangladeshi boutiques.
        </p>
        <button
          onClick={() => navigateTo('catalog')}
          className="mt-4 px-8 py-4 bg-[#252321] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer transition-all hover:bg-[#383533]"
        >
          Explore Collections
        </button>
      </div>
    );
  }

  // Group items by boutique
  const boutiqueGroups = cart.reduce((acc, item) => {
    const bId = item.product.boutiqueId;
    if (!acc[bId]) {
      acc[bId] = {
        name: item.product.boutiqueName,
        items: []
      };
    }
    acc[bId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string; items: typeof cart }>);

  // Delivery estimation (inside Dhaka standard default)
  const estimatedShipping = settings.dhakaDeliveryFee;
  const estimatedTotal = cartSubtotal + estimatedShipping;

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#252321]">
            Shopping Bag
          </h1>
          <p className="text-sm text-[#A99B8D] mt-1">
            {cartTotalCount} {cartTotalCount === 1 ? 'piece' : 'pieces'} from{' '}
            {Object.keys(boutiqueGroups).length} independent{' '}
            {Object.keys(boutiqueGroups).length === 1 ? 'boutique' : 'boutiques'}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-[#B66F7B] hover:text-[#9e5c67] cursor-pointer font-medium px-4 py-2 rounded-full hover:bg-[#F3E7E5]/50 transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items by Boutique (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(boutiqueGroups).map(([boutiqueId, group]) => (
            <div
              key={boutiqueId}
              className="bg-white rounded-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Boutique Header */}
              <div className="flex items-center justify-between pb-3 text-sm">
                <div className="flex items-center gap-2.5 font-medium text-[#252321]">
                  <div className="w-8 h-8 rounded-full bg-[#F3E7E5] flex items-center justify-center text-[#B66F7B]">
                    <Store className="w-4 h-4" />
                  </div>
                  <span>Atelier: {group.name}</span>
                </div>
                <span className="text-sm text-[#A99B8D] bg-[#FAF8F5] px-3.5 py-1 rounded-full font-medium">
                  Direct Atelier Shipment
                </span>
              </div>

              {/* Items in this boutique */}
              <div className="space-y-5">
                {group.items.map((item) => (
                  <div
                    key={`${item.productId}-${item.selectedSize}-${item.selectedColor.name}`}
                    className="p-4 rounded-2xl bg-[#FAF8F5] flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                  >
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-20 h-26 sm:w-24 sm:h-30 object-cover rounded-2xl bg-[#F3E7E5] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-2">
                      <h3
                        onClick={() => navigateTo('product-detail', { productId: item.productId })}
                        className="text-sm sm:text-base font-medium text-[#252321] hover:text-[#B66F7B] cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#A99B8D]">
                        <span>Size: <span className="text-[#252321] font-medium">{item.selectedSize}</span></span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1.5">
                          Shade:
                          <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-[#252321] font-medium">{item.selectedColor.name}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        {/* Stepper */}
                        <div className="flex items-center bg-white rounded-full p-1 text-sm">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.selectedSize,
                                item.selectedColor.name,
                                -1
                              )
                            }
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E7E5] transition-colors cursor-pointer text-[#252321] font-medium"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-3.5 py-1 font-medium tabular-nums text-sm text-[#252321]">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.productId,
                                item.selectedSize,
                                item.selectedColor.name,
                                1
                              )
                            }
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E7E5] transition-colors cursor-pointer text-[#252321] font-medium"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-4">
                          <span className="text-base font-medium text-[#252321] tabular-nums">
                            ৳ {(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() =>
                              removeFromCart(
                                item.productId,
                                item.selectedSize,
                                item.selectedColor.name
                              )
                            }
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A99B8D] hover:text-[#B64545] hover:bg-white transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => navigateTo('catalog')}
            className="text-sm font-medium uppercase tracking-wider text-[#252321] hover:text-[#B66F7B] flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-full hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Continue Discovering Pieces</span>
          </button>
        </div>

        {/* Right: Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-medium uppercase tracking-wider text-[#252321] pb-2">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-[#252321]">
            <div className="flex justify-between">
              <span className="text-[#A99B8D]">Subtotal</span>
              <span className="font-medium tabular-nums">
                ৳ {cartSubtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A99B8D]">Estimated Delivery (Dhaka)</span>
              <span className="font-medium tabular-nums">
                ৳ {estimatedShipping}
              </span>
            </div>
            <p className="text-sm text-[#A99B8D] leading-relaxed">
              *Delivery to other divisions calculated at checkout. Free nationwide delivery on orders over ৳5,000.
            </p>
          </div>

          <div className="pt-4 flex justify-between items-baseline bg-[#FAF8F5] p-4 rounded-2xl">
            <span className="text-sm font-medium text-[#252321]">Estimated Total</span>
            <div className="text-right">
              <span className="text-2xl font-medium text-[#252321] tabular-nums">
                ৳ {estimatedTotal.toLocaleString('en-IN')}
              </span>
              <p className="text-sm text-[#A99B8D] mt-0.5">Includes taxes & packaging</p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('checkout')}
            className="w-full py-4 bg-[#252321] hover:bg-[#383533] text-white text-sm uppercase tracking-widest font-medium rounded-full cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-sm text-[#A99B8D] space-y-1 text-center">
            <p className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>bKash, Nagad & Cash on Delivery</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
