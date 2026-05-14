'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiX, FiArrowRight, FiTag, FiClock } from 'react-icons/fi';

export default function OfferPopup() {
  const [show, setShow] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

  useEffect(() => {
    // ৩ সেকেন্ড পর popup দেখাবে
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem('offer_dismissed');
      if (!dismissed) setShow(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer logic
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(interval);
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [show]);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem('offer_dismissed', 'true');
  };

  if (!show) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <>
      {/* Backdrop: এখানে ক্লিক করলে পপআপ ক্লোজ হবে */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
        style={{ pointerEvents: 'none' }}>
        
        <div
          className="relative w-full max-w-[440px] sm:max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300"
          style={{
            background: 'rgba(10,10,10,0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(200,255,0,0.2)',
            borderRadius: '24px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(200,255,0,0.1)',
            pointerEvents: 'all',
          }}>

          {/* Top aesthetic glow line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C8FF00, transparent)' }} />

          {/* Close button: Cross চিহ্ন দিলে পপআপ চলে যাবে */}
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <FiX size={18} />
          </button>

          {/* Background image overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60"
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
          </div>

          <div className="relative z-10 p-6 sm:p-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 sm:mb-6"
              style={{ background: 'rgba(200,255,0,0.1)', border: '1px solid rgba(200,255,0,0.25)' }}>
              <FiTag className="text-[#C8FF00]" size={12} />
              <span className="text-[#C8FF00] text-[10px] sm:text-xs font-bold uppercase tracking-widest">Limited Time Offer</span>
            </div>

            {/* Heading: Mobile-এ টেক্সট সাইজ কিছুটা কমানো হয়েছে */}
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
              GET <span style={{ color: '#C8FF00' }}>20% OFF</span><br />
              Your First Order!
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
              Use code <span style={{ color: '#C8FF00' }} className="font-bold">FITZONE20</span> at checkout. 
              Valid on all equipment.
            </p>

            {/* Coupon code box */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-6"
              style={{ background: 'rgba(200,255,0,0.06)', border: '1px dashed rgba(200,255,0,0.3)' }}>
              <div className="flex-1">
                <p className="text-gray-500 text-[10px] mb-0.5">Your coupon code</p>
                <p style={{ color: '#C8FF00' }} className="font-black text-lg sm:text-xl tracking-widest leading-none">FITZONE20</p>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText('FITZONE20'); }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-black transition-all hover:brightness-110 active:scale-95"
                style={{ background: '#C8FF00' }}>
                COPY
              </button>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8">
              <FiClock className="text-gray-500" size={14} />
              <p className="text-gray-500 text-[10px] sm:text-xs uppercase font-medium">Expires in:</p>
              <div className="flex items-center gap-1.5 ml-1">
                {[
                  { value: pad(timeLeft.hours), label: 'h' },
                  { value: pad(timeLeft.minutes), label: 'm' },
                  { value: pad(timeLeft.seconds), label: 's' },
                ].map(({ value, label }, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="px-1.5 py-1 rounded text-xs sm:text-sm font-bold text-white"
                      style={{ background: 'rgba(255,255,255,0.08)', minWidth: '28px', textAlign: 'center' }}>
                      {value}
                    </div>
                    <span className="text-gray-500 text-[10px]">{label}</span>
                    {i < 2 && <span style={{ color: '#C8FF00' }} className="font-bold">:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/products" onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #C8FF00, #A8D900)' }}>
                Shop Now <FiArrowRight size={16} />
              </Link>
              <button onClick={handleClose}
                className="py-3.5 px-6 rounded-xl font-semibold text-gray-400 text-sm transition-all hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                No Thanks
              </button>
            </div>

            {/* Terms */}
            <p className="text-gray-500 text-[10px] text-center mt-5">
              *Min. order ৳2,000. T&C Apply.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
