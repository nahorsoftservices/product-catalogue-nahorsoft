import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { ChevronLeft, ShoppingCart, Info, Layers, Check, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, cart, addToCart } = useCatalog();

  const product = products.find(p => p.id === id);

  // Image fallback handler
  const [imgError, setImgError] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-sans">Product Not Found</h3>
        <p className="text-gray-500 text-sm mb-6 font-sans">The product model might have been removed or updated in the catalog.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#3B32CC]"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Get current quantity in cart
  const cartItem = cart.find(item => item.product.id === product.id);
  const cartQty = cartItem ? cartItem.quantity : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-[#4F46E5] mb-6 text-sm font-medium transition-colors font-sans focus:outline-none"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Grid Layout (Left: Image, Right: Information Card) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden p-4 sm:p-6 shadow-sm">
        
        {/* Left Column: Image with square outline */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] p-4 aspect-square">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter max-h-[350px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 py-12">
              <Layers className="w-16 h-16 mb-2" />
              <span className="text-xs font-sans text-gray-400">Image Fallback Placeholder</span>
            </div>
          )}
        </div>

        {/* Right Column: Wholesale Specifications and actions */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <span className="inline-block bg-[#4F46E5]/10 text-[#4F46E5] text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md mb-3 font-sans">
              SOFTWARE SPECIFICATION
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight leading-tight mb-4 font-sans">
              {product.name}
            </h1>

            {/* Price & MOQ Block */}
            <div className="grid grid-cols-2 gap-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-0.5">Software Rate</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">{product.rateDisplay}</span>
                <span className="text-[10px] text-gray-400 block font-sans">Per License Rate</span>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-sans block mb-0.5">Min Order Value</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#4F46E5]">{product.minimumOrderValueDisplay}</span>
                <span className="text-[10px] text-gray-400 block font-sans">Target MOQ</span>
              </div>
            </div>

            {/* Secondary Parameters (Cartoon sizing) */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-gray-500 font-sans">Pieces Per Carton (Cartoon Sizes):</span>
                <span className="font-bold text-[#0F172A] font-mono select-none bg-slate-100 px-2.5 py-0.5 rounded text-xs">
                  {product.perCartoonPieces}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm border-t border-gray-50">
                <span className="text-gray-500 font-sans">Item Status:</span>
                <span className="font-semibold text-[#16A34A] flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 uppercase stroke-[3]" />
                  <span>Ready Stock</span>
                </span>
              </div>
            </div>

            {/* Detailed description */}
            <div className="mb-6">
              <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2 font-sans">Product Details</h3>
              <p className="text-sm text-[#0F172A] leading-relaxed font-sans bg-gray-50 p-3.5 rounded-xl border border-gray-100 whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add subtracting quantity buttons in page details */}
              {cartQty > 0 ? (
                <div className="flex items-center border border-[#E5E7EB] rounded-xl overflow-hidden h-12 bg-white">
                  <button
                    onClick={() => addToCart(product, -1)}
                    className="px-4 hover:bg-gray-50 h-full flex items-center justify-center text-gray-500 font-bold text-lg select-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-[#0F172A] font-mono">
                    {cartQty}
                  </span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-4 hover:bg-gray-50 h-full flex items-center justify-center text-gray-500 font-bold text-lg select-none"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#4F46E5] text-white hover:bg-[#3B32CC] h-12 rounded-xl text-sm font-bold transition-all shadow-sm focus:outline-none"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
              )}

              {/* Navigating actions */}
              <button
                onClick={() => navigate('/cart')}
                disabled={cart.length === 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-[#0F172A] text-white hover:bg-slate-800 disabled:bg-gray-100 disabled:text-gray-400 h-12 rounded-xl text-sm font-bold transition-all focus:outline-none"
              >
                <span>Go To Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {cartQty > 0 && (
              <p className="text-xs text-center text-[#16A34A] font-medium mt-3 flex items-center justify-center space-x-1">
                <Check className="w-3.5 h-3.5 stroke-[2]" />
                <span>You added {cartQty} units of this software solution to your cart.</span>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
