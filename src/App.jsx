import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { createInitialDough } from './utils/doughPhysics';
import { calculateGameScore } from './utils/scoring';
import { soundManager } from './utils/audio';
import { SHAPES } from './utils/shapeTargets';
import { calculateLevelStars, STORY_STAGES, getNextLevel } from './utils/malayalamStoryline';

import DoughCanvas from './components/DoughCanvas';
import HomeScreen from './components/HomeScreen';
import CampaignMap from './components/CampaignMap';
import MalayalamDialogueModal from './components/MalayalamDialogueModal';
import HUD from './components/HUD';
import ResultModal from './components/ResultModal';
import LiveCommentary from './components/LiveCommentary';

const DEFAULT_TIME = 30;

export default function App() {
  const [gameState, setGameState] = useState('HOME'); // 'HOME' | 'CAMPAIGN_MAP' | 'DIALOGUE' | 'PLAYING' | 'RESULT'
  const [currentLevel, setCurrentLevel] = useState(null);
  const [dough, setDough] = useState(() => createInitialDough(300, 300));
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
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

  // LocalStorage Campaign Progress
  const [campaignProgress, setCampaignProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('chappati_rush_campaign');
      return saved ? JSON.parse(saved) : { unlockedLevels: ['level_1'] };
    } catch (e) {
      return { unlockedLevels: ['level_1'] };
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

  // Mode Selection Handlers
  const handleStartStoryMode = () => {
    setGameState('CAMPAIGN_MAP');
  };

  const handleSelectLevel = (level) => {
    setCurrentLevel(level);
    setGameState('DIALOGUE');
  };

  const handleStartLevelCooking = () => {
    setDough(createInitialDough(300, 300));
    setTimeLeft(currentLevel ? currentLevel.timeLimit : DEFAULT_TIME);
    setGameResult(null);
    setIsNewBest(false);
    setGameState('PLAYING');
  };

  const handleStartQuickPlay = () => {
    setCurrentLevel(null);
    setDough(createInitialDough(300, 300));
    setTimeLeft(DEFAULT_TIME);
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
    const initialDuration = currentLevel ? currentLevel.timeLimit : DEFAULT_TIME;
    const completionTime = Math.max(0.5, initialDuration - remaining);
    const targetShape = currentLevel ? currentLevel.shapeType : SHAPES.CIRCLE;

    const result = calculateGameScore(dough, completionTime, targetShape);
    setGameResult(result);

    // Stats persistence
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

    let updatedCampaign = campaignProgress;
    if (currentLevel) {
      const stars = calculateLevelStars(result.totalScore);
      const isPassed = result.totalScore >= currentLevel.passingScore;

      const currentUnlocked = new Set(campaignProgress.unlockedLevels || ['level_1']);

      if (isPassed) {
        const nextLevelNumber = currentLevel.levelNumber + 1;
        const nextLevelId = `level_${nextLevelNumber}`;
        currentUnlocked.add(nextLevelId);
      }

      updatedCampaign = {
        ...campaignProgress,
        unlockedLevels: Array.from(currentUnlocked),
        [currentLevel.id]: {
          score: Math.max(result.totalScore, campaignProgress[currentLevel.id]?.score || 0),
          stars: Math.max(stars, campaignProgress[currentLevel.id]?.stars || 0)
        }
      };

      setCampaignProgress(updatedCampaign);
      try {
        localStorage.setItem('chappati_rush_campaign', JSON.stringify(updatedCampaign));
      } catch (e) {}
    }

    setGameState('RESULT');
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const activeCharacter = currentLevel 
    ? currentLevel.character 
    : STORY_STAGES[0].levels[0].character;

  const nextLevel = currentLevel ? getNextLevel(currentLevel) : null;

  const handleNextLevel = () => {
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setGameState('DIALOGUE');
    }
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

      {/* Main Canvas */}
      <DoughCanvas 
        dough={dough} 
        setDough={setDough} 
        isInteractive={gameState === 'PLAYING'} 
        targetShapeType={currentLevel ? currentLevel.shapeType : SHAPES.CIRCLE}
        targetTitle={currentLevel ? `${currentLevel.title} (${currentLevel.shapeType})` : '180px Circle'}
      />

      {/* Live Character Commentary Box during Gameplay */}
      {gameState === 'PLAYING' && (
        <LiveCommentary 
          character={activeCharacter} 
          dough={dough} 
          timeLeft={timeLeft} 
          totalTime={currentLevel ? currentLevel.timeLimit : DEFAULT_TIME} 
        />
      )}

      {/* UI Overlays */}
      {gameState === 'HOME' && (
        <HomeScreen 
          onPlay={handleStartStoryMode} 
          stats={stats} 
        />
      )}

      {gameState === 'CAMPAIGN_MAP' && (
        <CampaignMap 
          campaignProgress={campaignProgress} 
          onSelectLevel={handleSelectLevel} 
          onBack={() => setGameState('HOME')} 
        />
      )}

      {gameState === 'DIALOGUE' && currentLevel && (
        <MalayalamDialogueModal 
          level={currentLevel} 
          onStartCooking={handleStartLevelCooking} 
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
          targetTitle={currentLevel ? currentLevel.title : 'Circle'}
          isNewBest={isNewBest} 
          isLevelPassed={!currentLevel || (gameResult.totalScore >= currentLevel.passingScore)}
          hasNextLevel={!!nextLevel}
          onNextLevel={handleNextLevel}
          onPlayAgain={() => currentLevel ? setGameState('DIALOGUE') : handleStartQuickPlay()} 
          onGoHome={() => currentLevel ? setGameState('CAMPAIGN_MAP') : setGameState('HOME')} 
        />
      )}
    </div>
  );
}
