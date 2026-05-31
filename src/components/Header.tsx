import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b-2 border-[#4F46E5] py-3.5 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link to="/" className="flex items-center space-x-3 text-left">
          <img 
            src="https://i.ibb.co/qF2R7QtD/Logo-New.png" 
            alt="Nahorsoft Logo" 
            referrerPolicy="no-referrer"
            className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0F172A] select-none uppercase font-display leading-none">
              NAHORSOFT
            </h1>
            <p className="text-[10px] sm:text-xs text-[#4F46E5] font-bold tracking-wider mt-0.5 uppercase font-sans">
              Software Services
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};
