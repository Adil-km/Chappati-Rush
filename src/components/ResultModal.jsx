import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Home, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ResultModal({ 
  result, 
  targetTitle = 'Circle', 
  isNewBest, 
  isLevelPassed = true,
  hasNextLevel, 
  onNextLevel, 
  onPlayAgain, 
  onGoHome 
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Play celebratory audio
    soundManager.playVictory(isNewBest);

    // Trigger confetti on high scores or new records
    if (result.totalScore >= 88 || isNewBest) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Score count-up animation (0 -> totalScore)
    let current = 0;
    const target = result.totalScore;
    const duration = 1200; // ms
    const stepTime = 25;
    const increment = Math.max(1, Math.ceil(target / (duration / stepTime)));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result, isNewBest, targetTitle]);

  return (
    <div className="overlay-screen">
      <div className="result-card">
        {/* Title / Banner */}
        <h2 style={{ fontFamily: 'Fredoka, sans-serif', color: '#fde68a', fontSize: '1.4rem' }}>
          YOUR ROTI RESULT
        </h2>

        {isNewBest && (
          <div className="new-best-banner" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Trophy size={18} /> NEW PERSONAL BEST!
          </div>
        )}

        {/* Rating Title & Emoji */}
        <div className="rating-badge" style={{ color: result.rating.color }}>
          <span>{result.rating.emoji}</span> {result.rating.title}
        </div>

        {/* Animated Total Score */}
        <div className="total-score-badge">
          {animatedScore} <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>/ 100</span>
        </div>

        {/* Detailed Breakdown */}
        <div className="score-breakdown-grid">
          <div className="score-row">
            <span className="score-row-label">Shape Accuracy</span>
            <span className="score-row-value">{result.shapeScore} / 40</span>
          </div>
          <div className="score-row">
            <span className="score-row-label">Size Accuracy</span>
            <span className="score-row-value">{result.sizeScore} / 20</span>
          </div>
          <div className="score-row">
            <span className="score-row-label">Smoothness</span>
            <span className="score-row-value">{result.smoothnessScore} / 15</span>
          </div>
          <div className="score-row">
            <span className="score-row-label">Thickness</span>
            <span className="score-row-value">{result.thicknessScore} / 15</span>
          </div>
          <div className="score-row" style={{ gridColumn: 'span 2' }}>
            <span className="score-row-label">Speed Bonus ({result.completionTimeSeconds}s)</span>
            <span className="score-row-value">{result.speedScore} / 10</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.65rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={onGoHome}>
            <Home size={18} /> Home
          </button>

          <button className="btn-secondary" onClick={onPlayAgain}>
            <Sparkles size={18} /> Replay
          </button>

          {isLevelPassed && hasNextLevel && onNextLevel && (
            <button className="btn-primary" onClick={onNextLevel} style={{ padding: '0.75rem 1.6rem' }}>
              NEXT LEVEL <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
