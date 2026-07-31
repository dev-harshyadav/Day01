import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GalleryPhoto } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Pause, Play, Eye, X } from 'lucide-react';

interface Scene4Props {
  photos: GalleryPhoto[];
}

export const Scene4PhotoRing: React.FC<Scene4Props> = ({ photos }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A12, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xD4AF37, 1.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Orbiting Ring Group
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const radius = 6.5;
    const textureLoader = new THREE.TextureLoader();
    const photoMeshes: THREE.Mesh[] = [];

    photos.forEach((photo, index) => {
      const angle = (index / photos.length) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Plane geometry for photo frame
      const geometry = new THREE.PlaneGeometry(3.2, 2.2);

      // Load texture with fallback color material
      const texture = textureLoader.load(
        photo.url,
        undefined,
        undefined,
        () => console.log('Texture load fallback for photo', photo.id)
      );

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.1
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0, z);

      // Face outward from center of ring
      mesh.lookAt(0, 0, 0);
      mesh.rotation.y += Math.PI; // flip to face camera outward

      // Add a thin gold metallic frame border around each photo plane
      const frameGeo = new THREE.BoxGeometry(3.35, 2.35, 0.05);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.8,
        roughness: 0.2
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      frameMesh.position.z = -0.03;
      mesh.add(frameMesh);

      mesh.userData = { index, photo, angle, radius };
      photoMeshes.push(mesh);
      ringGroup.add(mesh);
    });

    // Raycaster for hover/tap interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(photoMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const photoData = clickedMesh.userData.photo as GalleryPhoto;
        setActivePhoto(photoData);
      }
    };

    container.addEventListener('mousemove', onPointerMove);
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

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotate ring if not paused
      if (!isPaused && !activePhoto) {
        ringGroup.rotation.y += 0.003;
      }

      // Check intersections
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(photoMeshes);

      if (intersects.length > 0) {
        container.style.cursor = 'pointer';
      } else {
        container.style.cursor = 'default';
      }

      // Depth blur simulation by scaling/opacity according to Z position
      photoMeshes.forEach((mesh) => {
        // Calculate world position
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);

        // Distance to camera front
        const dist = camera.position.distanceTo(worldPos);
        const isClosest = dist < 12;

        const targetScale = isClosest ? 1.1 : 0.85;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = isClosest ? 1.0 : 0.55;
        mat.transparent = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      photoMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    };
  }, [photos, isPaused, activePhoto]);

  return (
    <section className="relative w-full min-h-screen py-24 px-6 bg-[#0A0A12] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#0A0A12]/80 mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            3D Photo Ring Gallery
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#F5F5F0] mb-2">
          Capturing Forever
        </h2>
        <p className="text-sm sm:text-base font-inter text-[#F4C2C2]/80">
          Orbiting like a vinyl record of our sweetest frames. Tap any photo to enlarge.
        </p>
      </div>

      {/* Orbit Controls Bar */}
      <div className="relative z-10 mb-4 flex items-center gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/40 bg-[#0A0A12]/80 text-xs font-inter uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A12] transition-colors cursor-pointer"
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5" /> Resume Orbit
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" /> Pause Orbit
            </>
          )}
        </button>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative w-full max-w-6xl h-[500px] sm:h-[600px] rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#0A0A12]/60 backdrop-blur-md shadow-[0_0_60px_rgba(10,10,18,0.9)]">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      {/* Lightbox Modal for Enlarged Photo */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A12]/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl rounded-3xl bg-[#141424] border border-[#D4AF37]/60 p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.3)] text-center overflow-hidden"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#0A0A12]/80 text-[#F5F5F0] hover:text-[#D4AF37] border border-[#D4AF37]/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Enlarged Photo Frame */}
              <div className="relative w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden mb-6 border border-[#D4AF37]/30 shadow-inner">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-playfair font-bold text-[#FFF8E7] mb-2">
                {activePhoto.title}
              </h3>

              <p className="font-cormorant italic text-lg sm:text-xl text-[#F4C2C2] max-w-lg mx-auto">
                "{activePhoto.caption}"
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
