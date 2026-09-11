import React from 'react';
import { Play, Trophy, Clock, Target, Info } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HomeScreen({
  onPlay,
  stats
}) {
  const handlePlayClick = () => {
    soundManager.playClick();
    onPlay();
  };

  return (
    <div className="overlay-screen">
      <div className="title-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <span>🫓</span> Chappathi Rush
      </div>
      <p className="subtitle">Master the art of flatbreads & satisfy Malayalam cinema legends!</p>

      {/* Instructions Card */}
      <div className="instructions-list" style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '700', color: '#fbbf24' }}>
          <Info size={18} /> How To Play:
        </div>
        <ul>
          <li>Drag the <strong>wooden rolling pin</strong> across the dough ball to flatten and stretch it.</li>
          <li>Match the <strong>golden target shape outline</strong> (Circle, Oval, Square, Heart, Star).</li>
          <li>Press <strong>DONE</strong> before time expires to calculate your score out of 100!</li>
        </ul>
      </div>

      {/* Stats Summary */}
      <div className="stats-card">
        <div className="stat-item">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Trophy size={14} /> High Score
          </span>
          <span className="stat-value">{stats.bestScore > 0 ? stats.bestScore : '--'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} /> Best Time
          </span>
          <span className="stat-value">{stats.bestTime ? `${stats.bestTime}s` : '--'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Target size={14} /> Total Attempts
          </span>
          <span className="stat-value">{stats.attempts || 0}</span>
        </div>
      </div>

      {/* Single Main Play Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
        <button className="btn-primary" onClick={handlePlayClick} style={{ padding: '0.95rem 2.6rem', fontSize: '1.35rem', letterSpacing: '0.05em' }}>
          <Play size={24} fill="#ffffff" /> PLAY
        </button>
      </div>
    </div>
  );
}
