import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01.WAV", artist: "SYS.OP" },
  { id: 2, title: "CORRUPTED_SECTOR.MP3", artist: "UNKNOWN_ENTITY" },
  { id: 3, title: "NEURAL_LINK_ESTABLISHED", artist: "MAINFRAME" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  const AUDIO_URLS = [
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=synthwave-80s-110045.mp3",
    "https://cdn.pixabay.com/download/audio/2022/10/25/audio_4f9d22f026.mp3?filename=cyberpunk-2099-10701.mp3",
    "https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b3cb81ea.mp3?filename=retrowave-103673.mp3"
  ];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
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
    <div className="w-full max-w-md bg-black border-4 border-cyan-glitch p-6 relative group">
      <audio
        ref={audioRef}
        src={AUDIO_URLS[currentTrackIndex]}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="relative z-10 flex flex-col">
        <div className="border-b-4 border-magenta-glitch pb-2 mb-6 flex justify-between items-end">
          <h2 className="text-3xl text-cyan-glitch uppercase tracking-widest glitch" data-text="AUDIO_SUBSYSTEM">
            AUDIO_SUBSYSTEM
          </h2>
          <span className="text-magenta-glitch text-xl animate-pulse">
            {isPlaying ? '[ ACTIVE ]' : '[ IDLE ]'}
          </span>
        </div>

        {/* Track Info */}
        <div className="mb-6 border-2 border-cyan-glitch p-4 bg-cyan-glitch/10">
          <h3 className="text-2xl text-magenta-glitch mb-1 truncate uppercase">
            {'>'} {currentTrack.title}
          </h3>
          <p className="text-xl text-cyan-glitch tracking-widest truncate uppercase">
            SRC: {currentTrack.artist}
          </p>
        </div>

        {/* Visualizer Mock */}
        <div className="h-16 border-2 border-magenta-glitch mb-6 flex items-end justify-between p-2 gap-1 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-full ${isPlaying ? 'bg-cyan-glitch' : 'bg-cyan-glitch/20'}`}
              style={{ 
                height: isPlaying ? `${Math.random() * 100}%` : '10%',
                transition: 'height 0.1s ease'
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6 relative">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-4 bg-black border-2 border-cyan-glitch appearance-none cursor-pointer accent-magenta-glitch"
            style={{
              background: `linear-gradient(to right, #f0f ${progress}%, #000 ${progress}%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full border-t-2 border-cyan-glitch pt-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-2xl text-cyan-glitch hover:text-magenta-glitch hover:bg-cyan-glitch/20 px-2 py-1 border-2 border-transparent hover:border-magenta-glitch transition-colors"
          >
            {isMuted ? '[ MUTED ]' : '[ VOL_ON ]'}
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              className="text-2xl text-cyan-glitch hover:bg-magenta-glitch hover:text-black px-4 py-2 border-2 border-cyan-glitch transition-colors"
            >
              {'<<'}
            </button>
            
            <button 
              onClick={togglePlay}
              className="text-2xl text-black bg-cyan-glitch hover:bg-magenta-glitch px-6 py-2 border-2 border-cyan-glitch transition-colors"
            >
              {isPlaying ? '||' : '>'}
            </button>
            
            <button 
              onClick={handleNext}
              className="text-2xl text-cyan-glitch hover:bg-magenta-glitch hover:text-black px-4 py-2 border-2 border-cyan-glitch transition-colors"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
