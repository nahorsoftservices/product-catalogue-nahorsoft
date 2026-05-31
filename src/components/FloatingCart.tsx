import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingCart: React.FC = () => {
  const { cart } = useCatalog();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide floating cart button on the Cart, Customer Details, or success screens
  const hiddenOnPaths = ['/cart', '/checkout', '/success'];
  if (hiddenOnPaths.includes(location.pathname)) {
    return null;
  }

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  if (totalQuantity === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        id="floating-cart-btn"
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 50 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/cart')}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center space-x-2 bg-[#0057D9] text-white px-5 py-3.5 rounded-full shadow-lg shadow-[#0057D9]/20 hover:bg-[#004dc2] transition-colors focus:outline-none focus:ring-4 focus:ring-[#0057D9]/30"
        aria-label="View Cart"
      >
        <ShoppingCart className="w-5 height-5" />
        <span className="font-semibold text-sm tracking-wide font-sans">
          Cart ({totalQuantity})
        </span>
      </motion.button>
    </AnimatePresence>
  );
};
