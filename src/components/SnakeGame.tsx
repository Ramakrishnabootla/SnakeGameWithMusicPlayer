import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

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
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  }, [onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          e.preventDefault();
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown': case 's': case 'S':
          e.preventDefault();
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft': case 'a': case 'A':
          e.preventDefault();
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight': case 'd': case 'D':
          e.preventDefault();
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

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
          setScore(s => {
            const newScore = s + 10;
            onScoreChange(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(30, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, isGameOver, isPaused, score, onScoreChange]);

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 bg-black border-4 border-magenta-glitch relative">
      
      {/* Header / Score */}
      <div className="w-full flex justify-between items-end mb-4 border-b-4 border-cyan-glitch pb-2">
        <div className="flex flex-col">
          <span className="text-magenta-glitch text-xl uppercase tracking-widest">CYCLES_</span>
          <span className="text-cyan-glitch text-5xl glitch" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="text-2xl text-magenta-glitch uppercase tracking-widest animate-pulse">
          {isPaused && !isGameOver ? 'HALTED' : 'EXEC_ACTIVE'}
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="relative bg-black border-4 border-cyan-glitch overflow-hidden"
        style={{
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
             style={{
               backgroundImage: `linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)`,
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }} />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-magenta-glitch z-10' : 'bg-cyan-glitch opacity-80'}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: '1px'
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-magenta-glitch animate-ping"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '2px'
          }}
        />

        {/* Overlays */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-magenta-glitch m-4">
            {isGameOver ? (
              <div className="text-center">
                <h2 className="text-5xl font-black text-magenta-glitch glitch mb-4" data-text="FATAL_ERROR">
                  FATAL_ERROR
                </h2>
                <p className="text-cyan-glitch text-3xl mb-8 glitch" data-text={`CYCLES: ${score}`}>
                  CYCLES: {score}
                </p>
                <button
                  onClick={resetGame}
                  className="px-8 py-4 bg-cyan-glitch text-black text-3xl font-bold uppercase hover:bg-magenta-glitch hover:text-white transition-colors"
                >
                  [ REBOOT ]
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPaused(false)}
                className="px-8 py-4 bg-magenta-glitch text-black text-3xl font-bold uppercase hover:bg-cyan-glitch hover:text-black transition-colors"
              >
                [ EXECUTE ]
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="mt-6 text-center text-cyan-glitch text-xl uppercase tracking-widest border-t-2 border-magenta-glitch pt-4 w-full">
        <p>{'>'} INPUT: W,A,S,D / ARROWS</p>
        <p>{'>'} INTERRUPT: SPACE</p>
      </div>
    </div>
  );
}
