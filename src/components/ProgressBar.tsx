import React, { useEffect, useState } from 'react';

export const ProgressBar: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-[#0A0A12]/80 z-50 pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F4C2C2] to-[#D4AF37] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(212,175,55,0.8)]"
        style={{ width: `${scrollPercent}%` }}
      />
    </div>
  );
};
