import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

type SpeedMode = 'slow' | 'medium' | 'fast';
const SPEED_MAP: Record<SpeedMode, number> = {
  slow: 150,
  medium: 100,
  fast: 60,
};

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
};

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('medium');
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setIsStarted(true);
    setScore(0);
  }, []);

  useEffect(() => {
    onScoreChange(score);
  }, [score, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver) return;
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown': case 's': case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft': case 'a': case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight': case 'd': case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isStarted) {
             setIsPaused(prev => !prev);
          } else {
             startGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isStarted, startGame]);

  useEffect(() => {
    if (!isStarted || isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED_MAP[speedMode]);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, isStarted, speedMode, onScoreChange]);

  return (
    <div className="w-full flex flex-col items-center bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-indigo-100/50 p-8 border border-white">
      
      {/* Header / Score */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Score</span>
          <span className="text-4xl font-black text-indigo-600">
            {score}
          </span>
        </div>
        
        {/* Speed Controls */}
        <div className="flex bg-slate-100/80 backdrop-blur-sm rounded-2xl p-1.5 shadow-inner border border-slate-200/50">
          {(['slow', 'medium', 'fast'] as SpeedMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                 setSpeedMode(mode);
                 if (isStarted && !isPaused && !isGameOver) {
                    // Changing speed while playing seamlessly applies on next interval thanks to effect dependencies
                 }
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                speedMode === mode 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="relative bg-indigo-50/50 rounded-3xl overflow-hidden shadow-inner border-2 border-indigo-100"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Soft Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
             style={{
               backgroundImage: `linear-gradient(to right, #c7d2fe 1px, transparent 1px), linear-gradient(to bottom, #c7d2fe 1px, transparent 1px)`,
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }} />

        {/* Snake flex-1 max-w-sm or similar applied up tree */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-indigo-600 z-10 scale-[1.15] rounded-md shadow-md' : 'bg-indigo-400 scale-[0.95] rounded'} transition-all`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 scale-[0.8] animate-pulse"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        {(!isStarted || isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[4px] flex flex-col items-center justify-center z-20 transition-all duration-300">
            {isGameOver ? (
              <div className="text-center p-8 bg-white/90 rounded-3xl shadow-2xl border border-white shadow-indigo-100 mx-4 transform scale-100 animate-in zoom-in-95">
                <h2 className="text-3xl font-black text-slate-800 mb-2">
                  Game Over
                </h2>
                <p className="text-slate-500 mb-8 text-lg">
                  You scored <span className="font-bold text-indigo-600 text-xl">{score}</span> points!
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center justify-center w-full gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                >
                  <RotateCcw size={20} className="stroke-[3]" />
                  Restart
                </button>
              </div>
            ) : !isStarted ? (
              <button
                onClick={startGame}
                className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-3xl font-bold text-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-200 ring-4 ring-indigo-600/20"
              >
                <Play size={28} fill="currentColor" />
                Play
              </button>
            ) : (
                <button
                onClick={() => setIsPaused(false)}
                className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-3xl font-bold text-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-200 ring-4 ring-indigo-600/20"
              >
                <Play size={28} fill="currentColor" />
                Resume
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="mt-8 text-center text-slate-500 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 w-full">
        <p className="font-bold text-slate-700 mb-1">Use W,A,S,D or Arrows to steer</p>
        <p className="text-sm font-medium">Press Space to Pause/Resume</p>
      </div>
    </div>
  );
}
