import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface Scene3Props {
  personalNote: string;
}

export const Scene3ScrollConstellation: React.FC<Scene3Props> = ({ personalNote }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress between 0 and 1 when scrolling into view
      const totalDistance = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const progress = Math.min(1, Math.max(0, currentPos / totalDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Heart Constellation Nodes
    const centerX = width / 2;
    const centerY = height / 2 - 10;
    const scale = Math.min(width, height) / 28;

    // Mathematical Heart Curve Points
    const heartPoints: { x: number; y: number }[] = [];
    const totalPoints = 40;

    for (let i = 0; i < totalPoints; i++) {
      const t = (i / totalPoints) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      heartPoints.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
      });
    }

    // Render loop triggered by scrollProgress
    ctx.clearRect(0, 0, width, height);

    // Draw background subtle ambient particles
    for (let i = 0; i < 30; i++) {
      const px = (Math.sin(i * 99) * 0.5 + 0.5) * width;
      const py = (Math.cos(i * 33) * 0.5 + 0.5) * height;
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 194, 194, 0.2)';
      ctx.fill();
    }

    // Determine how many lines/points to draw based on scrollProgress
    const drawnPointsCount = Math.floor(scrollProgress * totalPoints);

    // Draw connecting gold lines
    if (drawnPointsCount > 1) {
      ctx.beginPath();
      ctx.moveTo(heartPoints[0].x, heartPoints[0].y);
      for (let i = 1; i < drawnPointsCount; i++) {
        ctx.lineTo(heartPoints[i].x, heartPoints[i].y);
      }
      if (scrollProgress >= 0.95) {
        ctx.closePath(); // Complete full heart loop
      }

      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      ctx.shadowBlur = 15;
      ctx.stroke();
    }

    // Draw Glowing Star Nodes
    for (let i = 0; i < drawnPointsCount; i++) {
      const pt = heartPoints[i];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = i === drawnPointsCount - 1 ? '#FFF8E7' : '#F4C2C2';
      ctx.shadowColor = '#D4AF37';
      ctx.shadowBlur = 12;
      ctx.fill();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollProgress]);

  // Split handwritten note into lines for smooth fade-in
  const noteLines = personalNote.split('\n').filter(line => line.trim().length > 0);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen py-24 px-6 bg-[#0A0A12] flex items-center justify-center overflow-hidden">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: 2D Canvas Constellation Heart */}
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl border border-[#D4AF37]/20 bg-[#0A0A12]/60 backdrop-blur-md flex items-center justify-center p-4 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
          <canvas ref={canvasRef} className="w-full h-full" />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-inter uppercase tracking-[0.2em] text-[#D4AF37]/80">
            <Heart className="w-3.5 h-3.5 fill-[#D4AF37]" />
            <span>Constellation of Love</span>
          </div>
        </div>

        {/* Right Side: Handwritten Personal Note */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#0A0A12]/80 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              Written From The Heart
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#F5F5F0]">
            For Your Eyes Only
          </h2>

          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141424]/80 to-[#0A0A12] border border-[#D4AF37]/30 shadow-[0_0_40px_rgba(10,10,18,0.9)] space-y-4">
            {noteLines.map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="font-dancing text-2xl sm:text-3xl text-[#F4C2C2] leading-relaxed tracking-wide font-normal"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
