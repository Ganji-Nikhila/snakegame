import React, { useState } from 'react';
import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('neonSnakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('neonSnakeHighScore', newScore.toString());
    }
  };

  return (
    <div className="min-h-screen bg-neon-dark text-neon-cyan font-mono flex flex-col items-center py-8 px-4 relative z-10">
      
      {/* Header */}
      <header className="mb-12 text-center flex flex-col items-center w-full max-w-6xl border-b-4 border-neon-magenta pb-4">
        <div className="flex items-center gap-4 mb-2">
          <Terminal className="text-neon-magenta w-10 h-10 animate-pulse" strokeWidth={1.5} />
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest glitch" data-text="SYS.CORE_V1.0">
            SYS.CORE_V1.0
          </h1>
        </div>
        <div className="flex gap-4 text-xl tracking-widest bg-neon-magenta text-black px-4 py-1 font-bold">
          <span>[STATUS: ACTIVE_PROCESS]</span>
          <span>//</span>
          <span>MEM_ALLOC: OK</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Game */}
        <div className="lg:col-span-8 flex justify-center lg:justify-end">
          <SnakeGame onScoreChange={handleScoreChange} />
        </div>

        {/* Right Column: Stats & Music */}
        <div className="lg:col-span-4 flex flex-col gap-8 items-center lg:items-start w-full">
          
          {/* Score Board */}
          <div className="w-full bg-neon-panel border-glitch p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan animate-pulse"></div>
            
            <h2 className="text-neon-magenta text-2xl font-bold mb-4 tracking-widest border-b-2 border-neon-magenta/50 pb-2">
              &gt; DATA_STREAM
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-black p-4 border-2 border-neon-cyan flex justify-between items-center">
                <span className="text-neon-cyan text-lg tracking-widest">CURR_VAL:</span>
                <span className="text-4xl font-bold text-white">{score}</span>
              </div>
              <div className="bg-black p-4 border-2 border-neon-magenta flex justify-between items-center">
                <span className="text-neon-magenta text-lg tracking-widest">MAX_VAL:</span>
                <span className="text-4xl font-bold text-white">{highScore}</span>
              </div>
            </div>
          </div>

          {/* Music Player */}
          <MusicPlayer />
          
        </div>
      </main>
    </div>
  );
};

export default App;
