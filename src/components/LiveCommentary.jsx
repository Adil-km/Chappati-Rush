import React, { useEffect, useState, useRef } from 'react';
import { analyzeDoughShape } from '../utils/doughPhysics';

export default function LiveCommentary({ character, dough, timeLeft, totalTime = 30 }) {
  if (!character || !character.comments) return null;

  const [currentComment, setCurrentComment] = useState(character.comments.start || 'Let\'s start rolling!');
  const [isVisible, setIsVisible] = useState(true);
  const idleIndex = useRef(0);
  const hideTimeoutRef = useRef(null);

  // Helper to trigger a comment popup with auto-hide after 3.5 seconds
  const showComment = (text) => {
    setCurrentComment(text);
    setIsVisible(true);

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 3500);
  };

  // Show initial comment on game start
  useEffect(() => {
    showComment(character.comments.start || 'Let\'s start rolling!');
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [character]);

  // Evaluate dough & time low periodically with delayed popups
  useEffect(() => {
    if (timeLeft <= 6) {
      showComment(character.comments.timeLow || 'Vegam, vegam! Time is running out!');
      return;
    }

    if (dough && dough.radii) {
      const metrics = analyzeDoughShape(dough);
      if (metrics.avgDiameter > 120) {
        if (metrics.variance > 3.8) {
          showComment(character.comments.bad || 'Ayyeyyo! Fix the shape!');
        } else if (metrics.circularity > 0.86) {
          showComment(character.comments.good || 'Bhaashaa! Looking smooth!');
        }
      }
    }
  }, [timeLeft]);

  // Delayed periodic idle comment loop every 7.5 seconds
  useEffect(() => {
    const idleTimer = setInterval(() => {
      if (timeLeft > 7 && character.comments.idle && character.comments.idle.length > 0) {
        const nextComment = character.comments.idle[idleIndex.current % character.comments.idle.length];
        idleIndex.current += 1;
        showComment(nextComment);
      }
    }, 7500);

    return () => {
      clearInterval(idleTimer);
    };
  }, [character, timeLeft]);

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '1rem',
        left: '50%',
        transform: isVisible ? 'translateX(-50%) translateY(0) scale(1)' : 'translateX(-50%) translateY(10px) scale(0.95)',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        maxWidth: 'min(90vw, 420px)',
        width: '90%',
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Avatar Thumbnail */}
      <div 
        style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '3px solid #fbbf24',
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          flexShrink: 0,
          background: '#451a03'
        }}
      >
        <img 
          src={character.avatar} 
          alt={character.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Floating Animated Speech Bubble */}
      <div 
        style={{
          background: 'rgba(30, 12, 4, 0.94)',
          border: '2px solid #fbbf24',
          borderRadius: '1rem',
          padding: '0.55rem 0.85rem',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: '600',
          boxShadow: '0 8px 22px rgba(0,0,0,0.7)',
          textAlign: 'left',
          backdropFilter: 'blur(6px)',
          flex: 1
        }}
      >
        <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontFamily: 'Fredoka, sans-serif', marginBottom: '0.1rem' }}>
          {character.name} says:
        </div>
        <div>"{currentComment}"</div>
      </div>
    </div>
  );
}
