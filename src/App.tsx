import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-800 font-sans selection:bg-indigo-200 relative overflow-hidden">
      
      {/* Soft Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 mix-blend-multiply blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/40 mix-blend-multiply blur-3xl pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col">
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner border border-indigo-50">
              <Gamepad2 size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 pb-1">
                Snake Game Lala
              </h1>
              <p className="text-slate-500 font-medium text-lg mt-1">
                Relax and play a soft, smooth snake game.
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">High Score</span>
            <span className="text-4xl font-black text-indigo-600">
              {highScore}
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 relative z-20">
          <div className="flex-1 w-full max-w-xl flex justify-center">
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
          <div className="w-full lg:w-96 flex justify-center lg:justify-end">
            <MusicPlayer />
          </div>
        </main>
      </div>
    </div>
  );
}
