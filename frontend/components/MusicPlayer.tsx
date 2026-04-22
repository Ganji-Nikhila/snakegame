import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Autoplay prevented:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  return (
    <div className="bg-neon-panel border-glitch p-6 flex flex-col gap-6 w-full relative">
      <div className="absolute top-0 right-0 bg-neon-cyan text-black px-2 py-1 text-sm font-bold">
        AUDIO_MOD
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-start gap-4 z-10 mt-4">
        <div className="w-20 h-20 bg-black border-2 border-neon-magenta flex items-center justify-center relative overflow-hidden">
          <div className={`absolute inset-0 border-4 border-neon-cyan ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}></div>
          <Disc className="text-white w-10 h-10 z-10" strokeWidth={1} />
        </div>
        <div className="flex-1 overflow-hidden flex flex-col justify-center">
          <span className="text-neon-cyan text-sm mb-1">TRK_ID: {currentTrack.id}</span>
          <h3 className="text-white font-bold text-2xl truncate uppercase">
            {currentTrack.title}
          </h3>
          <p className="text-neon-magenta text-lg truncate uppercase">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Glitchy Progress Bar */}
      <div className="w-full h-6 bg-black border-2 border-[#333] relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '10px 100%' }}></div>
        <div 
          className="h-full bg-neon-cyan relative transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        >
           <div className="absolute right-0 top-0 bottom-0 w-2 bg-white animate-pulse"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between z-10 border-t-2 border-[#333] pt-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-neon-magenta transition-none p-2 border-2 border-transparent hover:border-neon-magenta bg-black"
          >
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-24 h-2 bg-black appearance-none border border-neon-cyan cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-neon-magenta"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={prevTrack}
            className="p-2 bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-none"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlay}
            className="p-3 bg-neon-magenta border-2 border-neon-magenta text-black hover:bg-white hover:border-white transition-none"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>
          <button 
            onClick={nextTrack}
            className="p-2 bg-black border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-none"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
