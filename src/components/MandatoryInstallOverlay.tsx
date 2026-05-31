import React, { useState, useEffect } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Download, Monitor, Smartphone, AlertCircle, HelpCircle, Laptop, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MandatoryInstallOverlay: React.FC = () => {
  const { isPwaInstallable, triggerPWAInstall } = useCatalog();
  const [isStandalone, setIsStandalone] = useState<boolean>(true);
  const [showWebBypass, setShowWebBypass] = useState<boolean>(false);

  // Check if we are running in an iframe (like the AI Studio sandbox preview)
  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();

  useEffect(() => {
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (navigator as any).standalone === true;
      setIsStandalone(standalone);
    };

    checkStandalone();
    
    // Periodically re-verify if state shifts
    const interval = setInterval(checkStandalone, 2000);
    return () => clearInterval(interval);
  }, []);

  // Return nothing if already installed and running as standalone native app
  if (isStandalone) {
    return null;
  }

  // If the user dismissed or bypasses for testing/sandbox preview, let them hide
  if (showWebBypass) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F172A] text-white flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-[#1E293B] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#4F46E5]/20 text-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#4F46E5]/35">
            <Download className="w-8 h-8 text-[#4F46E5]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans uppercase">
            Nahorsoft Software
          </h2>
          <p className="text-xs text-[#4F46E5] tracking-widest font-bold uppercase mt-1">
            Official Installation Required
          </p>
        </div>

        <div className="space-y-4 mb-6 text-sm text-slate-300">
          <p className="text-xs text-center border-b border-slate-700/60 pb-3 leading-relaxed text-slate-400">
            To view our premium customized software prototypes, access live wholesale software options, and submit customized app requirements, please download and install our Web app shortcut.
          </p>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
              <span className="bg-[#4F46E5] text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-semibold text-xs text-white">Click Install App</p>
                <p className="text-[11px] text-slate-400">Triggers Google Chrome's fast native desktop or mobile PWA downloader.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
              <span className="bg-[#4F46E5] text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-semibold text-xs text-white">Add to Home Screen</p>
                <p className="text-[11px] text-slate-400">Once installed, open it directly from your list of device apps.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
              <span className="bg-[#4F46E5] text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-semibold text-xs text-white">Instant Sync & Offline Use</p>
                <p className="text-[11px] text-slate-400">Access customized software catalogs even with unstable or disconnected internet.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chrome support notice */}
        <div className="mb-6 p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start space-x-2 text-[11px] text-slate-400">
          <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <span>
            If on mobile Chrome/Edge, click Chrome menu (three dots icon) and choose <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong> if the button below doesn't trigger automatically.
          </span>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2.5">
          {isPwaInstallable ? (
            <button
              onClick={triggerPWAInstall}
              className="w-full flex items-center justify-center space-x-2 bg-[#4F46E5] text-white hover:bg-[#3B32CC] h-12 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-[0.99]"
            >
              <Download className="w-4 h-4" />
              <span>Install Official App Now</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-center text-xs text-[#F59E0B] font-medium bg-[#F59E0B]/10 py-2.5 px-3 rounded-xl border border-[#F59E0B]/20">
                PWA is ready. Look for the "Install" icon at the end of the URL address bar or select Chrome menu → "Install app".
              </div>
            </div>
          )}

          {/* Fallback browser visual link for local developers or sandbox testing */}
          <div className="pt-2 text-center">
            {isInIframe ? (
              <button
                onClick={() => setShowWebBypass(true)}
                className="text-[11px] text-[#4F46E5] hover:underline uppercase tracking-wider font-semibold focus:outline-none"
              >
                [Iframe Sandbox Bypass for Developer Preview]
              </button>
            ) : (
              <button
                onClick={() => setShowWebBypass(true)}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-medium tracking-wide focus:outline-none"
              >
                Dismiss & Browse Web Version
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
