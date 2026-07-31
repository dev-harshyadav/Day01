/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_CONFIG } from './data';
import { PersonalizationConfig } from './types';
import { ProgressBar } from './components/ProgressBar';
import { Scene1Invitation } from './components/Scene1Invitation';
import { Scene2MemoryCubes } from './components/Scene2MemoryCubes';
import { Scene3ScrollConstellation } from './components/Scene3ScrollConstellation';
import { Scene4PhotoRing } from './components/Scene4PhotoRing';
import { Scene5MusicVoice } from './components/Scene5MusicVoice';
import { Scene6FinalGift } from './components/Scene6FinalGift';
import { PersonalizerDrawer } from './components/PersonalizerDrawer';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<PersonalizationConfig>(() => {
    const saved = localStorage.getItem('for_akshita_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CONFIG;
      }
    }
    return INITIAL_CONFIG;
  });

  const handleUpdateConfig = (newConfig: PersonalizationConfig) => {
    setConfig(newConfig);
    localStorage.setItem('for_akshita_config', JSON.stringify(newConfig));
  };

  const handleResetConfig = () => {
    setConfig(INITIAL_CONFIG);
    localStorage.removeItem('for_akshita_config');
  };

  const handleScrollToNext = () => {
    const scene2 = document.getElementById('scene-2');
    if (scene2) {
      scene2.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A12] text-[#F5F5F0] overflow-x-hidden font-inter selection:bg-[#D4AF37] selection:text-[#0A0A12]">
      {/* Top Gold Scroll Progress Bar */}
      <ProgressBar />

      {/* SCENE 1 — The Invitation */}
      <div id="scene-1">
        <Scene1Invitation
          title={config.title}
          subtitle={config.subtitle}
          onExplore={handleScrollToNext}
        />
      </div>

      {/* SCENE 2 — Memory Cubes */}
      <div id="scene-2" className="pt-8">
        <Scene2MemoryCubes memories={config.memories} />
      </div>

      {/* SCENE 3 — Scroll Constellation */}
      <div id="scene-3">
        <Scene3ScrollConstellation personalNote={config.personalNote} />
      </div>

      {/* SCENE 4 — Photo Gallery Ring */}
      <div id="scene-4">
        <Scene4PhotoRing photos={config.photos} />
      </div>

      {/* SCENE 5 — Music & Voice */}
      <div id="scene-5">
        <Scene5MusicVoice voiceNoteUrl={config.voiceNoteUrl} />
      </div>

      {/* SCENE 6 — Final Gift Box */}
      <div id="scene-6">
        <Scene6FinalGift
          closingMessage={config.closingMessage}
          voiceNoteUrl={config.voiceNoteUrl}
        />
      </div>

      {/* Footer Branding */}
      <footer className="w-full py-12 px-6 bg-[#0A0A12] border-t border-[#D4AF37]/20 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-[#D4AF37]">
            <Heart className="w-4 h-4 fill-[#D4AF37]" />
            <span className="font-playfair text-lg tracking-widest uppercase">For Akshita</span>
            <Heart className="w-4 h-4 fill-[#D4AF37]" />
          </div>
          <p className="text-xs font-inter text-[#F4C2C2]/60 tracking-wider">
            Crafted with Three.js, GSAP & Endless Love • {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Live Customizer Drawer */}
      <PersonalizerDrawer
        config={config}
        onUpdate={handleUpdateConfig}
        onReset={handleResetConfig}
      />
    </div>
  );
}

