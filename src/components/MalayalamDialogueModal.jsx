import React from 'react';
import { Play, Film } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function MalayalamDialogueModal({ level, onStartCooking }) {
  const { character, title, timeLimit, passingScore } = level;

  const handleStart = () => {
    soundManager.playClick();
    onStartCooking();
  };

  return (
    <div className="overlay-screen">
      <div className="result-card" style={{ maxWidth: '520px', width: '92%', padding: '1.25rem' }}>
        
        {/* Header Movie Title Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fde68a', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Film size={15} /> {character.movie}
        </div>

        {/* Character Avatar Box */}
        <div style={{ position: 'relative', width: 'clamp(85px, 22vw, 120px)', height: 'clamp(85px, 22vw, 120px)', borderRadius: '50%', border: '4px solid #fbbf24', boxShadow: '0 8px 25px rgba(251, 191, 36, 0.4)', overflow: 'hidden', marginBottom: '0.75rem', background: '#3a1306', flexShrink: 0 }}>
          <img 
            src={character.avatar} 
            alt={character.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Character Name & Tagline */}
        <h2 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', color: '#fbbf24', marginBottom: '0.15rem' }}>
          {character.name}
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#fef3c7', opacity: 0.8, marginBottom: '0.75rem', display: 'block' }}>
          {character.tagline}
        </span>

        {/* Comic Speech Bubble */}
        <div style={{
          position: 'relative',
          background: 'rgba(254, 243, 199, 0.95)',
          color: '#451a03',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          fontSize: 'clamp(0.85rem, 3.2vw, 1rem)',
          fontStyle: 'italic',
          fontWeight: '600',
          lineHeight: '1.4',
          marginBottom: '1rem',
          boxShadow: '0 6px 15px rgba(0,0,0,0.5)',
          width: '100%'
        }}>
          "{character.dialogue}"
        </div>

        {/* Recipe Challenge Summary */}
        <div className="score-row" style={{ width: '100%', marginBottom: '1rem', justifyContent: 'space-around', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#fde68a', display: 'block' }}>TARGET DISH</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#ffffff', fontSize: '1rem' }}>{title}</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#fde68a', display: 'block' }}>TIME LIMIT</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#fbbf24', fontSize: '1rem' }}>{timeLimit}s</strong>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#fde68a', display: 'block' }}>PASS SCORE</span>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', color: '#10b981', fontSize: '1rem' }}>{passingScore}+</strong>
          </div>
        </div>

        {/* Action Button */}
        <button className="btn-primary" onClick={handleStart} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.5rem' }}>
          <Play size={20} fill="#451a03" /> START COOKING!
        </button>

      </div>
    </div>
  );
}
