import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Ambient Journey", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Calm Serenity", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Morning Vibes", artist: "SoundHelix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback error:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-purple-100/50 p-8 border border-white flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl shadow-inner">
          <Music size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Music Box</h2>
          <p className="text-base text-slate-500 font-medium mt-0.5">Relaxing background tunes</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Track Info */}
      <div className="mb-8 text-center p-6 bg-slate-50/80 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        {/* Animated gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-100/30 to-purple-100/30 transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-0'}`} />
        
        <h3 className="text-xl font-bold text-slate-800 mb-1.5 truncate relative z-10">
          {currentTrack.title}
        </h3>
        <p className="text-base text-slate-500 font-semibold truncate relative z-10">
          {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-8 relative group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all focus:outline-none focus:ring-4 focus:ring-purple-100"
          style={{
            background: `linear-gradient(to right, #a855f7 ${progress}%, #e2e8f0 ${progress}%)`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrev}
            className="p-4 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 rounded-2xl transition-all"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-5 text-white rounded-2xl active:scale-95 transition-all shadow-lg ${
              isPlaying 
                ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-200' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-4 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 rounded-2xl transition-all"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
        
        <div className="w-[52px]" /> {/* Visual Balance placeholder for Volume button */}
      </div>
    </div>
  );
}
