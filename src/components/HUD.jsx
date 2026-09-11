import React from 'react';
import { Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HUD({ timeLeft, onSubmit, onReset }) {
  const handleReset = () => {
    soundManager.playClick();
    onReset();
  };

  const handleSubmit = () => {
    soundManager.playSubmit();
    onSubmit();
  };

  const isLowTime = timeLeft <= 5;

  return (
    <div className="hud-container">
      {/* Target Title & Challenge */}
      <div className="hud-pill">
        <span style={{ fontSize: '1.2rem' }}>🫓</span>
        <span>PERFECT CHAPPATHI</span>
      </div>

      {/* Timer Display */}
      <div className={`hud-pill ${isLowTime ? 'timer-low' : ''}`}>
        <Clock size={20} color={isLowTime ? '#ef4444' : '#fbbf24'} />
        <span className="timer-box">{timeLeft}s</span>
      </div>

      {/* Action Buttons */}
      <div className="hud-actions">
        <button className="btn-secondary" onClick={handleReset} title="Reset Dough">
          <RotateCcw size={18} /> Reset
        </button>
        <button className="btn-primary btn-success" onClick={handleSubmit} style={{ padding: '0.5rem 1.5rem', fontSize: '1.15rem' }}>
          <CheckCircle size={20} /> DONE
        </button>
      </div>
    </div>
  );
}
