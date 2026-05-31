import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { Search, Loader2, ArrowRight, Share2, VolumeX, AlertTriangle, PackageOpen, RotateCcw, Plus, ShoppingCart, ShoppingBag, Layers, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products, loading, error, addToCart, cart, isPwaInstallable, triggerPWAInstall, refreshCatalog } = useCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Search filter
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(query);
    const descMatch = product.description.toLowerCase().includes(query);
    return nameMatch || descMatch;
  });

  // Calculate cart counts for instant display
  const getProductCartCount = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Image fallback handler
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  // Standard loading skeletal loaders
  if (loading) {
    return (
      <div id="home-loading" className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Loader2 className="w-12 h-12 text-[#4F46E5] animate-spin mb-4" />
        <p className="text-[#0F172A] font-medium font-sans">Loading solutions catalog...</p>
        <p className="text-gray-400 text-xs mt-1">Fetching live rates from inventory systems</p>
      </div>
    );
  }

  // Handle Sheet connection failures
  if (error) {
    return (
      <div id="home-error" className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto px-6 text-center">
        <AlertTriangle className="w-16 h-16 text-[#F59E0B] mb-4" />
        <h3 className="text-xl font-bold text-[#0F172A] font-sans">Spreadsheet Sync Offline</h3>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          {error}. Please check your connection or try again. Offline browsing utilizes cached values if available.
        </p>
        <button
          onClick={refreshCatalog}
          className="flex items-center space-x-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg hover:bg-[#3B32CC] transition-colors focus:ring-4 focus:ring-[#4F46E5]/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Stock List</span>
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Introduction Hero Section for Nahorsoft Software Services */}
      <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#1E1B4B] to-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-[#4F46E5]/20 text-[#818CF8] px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 border border-[#4F46E5]/30">
            <span>✨ Tailored IT Solutions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 font-display">
            Custom Software built for Your Business Growth
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
            We provide customised apps, automated inventory sheets, secure ordering channels, and bespoke software systems to <strong className="text-white">retailers and wholesalers</strong> to streamline, digitize, and scale operations.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6 pt-6 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Retail & POS Systems</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#818CF8]"></span>
              <span>Bespoke Wholesale Apps</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Automated Inventory</span>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Banner Installation Notification Prompts */}
      {isPwaInstallable && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          id="pwa-install-banner"
          className="mb-8 p-4 bg-[#4F46E5] text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 border border-[#4F46E5]/40"
        >
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="p-2 bg-white/15 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Install Nahorsoft Software App</p>
              <p className="text-xs text-white/80">Browse customized products and place bulk orders with one tap from your home screen.</p>
            </div>
          </div>
          <button
            onClick={triggerPWAInstall}
            className="w-full sm:w-auto bg-white text-[#4F46E5] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all font-sans active:translate-y-px"
          >
            Add to Home Screen
          </button>
        </motion.div>
      )}

      {/* Catalog Search & Info Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search software products, models, or core specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-[#0F172A] placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:bg-white transition-all font-sans"
            />
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
            <div className="text-sm text-gray-500 font-sans">
              Showing <span className="text-[#0F172A] font-semibold">{filteredProducts.length}</span> of <span className="text-[#0F172A] font-semibold">{products.length}</span> stock items
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 text-[#4F46E5] rounded-lg text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Systems</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List state */}
      {filteredProducts.length === 0 ? (
        <div id="catalog-empty-state" className="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <PackageOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">No Matching Products</h3>
          <p className="text-gray-400 text-xs mt-1 mb-6">We couldn't search any item matching "{searchQuery}". Try editing spelling or model numbers.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs bg-[#0F172A] text-white px-4  py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div id="product-grid" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const currentQty = getProductCartCount(product.id);
            const imageFailed = imgErrors[product.id];

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Visual Image Header aspect ratio square */}
                <div 
                  className="relative w-full aspect-square bg-[#FAFAFA] overflow-hidden border-b border-[#E5E7EB] cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {!imageFailed ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      onError={() => handleImageError(product.id)}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain filter hover:scale-105 transition-transform duration-300 p-4"
                    />
                  ) : (
                    // Fallback visual SVG icon for missing links
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-300">
                      <Layers className="w-12 h-12 mb-2" />
                      <span className="text-[10px] font-sans text-gray-400">Image Fallback</span>
                    </div>
                  )}

                  {/* Quantity In Basket Visual Sticker */}
                  {currentQty > 0 && (
                    <div className="absolute top-3 left-3 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      In Cart: {currentQty}
                    </div>
                  )}
                </div>

                {/* Content body containing Title, Rate, and MOQ */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-sm sm:text-base font-semibold text-[#0F172A] tracking-tight hover:text-[#4F46E5] cursor-pointer line-clamp-2 min-h-[2.5rem] font-sans"
                    >
                      {product.name}
                    </h4>

                    {/* Pricing Ratios */}
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 sm:gap-2">
                       <div className="text-[#0F172A] font-extrabold text-base sm:text-lg">
                        {product.rateDisplay}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        Per License Rate
                      </div>
                    </div>

                    {/* Wholesale Minimum Order Sticker */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                      <span>Target MOQ:</span>
                      <span className="font-bold text-[#4F46E5] font-sans">
                        {product.minimumOrderValueDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Operational Footer action button */}
                  <div className="mt-4">
                    {currentQty > 0 ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => addToCart(product, -1)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#0F172A] font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#0F172A]">
                          {currentQty}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="flex-1 bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 text-[#4F46E5] font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-full flex items-center justify-center space-x-1.5 bg-[#4F46E5] text-white hover:bg-[#3B32CC] py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
