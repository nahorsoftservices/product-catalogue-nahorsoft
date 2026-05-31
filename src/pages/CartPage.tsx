import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, TerminalSquare, AlertCircle, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart } = useCatalog();
  const navigate = useNavigate();

  // Quantities & Total rate calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.product.rate * item.quantity), 0);

  // Validate the cart meets aggregate minimal specifications if any are present
  const maxMOQ = cart.length > 0 ? Math.max(...cart.map(item => item.product.minimumOrderValue)) : 0;
  const isBelowMOQ = totalAmount < maxMOQ;

  if (cart.length === 0) {
    return (
      <div id="cart-empty-state" className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="p-4 bg-gray-50 rounded-full inline-block mb-4">
          <ShoppingCart className="w-12 h-12 text-[#0057D9]" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A] font-sans">Your Cart is Empty</h3>
        <p className="text-gray-500 text-xs mt-1 mb-6 font-sans">
          You haven't selected any items. Browse our wholesale items catalog to add products.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-[#0057D9] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#004dc2]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Return link */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1.5 text-gray-400 hover:text-[#0057D9] mb-6 text-sm font-medium transition-colors font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Browsing Products</span>
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-6 font-sans">
        Wholesale Shopping Basket
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left List of Products */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const prod = item.product;
            const lineTotal = prod.rate * item.quantity;

            return (
              <div 
                key={prod.id}
                className="flex items-center bg-white border border-[#E5E7EB] rounded-2xl p-3 sm:p-4 hover:shadow-xs transition-shadow"
              >
                {/* Image miniature */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAFAFA] rounded-xl overflow-hidden border border-[#E5E7EB] shrink-0 p-2">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info and quantity controls */}
                <div className="ml-3 sm:ml-4 flex-1">
                  <h3 
                    onClick={() => navigate(`/product/${prod.id}`)}
                    className="text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#0057D9] cursor-pointer line-clamp-1 font-sans"
                  >
                    {prod.name}
                  </h3>
                  
                  {/* Item Rates */}
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-xs font-semibold text-gray-500 font-sans">
                      {prod.rateDisplay} / Pc
                    </span>
                  </div>

                  {/* Operational counter block */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden bg-white shrink-0">
                      <button
                        onClick={() => updateCartQuantity(prod.id, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-gray-50 text-gray-500 font-bold text-xs select-none"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold font-mono text-[#0F172A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(prod.id, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-gray-50 text-gray-500 font-bold text-xs select-none"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(prod.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm sticky top-24">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-[#0F172A] mb-4 font-sans">
              Wholesale Order Summary
            </h3>

            <div className="space-y-4 border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-sans">Total Line Models:</span>
                <span className="font-semibold text-[#0F172A] font-sans">{cart.length} Models</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-sans">Total Aggregate Qty:</span>
                <span className="font-semibold text-[#0F172A] font-sans">{totalItemsCount} Pcs</span>
              </div>
              
              {/* Conditional MOQ values information */}
              {maxMOQ > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-sans">Target wholesale MOQ:</span>
                  <span className="font-bold text-[#F59E0B] font-sans">{maxMOQ.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Total rate sum */}
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-[#0F172A] font-bold text-sm font-sans">Total order rate:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-[#0057D9]">₹{totalAmount.toLocaleString()}</span>
                <p className="text-[9px] text-gray-400 font-sans uppercase mt-0.5 mt-0.5">EST. Wholesale rate</p>
              </div>
            </div>

            {/* Warn if below target validation bounds */}
            {isBelowMOQ && (
              <div className="mb-4 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#D97706] rounded-xl flex items-start space-x-2 text-[11px] leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Note:</strong> Wholesale target value is below the vendor's minimum product MOQ specification ({maxMOQ.toLocaleString()}). You can still proceed to discuss with the supplier on WhatsApp.
                </span>
              </div>
            )}

            {/* Check out form buttons */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center space-x-2 bg-[#16A34A] text-white hover:bg-green-700 h-12 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
