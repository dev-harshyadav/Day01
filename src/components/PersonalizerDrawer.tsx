import React, { useState } from 'react';
import { PersonalizationConfig } from '../types';
import { Edit3, Sparkles, Image, Music, Heart, Save, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PersonalizerDrawerProps {
  config: PersonalizationConfig;
  onUpdate: (newConfig: PersonalizationConfig) => void;
  onReset: () => void;
}

export const PersonalizerDrawer: React.FC<PersonalizerDrawerProps> = ({
  config,
  onUpdate,
  onReset
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PersonalizationConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'memories' | 'photos'>('general');

  const handleSave = () => {
    onUpdate(formData);
    setIsOpen(false);
  };

  const handleMemoryChange = (index: number, field: 'title' | 'text', val: string) => {
    const updated = [...formData.memories];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, memories: updated });
  };

  const handlePhotoChange = (index: number, field: 'url' | 'title' | 'caption', val: string) => {
    const updated = [...formData.photos];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, photos: updated });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-[#141424]/90 border border-[#D4AF37] text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] backdrop-blur-md hover:bg-[#D4AF37] hover:text-[#0A0A12] transition-all duration-300 font-inter text-xs tracking-widest uppercase font-semibold cursor-pointer active:scale-95"
      >
        <Edit3 className="w-4 h-4" />
        <span>Personalize Content</span>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-[#0A0A12]/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-xl h-full bg-[#141424] border-l border-[#D4AF37]/40 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/20 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-playfair font-bold text-[#FFF8E7]">
                        Personalization Studio
                      </h2>
                      <p className="text-xs font-inter text-[#F4C2C2]/70">
                        Easily edit text, notes, voice links, and photo URLs.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full text-[#F5F5F0]/60 hover:text-[#D4AF37] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 p-1 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/20 mb-6">
                  <button
                    onClick={() => setActiveTab('general')}
                    className={`flex-1 py-2 rounded-lg text-xs font-inter uppercase tracking-wider transition-all ${
                      activeTab === 'general'
                        ? 'bg-[#D4AF37] text-[#0A0A12] font-semibold'
                        : 'text-[#F5F5F0]/70 hover:text-[#FFF8E7]'
                    }`}
                  >
                    General
                  </button>
                  <button
                    onClick={() => setActiveTab('memories')}
                    className={`flex-1 py-2 rounded-lg text-xs font-inter uppercase tracking-wider transition-all ${
                      activeTab === 'memories'
                        ? 'bg-[#D4AF37] text-[#0A0A12] font-semibold'
                        : 'text-[#F5F5F0]/70 hover:text-[#FFF8E7]'
                    }`}
                  >
                    Memories ({formData.memories.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('photos')}
                    className={`flex-1 py-2 rounded-lg text-xs font-inter uppercase tracking-wider transition-all ${
                      activeTab === 'photos'
                        ? 'bg-[#D4AF37] text-[#0A0A12] font-semibold'
                        : 'text-[#F5F5F0]/70 hover:text-[#FFF8E7]'
                    }`}
                  >
                    Photos ({formData.photos.length})
                  </button>
                </div>

                {/* Form Fields - General */}
                {activeTab === 'general' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-inter uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Title / Name
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/30 text-[#FFF8E7] text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-inter uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/30 text-[#FFF8E7] text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-inter uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Handwritten Note (Scene 3)
                      </label>
                      <textarea
                        rows={5}
                        value={formData.personalNote}
                        onChange={(e) => setFormData({ ...formData, personalNote: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/30 text-[#FFF8E7] text-sm focus:border-[#D4AF37] outline-none font-dancing text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-inter uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Voice Note MP3 Audio URL
                      </label>
                      <input
                        type="text"
                        value={formData.voiceNoteUrl}
                        onChange={(e) => setFormData({ ...formData, voiceNoteUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs font-mono focus:border-[#D4AF37] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-inter uppercase tracking-wider text-[#D4AF37] mb-1.5">
                        Closing Message (Scene 6)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.closingMessage}
                        onChange={(e) => setFormData({ ...formData, closingMessage: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A12] border border-[#D4AF37]/30 text-[#FFF8E7] text-sm focus:border-[#D4AF37] outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields - Memory Cubes */}
                {activeTab === 'memories' && (
                  <div className="space-y-6">
                    {formData.memories.map((mem, idx) => (
                      <div key={mem.id} className="p-4 rounded-2xl bg-[#0A0A12] border border-[#D4AF37]/20 space-y-3">
                        <span className="text-xs font-inter text-[#D4AF37] uppercase tracking-wider font-semibold">
                          Memory Cube #{idx + 1}
                        </span>
                        <div>
                          <label className="block text-[11px] font-inter text-[#F4C2C2]/70 uppercase">Label</label>
                          <input
                            type="text"
                            value={mem.title}
                            onChange={(e) => handleMemoryChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141424] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-inter text-[#F4C2C2]/70 uppercase">Memory Text</label>
                          <textarea
                            rows={2}
                            value={mem.text}
                            onChange={(e) => handleMemoryChange(idx, 'text', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141424] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Fields - Photo Ring */}
                {activeTab === 'photos' && (
                  <div className="space-y-6">
                    {formData.photos.map((photo, idx) => (
                      <div key={photo.id} className="p-4 rounded-2xl bg-[#0A0A12] border border-[#D4AF37]/20 space-y-3">
                        <span className="text-xs font-inter text-[#D4AF37] uppercase tracking-wider font-semibold">
                          Gallery Photo #{idx + 1}
                        </span>
                        <div>
                          <label className="block text-[11px] font-inter text-[#F4C2C2]/70 uppercase">Image URL</label>
                          <input
                            type="text"
                            value={photo.url}
                            onChange={(e) => handlePhotoChange(idx, 'url', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141424] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-inter text-[#F4C2C2]/70 uppercase">Title</label>
                          <input
                            type="text"
                            value={photo.title}
                            onChange={(e) => handlePhotoChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141424] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-inter text-[#F4C2C2]/70 uppercase">Caption</label>
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => handlePhotoChange(idx, 'caption', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#141424] border border-[#D4AF37]/30 text-[#FFF8E7] text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-[#D4AF37]/20 flex items-center justify-between gap-4 mt-8">
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-inter uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>

                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A0A12] text-xs font-inter uppercase tracking-wider font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
