import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { createInitialDough } from './utils/doughPhysics';
import { calculateGameScore } from './utils/scoring';
import { soundManager } from './utils/audio';

import DoughCanvas from './components/DoughCanvas';
import HomeScreen from './components/HomeScreen';
import HUD from './components/HUD';
import ResultModal from './components/ResultModal';

const INITIAL_TIME = 30;

export default function App() {
  const [gameState, setGameState] = useState('HOME'); // 'HOME' | 'PLAYING' | 'RESULT'
  const [dough, setDough] = useState(() => createInitialDough(300, 300));
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [gameResult, setGameResult] = useState(null);
  const [isNewBest, setIsNewBest] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // LocalStorage stats
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('chappati_rush_stats');
      return saved ? JSON.parse(saved) : { bestScore: 0, bestTime: null, attempts: 0 };
    } catch (e) {
      return { bestScore: 0, bestTime: null, attempts: 0 };
    }
  });

  const timerRef = useRef(null);

  // Countdown timer loop during gameplay
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          if (prev <= 6) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleStartGame = () => {
    setDough(createInitialDough(300, 300));
    setTimeLeft(INITIAL_TIME);
    setGameResult(null);
    setIsNewBest(false);
    setGameState('PLAYING');
  };

  const handleResetDough = () => {
    setDough(createInitialDough(300, 300));
  };

  const handleAutoSubmit = () => {
    handleSubmitDough(0);
  };

  const handleSubmitDough = (overrideRemainingTime) => {
    const remaining = overrideRemainingTime !== undefined ? overrideRemainingTime : timeLeft;
    const completionTime = Math.max(0.5, INITIAL_TIME - remaining);
    
    const result = calculateGameScore(dough, completionTime);
    setGameResult(result);

    // Save statistics & check for new personal best
    const currentBest = stats.bestScore || 0;
    const newBest = result.totalScore > currentBest;
    setIsNewBest(newBest);

    const updatedStats = {
      bestScore: newBest ? result.totalScore : currentBest,
      bestTime: newBest 
        ? result.completionTimeSeconds 
        : (stats.bestTime ? Math.min(stats.bestTime, result.completionTimeSeconds) : result.completionTimeSeconds),
      attempts: (stats.attempts || 0) + 1
    };

    setStats(updatedStats);
    try {
      localStorage.setItem('chappati_rush_stats', JSON.stringify(updatedStats));
    } catch (e) {}

    setGameState('RESULT');
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="game-viewport">
      {/* Mute / Unmute Button */}
      <button 
        className="sound-toggle-btn" 
        onClick={handleToggleSound}
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
      >
        {isMuted ? <VolumeX size={22} color="#ef4444" /> : <Volume2 size={22} color="#fbbf24" />}
      </button>

      {/* Main Canvas (Always mounted for smooth rendering) */}
      <DoughCanvas 
        dough={dough} 
        setDough={setDough} 
        isInteractive={gameState === 'PLAYING'} 
      />

      {/* UI Overlays */}
      {gameState === 'HOME' && (
        <HomeScreen 
          onStartGame={handleStartGame} 
          stats={stats} 
        />
      )}

      {gameState === 'PLAYING' && (
        <HUD 
          timeLeft={timeLeft} 
          onReset={handleResetDough} 
          onSubmit={() => handleSubmitDough(timeLeft)} 
        />
      )}

      {gameState === 'RESULT' && gameResult && (
        <ResultModal 
          result={gameResult} 
          isNewBest={isNewBest} 
          onPlayAgain={handleStartGame} 
          onGoHome={() => setGameState('HOME')} 
        />
      )}
    </div>
  );
}
