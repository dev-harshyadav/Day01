import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Heart, Volume2, Mic, Play, Pause } from 'lucide-react';

interface Scene6Props {
  closingMessage: string;
  voiceNoteUrl: string;
}

export const Scene6FinalGift: React.FC<Scene6Props> = ({ closingMessage, voiceNoteUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A12, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Spotlight pointing at the gift box
    const spotlight = new THREE.SpotLight(0xD4AF37, 8.0);
    spotlight.position.set(0, 10, 5);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.8;
    spotlight.castShadow = true;
    scene.add(spotlight);

    const pinkFillLight = new THREE.PointLight(0xF4C2C2, 2.5, 20);
    pinkFillLight.position.set(-4, -2, 4);
    scene.add(pinkFillLight);

    const ambientLight = new THREE.AmbientLight(0x221122, 1.0);
    scene.add(ambientLight);

    // Low-poly 3D Gift Box
    const giftGroup = new THREE.Group();
    scene.add(giftGroup);

    // Box Base
    const boxGeo = new THREE.BoxGeometry(2.4, 2.0, 2.4);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x1c122e,
      roughness: 0.3,
      metalness: 0.2
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.y = -0.5;
    giftGroup.add(boxMesh);

    // Gold Ribbon cross on Box Base
    const ribbonVGeo = new THREE.BoxGeometry(2.45, 2.02, 0.3);
    const ribbonHGeo = new THREE.BoxGeometry(0.3, 2.02, 2.45);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      roughness: 0.2,
      metalness: 0.8
    });
    const ribbonV = new THREE.Mesh(ribbonVGeo, ribbonMat);
    const ribbonH = new THREE.Mesh(ribbonHGeo, ribbonMat);
    ribbonV.position.y = -0.5;
    ribbonH.position.y = -0.5;
    giftGroup.add(ribbonV);
    giftGroup.add(ribbonH);

    // Gift Lid
    const lidGroup = new THREE.Group();
    const lidGeo = new THREE.BoxGeometry(2.6, 0.5, 2.6);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidMesh.position.y = 0.6;
    lidGroup.add(lidMesh);

    // Ribbon on Lid
    const lidRibbonV = new THREE.Mesh(new THREE.BoxGeometry(2.65, 0.52, 0.32), ribbonMat);
    const lidRibbonH = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 2.65), ribbonMat);
    lidRibbonV.position.y = 0.6;
    lidRibbonH.position.y = 0.6;
    lidGroup.add(lidRibbonV);
    lidGroup.add(lidRibbonH);

    // Ribbon Bow Knot on Top
    const knotGeo = new THREE.TorusGeometry(0.35, 0.12, 12, 24);
    const knotLeft = new THREE.Mesh(knotGeo, ribbonMat);
    const knotRight = new THREE.Mesh(knotGeo, ribbonMat);
    knotLeft.position.set(-0.3, 1.0, 0);
    knotLeft.rotation.y = Math.PI / 4;
    knotRight.position.set(0.3, 1.0, 0);
    knotRight.rotation.y = -Math.PI / 4;
    lidGroup.add(knotLeft);
    lidGroup.add(knotRight);

    giftGroup.add(lidGroup);

    // Raycaster for clicking gift box
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(giftGroup.children, true);

      if (intersects.length > 0) {
        triggerGiftOpen();
      }
    };

    const triggerGiftOpen = () => {
      setIsOpen(true);
      
      // Confetti Burst Gold & Pink
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F4C2C2', '#FFF8E7', '#E6C280']
      });
    };

    container.addEventListener('click', onClick);

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow bobbing
      if (!isOpen) {
        giftGroup.rotation.y += 0.008;
        giftGroup.position.y = Math.sin(Date.now() * 0.002) * 0.15;
      } else {
        // Open lid animation
        lidGroup.position.y = THREE.MathUtils.lerp(lidGroup.position.y, 2.5, 0.08);
        lidGroup.position.z = THREE.MathUtils.lerp(lidGroup.position.z, -1.5, 0.08);
        lidGroup.rotation.x = THREE.MathUtils.lerp(lidGroup.rotation.x, -Math.PI / 3, 0.08);
        giftGroup.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      boxGeo.dispose();
      boxMat.dispose();
      ribbonMat.dispose();
    };
  }, [isOpen]);

  // Word by word message reveal animation
  const messageWords = closingMessage.split(" ");

  const toggleVoiceNote = () => {
    if (!audioRef.current) return;
    if (isPlayingVoice) {
      audioRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingVoice(true)).catch(e => console.log(e));
    }
  };

  return (
    <section className="relative w-full min-h-screen py-24 px-6 bg-[#0A0A12] flex flex-col items-center justify-center overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-[#0A0A12]/90 to-[#0A0A12] pointer-events-none" />

      {/* Closing Message Word by Word */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#0A0A12]/80 mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
            The Final Revelation
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-[#F5F5F0] leading-tight flex justify-center flex-wrap gap-x-3 gap-y-1">
          {messageWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="inline-block gold-glow-text text-transparent bg-clip-text bg-gradient-to-b from-[#FFF8E7] via-[#D4AF37] to-[#C5A028]"
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* 3D Gift Box Canvas Area */}
      <div className="relative w-full max-w-xl h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-[#D4AF37]/30 bg-[#0A0A12]/50 backdrop-blur-md shadow-[0_0_60px_rgba(212,175,55,0.2)] flex flex-col items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-pointer" />

        {!isOpen && (
          <div className="absolute bottom-6 pointer-events-none flex flex-col items-center gap-1">
            <span className="text-xs font-inter uppercase tracking-[0.25em] text-[#D4AF37] animate-pulse">
              Tap the gift box to unlock
            </span>
            <Gift className="w-5 h-5 text-[#D4AF37] animate-bounce" />
          </div>
        )}
      </div>

      {/* Revealed Final Card + Audio Player */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", damping: 20 }}
            className="relative z-20 mt-10 w-full max-w-2xl p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141424] to-[#0A0A12] border border-[#D4AF37] shadow-[0_0_80px_rgba(212,175,55,0.3)] text-center"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/50 mb-6 text-[#D4AF37]">
              <Heart className="w-7 h-7 fill-[#D4AF37]/30" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-[#FFF8E7] mb-4">
              Happy Birthday, Akshita!
            </h3>

            {/* <!-- PERSONALIZE: closing message --> */}
            <p className="font-cormorant italic text-lg sm:text-2xl text-[#F4C2C2] leading-relaxed mb-8">
              "Every day spent with you is a gift in itself. Here's to 19 days of surprises, a lifetime of love, and endless memories ahead."
            </p>

            {/* Hidden Voice Note Audio */}
            <audio
              ref={audioRef}
              src={voiceNoteUrl}
              onEnded={() => setIsPlayingVoice(false)}
            />

            {/* Final Voice Note Button */}
            <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] font-inter text-[#D4AF37]">
                Listen to the special voice note once more
              </span>

              <button
                onClick={toggleVoiceNote}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A0A12] font-inter text-xs tracking-widest uppercase font-semibold hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                {isPlayingVoice ? (
                  <>
                    <Pause className="w-4 h-4 fill-[#0A0A12]" /> Pause Voice Note
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-[#0A0A12]" /> Play Voice Note
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
