import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b-2 border-[#0057D9] py-4 text-center">
      <Link to="/" className="inline-block">
        <h1 className="text-xl sm:text-2xl font-black tracking-wider text-[#0F172A] select-none uppercase font-sans">
          MAHABIR QUANTUM INDIA
        </h1>
        <p className="text-[10px] sm:text-xs text-[#0057D9] font-medium tracking-widest mt-0.5 uppercase">
          Wholesale Electronics Hub
        </p>
      </Link>
    </header>
  );
};
