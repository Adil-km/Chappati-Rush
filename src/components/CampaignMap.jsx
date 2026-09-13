import React from 'react';
import { Lock, Star, ArrowLeft } from 'lucide-react';
import { STORY_STAGES, calculateLevelStars } from '../utils/malayalamStoryline';
import { soundManager } from '../utils/audio';

export default function CampaignMap({ campaignProgress, onSelectLevel, onBack }) {
  const unlockedSet = new Set(campaignProgress?.unlockedLevels || ['level_1']);

  const handleLevelClick = (level) => {
    if (!unlockedSet.has(level.id)) return;
    soundManager.playClick();
    onSelectLevel(level);
  };

  return (
    <div className="overlay-screen" style={{ overflowY: 'auto', justifyContent: 'flex-start', padding: '1rem 0.5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '800px', marginBottom: '1rem', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '0.4rem 1rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="title-primary" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: 0 }}>
          🎬 Story Campaign
        </h2>
        <div style={{ width: '40px' }} />
      </div>

      <p className="subtitle" style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', marginBottom: '1.25rem' }}>
        Serve the legends. Master the Chappathikkol. Win the Golden Chappathikkol!
      </p>

      {/* Campaign Stages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '800px' }}>
        {STORY_STAGES.map((stage) => (
          <div
            key={stage.id}
            style={{
              background: 'rgba(30, 12, 4, 0.75)',
              border: '2px solid rgba(254, 243, 199, 0.2)',
              borderRadius: '1rem',
              padding: '1rem',
              backdropFilter: 'blur(6px)'
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
              <h3 style={{ fontFamily: 'Fredoka, sans-serif', color: '#fbbf24', fontSize: 'clamp(1.1rem, 4vw, 1.35rem)' }}>
                {stage.title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#fef3c7', opacity: 0.75 }}>
                {stage.subtitle}
              </span>
            </div>

            {/* Level Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
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
                      borderRadius: '0.85rem',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      cursor: isUnlocked ? 'pointer' : 'not-allowed',
                      opacity: isUnlocked ? 1 : 0.6,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Character Avatar Thumbnail */}
                    <div style={{ position: 'relative', width: '46px', height: '46px', borderRadius: '50%', border: '2px solid #fbbf24', overflow: 'hidden', flexShrink: 0, background: '#451a03' }}>
                      <img src={lvl.character.avatar} alt={lvl.character.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {!isUnlocked && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Lock size={16} color="#ef4444" />
                        </div>
                      )}
                    </div>

                    {/* Level Details */}
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.7rem', color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Level {lvl.levelNumber}
                      </span>
                      <h4 style={{ fontFamily: 'Fredoka, sans-serif', color: '#ffffff', fontSize: '0.95rem', margin: '0.1rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lvl.title}
                      </h4>

                      {/* Stars */}
                      <div style={{ display: 'flex', gap: '0.15rem', marginTop: '0.15rem' }}>
                        {[1, 2, 3].map((starNum) => (
                          <Star
                            key={starNum}
                            size={12}
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
