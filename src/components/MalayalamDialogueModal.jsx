import React from 'react';
import { Play, Sparkles, Film } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function MalayalamDialogueModal({ level, onStartCooking }) {
  const { character, title, timeLimit, passingScore } = level;

  const handleStart = () => {
    soundManager.playClick();
    onStartCooking();
  };

  return (
    <div className="overlay-screen">
      <div className="result-card" style={{ maxWidth: '540px', padding: '1.75rem' }}>
        
        {/* Header Movie Title Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde68a', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Film size={16} /> {character.movie}
        </div>

        {/* Character Avatar Box */}
        <div style={{ position: 'relative', width: '130px', height: '130px', borderRadius: '50%', border: '4px solid #fbbf24', boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)', overflow: 'hidden', marginBottom: '1rem', background: '#3a1306' }}>
          <img 
            src={character.avatar} 
            alt={character.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Character Name & Tagline */}
        <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.8rem', color: '#fbbf24', marginBottom: '0.2rem' }}>
          {character.name}
        </h2>
        <span style={{ fontSize: '0.85rem', color: '#fef3c7', opacity: 0.8, marginBottom: '1rem', display: 'block' }}>
          {character.tagline}
        </span>

        {/* Comic Speech Bubble */}
        <div style={{
          position: 'relative',
          background: 'rgba(254, 243, 199, 0.95)',
          color: '#451a03',
          padding: '1rem 1.25rem',
          borderRadius: '1.25rem',
          fontSize: '1.05rem',
          fontStyle: 'italic',
          fontWeight: '600',
          lineHeight: '1.4',
          marginBottom: '1.25rem',
          boxShadow: '0 6px 15px rgba(0,0,0,0.5)'
        }}>
          "{character.dialogue}"
        </div>

        {/* Recipe Challenge Summary */}
        <div className="score-row" style={{ width: '100%', marginBottom: '1.25rem', justifyContent: 'space-around' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#fde68a', display: 'block' }}>TARGET DISH</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#ffffff', fontSize: '1.1rem' }}>{title}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#fde68a', display: 'block' }}>TIME LIMIT</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#fbbf24', fontSize: '1.1rem' }}>{timeLimit}s</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#fde68a', display: 'block' }}>PASS SCORE</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#10b981', fontSize: '1.1rem' }}>{passingScore}+</strong>
          </div>
        </div>

        {/* Action Button */}
        <button className="btn-primary" onClick={handleStart} style={{ width: '100%', justifyContent: 'center' }}>
          <Play size={22} fill="#451a03" /> START COOKING!
        </button>

      </div>
    </div>
  );
}
