import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Scene1Props {
  title: string;
  subtitle: string;
  onExplore: () => void;
}

export const Scene1Invitation: React.FC<Scene1Props> = ({ title, subtitle, onExplore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [warpSpeed, setWarpSpeed] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A12, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle field creation (2500 points)
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const originalZ = new Float32Array(particleCount);

    const goldColor = new THREE.Color(0xD4AF37);
    const pinkColor = new THREE.Color(0xF4C2C2);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 350;
      const y = (Math.random() - 0.5) * 350;
      const z = (Math.random() - 0.5) * 400;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalZ[i] = z;

      // Mix Gold and Pink colors
      const mixed = Math.random() > 0.4 ? goldColor : pinkColor;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;

      sizes[i] = Math.random() * 2.5 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Canvas Texture for glowing particles
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(244, 194, 194, 0.8)');
        gradient.addColorStop(0.7, 'rgba(212, 175, 55, 0.3)');
        gradient.addColorStop(1, 'rgba(10, 10, 18, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const material = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tilt / parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 10;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 10;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let isWarping = false;
    let warpFactor = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Barely perceptible camera idle rotation + parallax
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      const pos = geometry.attributes.position.array as Float32Array;

      if (!isWarping) {
        // Slow gentle drift
        particles.rotation.y += 0.0006;
        particles.rotation.x += 0.0003;
      } else {
        // Warp speed transition
        warpFactor += 0.8;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 2] += warpFactor; // streak forward fast
          if (pos[i * 3 + 2] > 200) {
            pos[i * 3 + 2] = -300;
          }
        }
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Trigger warp speed from parent action
    const startWarp = () => {
      isWarping = true;
    };

    // Store warp function on container DOM for event access
    (container as any).__startWarp = startWarp;

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const handleOpenGift = () => {
    setWarpSpeed(true);
    if (mountRef.current && (mountRef.current as any).__startWarp) {
      (mountRef.current as any).__startWarp();
    }
    // Flash effect after short streak
    setTimeout(() => {
      setFlash(true);
    }, 800);

    // Callback to transition scene
    setTimeout(() => {
      onExplore();
    }, 1300);
  };

  // Letter reveal animation helper
  const titleLetters = title.split("");

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A12]">
      {/* 3D Canvas Background */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-auto" />

      {/* Screen Gold Flash Overlay */}
      {flash && (
        <div className="fixed inset-0 z-50 bg-gradient-to-r from-[#D4AF37] via-[#FFF8E7] to-[#F4C2C2] animate-ping opacity-90 pointer-events-none transition-opacity duration-500" />
      )}

      {/* Foreground Content Card */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0A0A12]/60 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-medium">
            A Birthday Dedicated To You
          </span>
        </motion.div>

        {/* Letter-by-letter blur-to-sharp title reveal */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-playfair font-bold tracking-tight text-[#F5F5F0] mb-6 drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] flex justify-center flex-wrap">
          {titleLetters.map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.3 + index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={char === " " ? "mr-4" : "inline-block text-transparent bg-clip-text bg-gradient-to-b from-[#FFF8E7] via-[#D4AF37] to-[#C5A028]"}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle fade in */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="text-lg sm:text-2xl font-cormorant italic text-[#F4C2C2] tracking-wider mb-12 font-light"
        >
          "{subtitle}"
        </motion.p>

        {/* Pulsing Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="pointer-events-auto inline-block"
        >
          <button
            onClick={handleOpenGift}
            disabled={warpSpeed}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-[#F4C2C2]/20 border border-[#D4AF37]/60 text-[#FFF8E7] font-inter text-sm tracking-widest uppercase hover:bg-[#D4AF37] hover:text-[#0A0A12] transition-all duration-500 shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] cursor-pointer active:scale-95"
          >
            <span className="relative z-10 font-semibold tracking-[0.2em]">Open Your First Gift</span>
            <ArrowDown className="w-4 h-4 text-[#D4AF37] group-hover:text-[#0A0A12] group-hover:translate-y-1 transition-all duration-300 relative z-10" />
            
            {/* Subtle breathing glow ring */}
            <span className="absolute -inset-1 rounded-full bg-[#D4AF37]/30 blur-md group-hover:bg-[#D4AF37]/60 transition-all duration-500 animate-pulse pointer-events-none" />
          </button>
        </motion.div>
      </div>

      {/* Subtle bottom scroll prompt indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs tracking-widest text-[#F5F5F0]/50 font-inter pointer-events-none uppercase"
      >
        <span>Scroll or Tap to explore</span>
        <div className="w-1 h-5 rounded-full border border-[#D4AF37]/40 flex justify-center pt-1">
          <div className="w-0.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
};
