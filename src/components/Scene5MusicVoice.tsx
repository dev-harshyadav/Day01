import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Music, Mic, Play, Pause, Volume2, Sparkles, Heart } from 'lucide-react';

interface Scene5Props {
  voiceNoteUrl: string;
}

export const Scene5MusicVoice: React.FC<Scene5Props> = ({ voiceNoteUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log('Audio play blocked:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="relative w-full min-h-screen py-24 px-6 bg-[#0A0A12] flex flex-col items-center justify-center overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D4AF37]/10 via-[#F4C2C2]/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D4AF37]/30 bg-[#0A0A12]/80 mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
            Melody & Voice
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-[#F5F5F0] mb-3">
          Our Soundtrack
        </h2>
        <p className="text-sm sm:text-base font-inter text-[#F4C2C2]/80">
          The song that reminds me of you, and a personal note spoken straight from the heart.
        </p>
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Spotify Card - Styled cleanly with gold border-glow */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-[#141424]/90 border border-[#D4AF37]/40 p-6 gold-border-glow shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-playfair font-semibold text-[#FFF8E7]">
                "Samjho Na" — Aditya Rikhari
              </h3>
              <p className="text-xs font-inter text-[#F4C2C2]/70 uppercase tracking-wider">
                Spotify Track
              </p>
            </div>
          </div>

          {/* Embedded Exact Spotify Player */}
          <div className="w-full rounded-xl overflow-hidden border border-[#D4AF37]/20 shadow-lg">
            <iframe
              data-testid="embed-iframe"
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/track/1d5lpW3gUyq537iuyrb9Lf?utm_source=generator"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Samjho Na Spotify Player"
            />
          </div>
        </motion.div>

        {/* Custom Audio Player for Personal Voice Note */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#141424] to-[#0A0A12] border border-[#D4AF37]/40 p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(244,194,194,0.1)]"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#F4C2C2]/10 border border-[#F4C2C2]/30 text-[#F4C2C2]">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-inter uppercase tracking-[0.2em] text-[#D4AF37]">
                  Audio Note
                </span>
                <h3 className="text-xl font-playfair font-semibold text-[#FFF8E7]">
                  "One more thing, in my own voice."
                </h3>
              </div>
            </div>

            <p className="font-cormorant italic text-base text-[#F4C2C2]/90 mb-8 leading-relaxed">
              Press play to hear a quiet message recorded especially for this moment.
            </p>

            {/* Hidden HTML5 Audio Element */}
            <audio
              ref={audioRef}
              src={voiceNoteUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            {/* Audio Visualizer Waves Simulation */}
            <div className="flex items-center justify-center gap-1.5 h-12 mb-6 px-4 py-2 rounded-xl bg-[#0A0A12]/80 border border-[#D4AF37]/20">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-gradient-to-t from-[#D4AF37] to-[#F4C2C2] transition-all duration-200 ${
                    isPlaying ? 'animate-pulse' : 'h-2 opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.sin(i * 0.8 + currentTime * 5) * 16 + 22}px` : '8px'
                  }}
                />
              ))}
            </div>

            {/* Progress Slider */}
            <div className="space-y-1 mb-6">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-[#0A0A12] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-xs font-inter text-[#F4C2C2]/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#D4AF37]/20">
            <button
              onClick={togglePlay}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-[#0A0A12] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-[#0A0A12]" />
              ) : (
                <Play className="w-6 h-6 fill-[#0A0A12] ml-0.5" />
              )}
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
