import React from 'react';
import { Lock, Star, Play, ArrowLeft } from 'lucide-react';
import { STORY_STAGES, calculateLevelStars } from '../utils/malayalamStoryline';
import { soundManager } from '../utils/audio';

export default function CampaignMap({ campaignProgress, onSelectLevel, onBack }) {
  // campaignProgress format: { level_1: { score: 92, stars: 3 }, unlockedLevels: ['level_1', 'level_2'] }

  const unlockedSet = new Set(campaignProgress?.unlockedLevels || ['level_1']);

  const handleLevelClick = (level) => {
    if (!unlockedSet.has(level.id)) return;
    soundManager.playClick();
    onSelectLevel(level);
  };

  return (
    <div className="overlay-screen" style={{ overflowY: 'auto', justifyContent: 'flex-start', padding: '2rem 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '800px', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
        <h2 className="title-primary" style={{ fontSize: '2.2rem', margin: 0 }}>
          🎬 Story Campaign
        </h2>
        <div style={{ width: '80px' }} />
      </div>

      <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
        Help Dasan Ashaan serve Malayalam cinema's iconic legends & win the Golden Belan!
      </p>

      {/* Campaign Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '800px' }}>
        {STORY_STAGES.map((stage) => (
          <div 
            key={stage.id} 
            style={{ 
              background: 'rgba(30, 12, 4, 0.75)', 
              border: '2px solid rgba(254, 243, 199, 0.2)', 
              borderRadius: '1.25rem', 
              padding: '1.25rem 1.5rem',
              backdropFilter: 'blur(6px)'
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'Fredoka, sans-serif', color: '#fbbf24', fontSize: '1.35rem' }}>
                {stage.title}
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#fef3c7', opacity: 0.75 }}>
                {stage.subtitle}
              </span>
            </div>

            {/* Level Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {stage.levels.map((lvl) => {
                const isUnlocked = unlockedSet.has(lvl.id);
                const lvlData = campaignProgress?.[lvl.id] || {};
                const score = lvlData.score || 0;
                const stars = lvlData.stars || (score > 0 ? calculateLevelStars(score) : 0);

                return (
                  <div
                    key={lvl.id}
                    onClick={() => handleLevelClick(lvl)}
                    style={{
                      background: isUnlocked ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.35)',
                      border: isUnlocked ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '1rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Character Avatar Thumbnail */}
                    <div style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '50%', border: '2px solid #fbbf24', overflow: 'hidden', flexShrink: 0, background: '#451a03' }}>
                      <img src={lvl.character.avatar} alt={lvl.character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!isUnlocked && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Lock size={18} color="#ef4444" />
                        </div>
                      )}
                    </div>

                    {/* Level Details */}
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Level {lvl.levelNumber}
                      </span>
                      <h4 style={{ fontFamily: 'Fredoka, sans-serif', color: '#ffffff', fontSize: '1.05rem', margin: '0.1rem 0' }}>
                        {lvl.title}
                      </h4>

                      {/* Stars */}
                      <div style={{ display: 'flex', gap: '0.2rem', marginTop: '0.2rem' }}>
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            size={14}
                            fill={starNum <= stars ? '#fbbf24' : 'none'}
                            color={starNum <= stars ? '#fbbf24' : '#6b7280'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
