import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="checkout-success" className="container mx-auto px-4 py-16 text-center max-w-md">
      <div className="p-4 bg-green-50 rounded-full inline-block mb-4 text-[#16A34A]">
        <ShieldCheck className="w-16 h-16" />
      </div>
      
      <h2 className="text-2xl font-black text-[#0F172A] mb-2 font-sans tracking-tight">Order Compiled!</h2>
      <p className="text-gray-500 text-xs mt-1 mb-6 font-sans leading-relaxed">
        Your wholesale inventory selection was successfully written and dispatched to our wholesale account. A chat window with <strong>9954212886</strong> has been opened.
      </p>

      {/* Description of steps */}
      <div className="bg-slate-50 border border-[#E5E7EB] rounded-xl p-4 text-left space-y-3.5 mb-8 text-xs text-gray-500">
        <h4 className="font-bold text-[#0F172A] tracking-wider uppercase text-[10px]">What happens next?</h4>
        <div className="flex items-start space-x-2">
          <span className="bg-[#0057D9] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] shrink-0">1</span>
          <p>Send the pre-formatted text message in the WhatsApp thread that just opened.</p>
        </div>
        <div className="flex items-start space-x-2">
          <span className="bg-[#0057D9] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] shrink-0">2</span>
          <p>The Mahabir Quantum India manager will verify immediate stock availability at our warehouse.</p>
        </div>
        <div className="flex items-start space-x-2">
          <span className="bg-[#0057D9] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[9px] shrink-0">3</span>
          <p>We will share wholesale transport invoice terms, freight costs, and payment confirmation methods.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-2 bg-[#0057D9] text-white hover:bg-[#004dc2] h-12 rounded-xl text-sm font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return To Catalog</span>
        </button>
      </div>
    </div>
  );
};
