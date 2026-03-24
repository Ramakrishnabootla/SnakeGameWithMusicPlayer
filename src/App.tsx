import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (score: number) => {
    if (score > highScore) setHighScore(score);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-glitch font-digital overflow-hidden relative selection:bg-magenta-glitch selection:text-black scanlines">
      <div className="static-noise" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col screen-tear">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 border-b-4 border-magenta-glitch pb-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-widest uppercase text-cyan-glitch glitch" data-text="SYS.OP // SNAKE_PROTOCOL">
              SYS.OP // SNAKE_PROTOCOL
            </h1>
            <p className="text-magenta-glitch text-2xl tracking-widest uppercase mt-2 animate-pulse">
              {'>'} STATUS: ONLINE_
            </p>
          </div>

          <div className="px-6 py-4 border-4 border-cyan-glitch bg-black flex flex-col items-end gap-1">
            <span className="text-magenta-glitch text-xl uppercase tracking-widest">MAX_CYCLES</span>
            <span className="text-5xl text-cyan-glitch glitch" data-text={highScore.toString().padStart(4, '0')}>
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-12 lg:gap-24">
          <div className="flex-1 flex justify-center w-full max-w-2xl">
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <MusicPlayer />
          </div>
        </main>

        <footer className="mt-12 text-left border-t-4 border-cyan-glitch pt-4 text-magenta-glitch text-2xl tracking-widest uppercase">
          <p>{'>'} END_OF_LINE // V.1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
