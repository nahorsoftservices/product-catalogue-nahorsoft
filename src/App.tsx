import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { Header } from './components/Header';
import { FloatingCart } from './components/FloatingCart';
import { MandatoryInstallOverlay } from './components/MandatoryInstallOverlay';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CustomerDetailsPage } from './pages/CustomerDetailsPage';
import { SuccessPage } from './pages/SuccessPage';

export default function App() {
  return (
    <CatalogProvider>
      <Router>
        <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans hover:cursor-default selection:bg-[#0057D9]/10">
          {/* Lock/Prompts Screen Overlay for Non-PWA web browsing */}
          <MandatoryInstallOverlay />

          {/* Main App Bar Header */}
          <Header />

          {/* Dynamic Routes Content Block */}
          <main className="flex-1 bg-white pb-32">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CustomerDetailsPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
          </main>

          {/* Floating shopping cart visual */}
          <FloatingCart />
        </div>
      </Router>
    </CatalogProvider>
  );
}
