import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '../types';
import { GRID_SIZE, CELL_SIZE, CANVAS_SIZE, INITIAL_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const dirRef = useRef<Point>({ x: 0, y: -1 });
  const nextDirRef = useRef<Point>({ x: 0, y: -1 });
  const speedRef = useRef(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    dirRef.current = { x: 0, y: -1 };
    nextDirRef.current = { x: 0, y: -1 };
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    speedRef.current = INITIAL_SPEED;
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted || isPaused || gameOver) return;

      const currentDir = dirRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) nextDirRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, gameOver]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        dirRef.current = nextDirRef.current;
        const head = prevSnake[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
          if (speedRef.current > 50) {
            speedRef.current -= 2;
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, speedRef.current);
    return () => clearInterval(intervalId);
  }, [hasStarted, isPaused, gameOver, food, score, onScoreChange, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Harsh black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Raw Grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw Food (Solid Magenta Block)
    ctx.fillStyle = '#f0f';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    // Inner detail for food
    ctx.fillStyle = '#fff';
    ctx.fillRect(food.x * CELL_SIZE + 6, food.y * CELL_SIZE + 6, CELL_SIZE - 12, CELL_SIZE - 12);

    // Draw Snake (Solid Cyan Blocks)
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#fff' : '#0ff';
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      
      // Black border to separate segments harshly
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center w-full max-w-[440px]">
      <div className="w-full flex justify-between items-end mb-2 px-1">
        <span className="text-neon-cyan text-xl tracking-widest">SEC_01</span>
        <span className="text-neon-magenta text-xl tracking-widest animate-pulse">REC</span>
      </div>
      
      <div className="relative p-4 bg-neon-panel border-glitch-alt w-full">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black border-2 border-[#333] w-full h-auto aspect-square"
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Overlays */}
        {(!hasStarted || gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 border-4 border-black m-4">
            {!hasStarted && !gameOver && (
              <button 
                onClick={resetGame}
                className="px-8 py-4 bg-neon-cyan text-black text-2xl font-bold hover:bg-white hover:text-black transition-none uppercase tracking-widest border-4 border-transparent hover:border-neon-magenta"
              >
                &gt; INITIATE_SEQ
              </button>
            )}
            
            {isPaused && !gameOver && hasStarted && (
              <div className="text-center border-2 border-neon-cyan p-6 bg-black">
                <h2 className="text-4xl font-bold text-neon-cyan mb-4 tracking-widest glitch" data-text="SUSPENDED">SUSPENDED</h2>
                <p className="text-white text-xl animate-pulse">AWAITING_INPUT [SPACE]</p>
              </div>
            )}

            {gameOver && (
              <div className="text-center flex flex-col items-center border-2 border-neon-magenta p-8 bg-black w-full max-w-[80%]">
                <h2 className="text-5xl font-bold text-neon-magenta mb-4 tracking-widest glitch" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-white mb-8 text-2xl">CODE: 0xCOLLISION</p>
                <button 
                  onClick={resetGame}
                  className="px-8 py-4 bg-neon-magenta text-black text-2xl font-bold hover:bg-white hover:text-black transition-none uppercase tracking-widest border-4 border-transparent hover:border-neon-cyan w-full"
                >
                  &gt; REBOOT_SYS
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 w-full border-t-2 border-[#333] pt-4 flex justify-between text-xl">
        <span className="text-neon-cyan">INPUT: [W,A,S,D]</span>
        <span className="text-neon-magenta">HALT: [SPACE]</span>
      </div>
    </div>
  );
};
