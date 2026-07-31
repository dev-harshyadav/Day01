import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MemoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Heart } from 'lucide-react';

interface Scene2Props {
  memories: MemoryItem[];
}

export const Scene2MemoryCubes: React.FC<Scene2Props> = ({ memories }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [hoveredCubeIndex, setHoveredCubeIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A12, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights: Warm gold key light + Cool pink rim light
    const goldLight = new THREE.DirectionalLight(0xD4AF37, 2.5);
    goldLight.position.set(5, 5, 8);
    scene.add(goldLight);

    const pinkLight = new THREE.DirectionalLight(0xF4C2C2, 2.0);
    pinkLight.position.set(-6, -4, -5);
    scene.add(pinkLight);

    const ambientLight = new THREE.AmbientLight(0x221122, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 1.5, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Create 6-8 Translucent Glass Cubes
    const cubesGroup = new THREE.Group();
    scene.add(cubesGroup);

    const cubeMeshes: THREE.Mesh[] = [];
    const basePositions = [
      new THREE.Vector3(-6, 3, 0),
      new THREE.Vector3(0, 3.5, -2),
      new THREE.Vector3(6, 2.5, 1),
      new THREE.Vector3(-5, -2.5, -1),
      new THREE.Vector3(1, -3, 0),
      new THREE.Vector3(6, -2, -2)
    ];

    memories.forEach((mem, index) => {
      const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
      
      // Translucent physical glass material
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x1a1226,
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.9, // glass transmission
        thickness: 1.2,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        attenuationColor: new THREE.Color(0xD4AF37),
        attenuationDistance: 2.5,
        transparent: true,
        opacity: 0.85
      });

      const cube = new THREE.Mesh(geometry, material);
      const pos = basePositions[index % basePositions.length];
      cube.position.copy(pos);
      cube.userData = { 
        index, 
        memory: mem, 
        basePos: pos.clone(),
        rotSpeedX: 0.005 + index * 0.001,
        rotSpeedY: 0.007 + index * 0.0008,
        sineOffset: index * 1.1
      };

      // Add a subtle inner glowing core mesh inside each cube
      const innerGeo = new THREE.OctahedronGeometry(0.8, 0);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        emissive: 0xD4AF37,
        emissiveIntensity: 0.6,
        wireframe: true
      });
      const innerCore = new THREE.Mesh(innerGeo, innerMat);
      cube.add(innerCore);

      cubeMeshes.push(cube);
      cubesGroup.add(cube);
    });

    // Raycaster for hover/click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubeMeshes);

      if (intersects.length > 0) {
        const clickedCube = intersects[0].object as THREE.Mesh;
        const memory = clickedCube.userData.memory as MemoryItem;
        setSelectedMemory(memory);
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // Mobile gyroscope orientation support
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        mouseX = (e.gamma / 45) * 2;
        mouseY = (e.beta / 45) * 2;
      }
    };
    window.addEventListener('deviceorientation', handleDeviceOrientation);

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

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax
      camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Raycast hover check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(cubeMeshes);

      if (intersects.length > 0) {
        const hitIndex = intersects[0].object.userData.index;
        setHoveredCubeIndex(hitIndex);
        container.style.cursor = 'pointer';
      } else {
        setHoveredCubeIndex(null);
        container.style.cursor = 'default';
      }

      // Animate cubes with sine bobbing & rotation
      cubeMeshes.forEach((cube) => {
        const u = cube.userData;
        
        // Idle gentle float
        cube.rotation.x += u.rotSpeedX;
        cube.rotation.y += u.rotSpeedY;

        const floatY = Math.sin(elapsedTime * 1.5 + u.sineOffset) * 0.4;
        const floatX = Math.cos(elapsedTime * 1.2 + u.sineOffset) * 0.2;
        cube.position.y = u.basePos.y + floatY;
        cube.position.x = u.basePos.x + floatX;

        // Hover scale up and bloom glow
        const isHovered = hoveredCubeIndex === u.index;
        const targetScale = isHovered ? 1.35 : 1.0;
        cube.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        const mat = cube.material as THREE.MeshPhysicalMaterial;
        if (isHovered) {
          mat.emissive = new THREE.Color(0xD4AF37);
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.4, 0.1);
        } else {
          mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.0, 0.1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      cubeMeshes.forEach((c) => {
        c.geometry.dispose();
        (c.material as THREE.Material).dispose();
      });
    };
  }, [memories, hoveredCubeIndex]);

  return (
    <section className="relative w-full min-h-screen py-20 px-6 flex flex-col items-center justify-center bg-[#0A0A12] overflow-hidden">
      {/* Background Gradient Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 to-[#F4C2C2]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#0A0A12]/80 mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Interactive Memory Cubes
          </span>
        </motion.div>
        
        <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#F5F5F0] mb-3">
          Moments Etched in Glass
        </h2>
        <p className="text-sm sm:text-base font-inter text-[#F4C2C2]/80 tracking-wide">
          Hover or tap any floating crystal cube to unlock a precious memory.
        </p>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full max-w-6xl h-[550px] sm:h-[650px] rounded-3xl overflow-hidden border border-[#D4AF37]/20 bg-[#0A0A12]/40 backdrop-blur-sm shadow-[0_0_50px_rgba(10,10,18,0.8)]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Memory Labels overlay for quick interaction */}
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-wrap justify-between items-center opacity-80">
          {memories.map((mem, index) => {
            const isHovered = hoveredCubeIndex === index;
            return (
              <div 
                key={mem.id}
                className={`transition-all duration-300 transform ${
                  isHovered ? 'scale-110 text-[#D4AF37]' : 'text-[#F5F5F0]/70'
                }`}
              >
                <div className="hidden md:block px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 bg-[#0A0A12]/80 backdrop-blur-md text-xs font-cormorant tracking-widest uppercase">
                  {mem.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Memory Modal Dialog */}
      <AnimatePresence>
        {selectedMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A12]/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#141424] to-[#0A0A12] border border-[#D4AF37]/50 shadow-[0_0_60px_rgba(212,175,55,0.25)] text-center"
            >
              <button
                onClick={() => setSelectedMemory(null)}
                className="absolute top-5 right-5 p-2 rounded-full text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 mb-6 text-[#D4AF37]">
                <Heart className="w-6 h-6 fill-[#D4AF37]/20" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-playfair font-bold text-[#FFF8E7] mb-4">
                {selectedMemory.title}
              </h3>

              {/* Memory Text Content */}
              <div className="relative py-4 px-2">
                <p className="text-base sm:text-lg font-cormorant italic text-[#F4C2C2] leading-relaxed">
                  "{selectedMemory.text}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D4AF37]/20 flex justify-center items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] font-inter text-[#D4AF37]/80">
                  Memory Gift #{memories.findIndex(m => m.id === selectedMemory.id) + 1}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
