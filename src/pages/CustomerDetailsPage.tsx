import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { ChevronLeft, MessageSquare, ShieldCheck, HelpCircle, Loader2, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomerDetailsPage: React.FC = () => {
  const { cart, customerDetails, saveCustomerDetails, clearCart } = useCatalog();
  const navigate = useNavigate();

  // Local Form states
  const [formData, setFormData] = useState({
    name: customerDetails.name,
    mobile: customerDetails.mobile,
    shopName: customerDetails.shopName,
    address: customerDetails.address
  });

  // Client errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [redirecting, setRedirecting] = useState(false);

  // Totals calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.product.rate * item.quantity), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Mobile clean checks
  const validateForm = () => {
    const currentErrors: Record<string, string> = {};
    if (!formData.name.trim()) currentErrors.name = 'Customer/Contact name is required.';
    
    // Mobile verification: At least 10 numbers, digits only or plus prefix
    const cleanMobile = formData.mobile.replace(/[^\d+]/g, '');
    if (!formData.mobile.trim()) {
      currentErrors.mobile = 'Mobile number is required.';
    } else if (cleanMobile.length < 10) {
      currentErrors.mobile = 'Enter a valid active mobile number (min 10 digits).';
    }

    if (!formData.shopName.trim()) currentErrors.shopName = 'Trading shop/business name is required.';
    if (!formData.address.trim()) currentErrors.address = 'Full dispatch shipping address is required.';

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  // Automated WhatsApp Message compiler
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Save state to store
    saveCustomerDetails(formData);
    setRedirecting(true);

    // Build PRODUCTS array string
    const productsString = cart.map((item) => {
      const prod = item.product;
      return `${prod.name}\nQty: ${item.quantity}\nRate: ₹${prod.rate.toLocaleString()}`;
    }).join('\n\n');

    // Build the exact spec message pattern
    const message = `MAHABIR QUANTUM INDIA ORDER

Customer Name:
${formData.name}

Mobile:
${formData.mobile}

Shop Name:
${formData.shopName}

Address:
${formData.address}

PRODUCTS:

${productsString}

Total Products:
${totalItemsCount}

Please confirm availability.`;

    // Target API whatsapp configurations
    const targetNumber = '9954212886';
    const textEncoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${textEncoded}`;

    // Execute automatic route displacement
    setTimeout(() => {
      // Clear Cart state to prevent double orders
      clearCart();
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      navigate('/success');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Return triggers */}
      <button
        onClick={() => navigate('/cart')}
        disabled={redirecting}
        className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-[#0057D9] mb-6 text-sm font-medium transition-colors font-sans disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Basket</span>
      </button>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-8 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2 font-sans">
          Confirm Business Information
        </h2>
        <p className="text-xs text-gray-400 mb-6 font-sans">
          Provide your firm description below to automatically compile and submit the invoice request over WhatsApp.
        </p>

        {/* Dynamic redirection loader */}
        <AnimatePresence>
          {redirecting && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white"
            >
              <Loader2 className="w-16 h-16 text-green-500 animate-spin mb-4" />
              <h3 className="text-xl font-bold font-sans">Compiling Wholesale Invoice...</h3>
              <p className="text-gray-300 text-xs max-w-xs mt-2 leading-relaxed">
                We are generating the shopping roster. Redirecting you to WhatsApp line <strong>9954212886</strong> to confirm stock availability.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handlePlaceOrder} className="space-y-5">
          {/* Form input: Customer Name */}
          <div>
            <label htmlFor="customer-name" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 font-sans">
              Customer Name / Proprietor *
            </label>
            <input
              id="customer-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Rajat Sharma"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#0057D9]'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-sans font-medium">{errors.name}</p>}
          </div>

          {/* Form input: Mobile Number */}
          <div>
            <label htmlFor="customer-mobile" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 font-sans">
              Active WhatsApp Mobile Number *
            </label>
            <input
              id="customer-mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#0057D9]'
              }`}
            />
            {errors.mobile && <p className="text-red-500 text-xs mt-1.5 font-sans font-medium">{errors.mobile}</p>}
          </div>

          {/* Form: Shop Name */}
          <div>
            <label htmlFor="customer-shop" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 font-sans">
              Shop Name / Business Firm *
            </label>
            <input
              id="customer-shop"
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleInputChange}
              placeholder="e.g. Asian Electronics & Electricals"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                errors.shopName ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#0057D9]'
              }`}
            />
            {errors.shopName && <p className="text-red-500 text-xs mt-1.5 font-sans font-medium">{errors.shopName}</p>}
          </div>

          {/* Form Input: Address */}
          <div>
            <label htmlFor="customer-address" className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2 font-sans">
              Full Dispatch Delivery Address *
            </label>
            <textarea
              id="customer-address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Specify Shop/Building No, Ward, Street Name, Landmark, City, State & Pincode"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                errors.address ? 'border-red-500 focus:ring-red-500' : 'border-[#E5E7EB] focus:ring-[#0057D9]'
              }`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1.5 font-sans font-medium">{errors.address}</p>}
          </div>

          {/* Secure Checkout Visual sticker */}
          <div className="p-3.5 bg-gray-50 border border-[#E5E7EB] rounded-xl flex items-center justify-between text-xs text-gray-500 mt-2">
            <span className="font-medium font-sans">Payment Terms:</span>
            <span className="font-bold text-[#16A34A] uppercase font-sans">No advance, pay on confirmation</span>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-[#16A34A] text-white hover:bg-green-700 h-12 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-green-300/30"
            >
              <MessageSquare className="w-4 h-4 text-white fill-white" />
              <span>Send Wholesale Order to WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
