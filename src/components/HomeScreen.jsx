import React from 'react';
import { Film, Trophy, Clock, Target, Info, Sparkles, LogOut } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HomeScreen({ 
  user, 
  onSignInGoogle, 
  onSignOut, 
  onOpenLeaderboard, 
  onStartStoryMode, 
  onStartQuickPlay, 
  stats 
}) {
  const handleStoryClick = () => {
    soundManager.playClick();
    onStartStoryMode();
  };

  const handleQuickClick = () => {
    soundManager.playClick();
    onStartQuickPlay();
  };

  const handleLeaderboardClick = () => {
    soundManager.playClick();
    onOpenLeaderboard();
  };

  return (
    <div className="overlay-screen">
      {/* Top Header User Profile / Auth Box */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 25 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(30, 12, 4, 0.85)', padding: '0.4rem 0.85rem', borderRadius: '9999px', border: '1.5px solid #fbbf24' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid #fbbf24', flexShrink: 0 }}>
              <img src={user.photoURL} alt={user.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '0.9rem', color: '#ffffff', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.displayName?.split(' ')[0]}
            </span>
            <button 
              onClick={onSignOut} 
              title="Sign Out"
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onSignInGoogle}
            style={{
              background: '#ffffff',
              color: '#374151',
              fontFamily: 'Roboto, Inter, sans-serif',
              fontWeight: '600',
              fontSize: '0.88rem',
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              border: '2px solid #e5e7eb',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {/* SVG Official Google Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Google Sign In
          </button>
        )}
      </div>

      <div className="title-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <span>🫓</span> Chappati Rush
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

      {/* Mode Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button className="btn-primary" onClick={handleStoryClick} style={{ padding: '0.85rem 1.8rem' }}>
          <Film size={22} /> STORY CAMPAIGN
        </button>
        <button className="btn-secondary" onClick={handleQuickClick} style={{ padding: '0.85rem 1.4rem' }}>
          <Sparkles size={18} /> Quick Practice
        </button>
        <button className="btn-secondary" onClick={handleLeaderboardClick} style={{ padding: '0.85rem 1.4rem', borderColor: '#fbbf24', color: '#fbbf24' }}>
          <Trophy size={18} /> Leaderboard
        </button>
      </div>
    </div>
  );
}
