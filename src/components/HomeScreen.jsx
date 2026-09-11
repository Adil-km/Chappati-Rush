import React from 'react';
import { Play, Trophy, Clock, Target, Info } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HomeScreen({ onStartGame, stats }) {
  const handlePlayClick = () => {
    soundManager.playClick();
    onStartGame();
  };

  return (
    <div className="overlay-screen">
      <div className="title-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
        <span>🫓</span> Chappati Rush
      </div>
      <p className="subtitle">Can you roll the perfect circle roti?</p>

      {/* Instructions Card */}
      <div className="instructions-list" style={{ maxWidth: '460px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: '700', color: '#fbbf24' }}>
          <Info size={18} /> How To Play:
        </div>
        <ul>
          <li>Click/touch and drag the <strong>wooden rolling pin</strong> across the dough ball.</li>
          <li>Stretch the dough to match the <strong>golden target circle</strong> (180px).</li>
          <li>Press <strong>DONE</strong> before the 30-second timer expires to calculate your score!</li>
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
            <Target size={14} /> Attempts
          </span>
          <span className="stat-value">{stats.attempts || 0}</span>
        </div>
      </div>

      {/* Play Button */}
      <button className="btn-primary" onClick={handlePlayClick} style={{ marginTop: '1rem' }}>
        <Play size={24} fill="#451a03" /> PLAY GAME
      </button>
    </div>
  );
}
