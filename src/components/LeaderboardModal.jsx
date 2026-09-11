import React, { useEffect, useState } from 'react';
import { Trophy, ArrowLeft, RefreshCw, UserCheck } from 'lucide-react';
import { fetchGlobalLeaderboard } from '../utils/firestoreLeaderboard';
import { soundManager } from '../utils/audio';

export default function LeaderboardModal({ currentUser, onClose }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    fetchGlobalLeaderboard(10).then(data => {
      setLeaderboard(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const getRankBadge = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="overlay-screen" style={{ overflowY: 'auto', padding: '1.5rem 1rem' }}>
      <div className="result-card" style={{ maxWidth: '640px', width: '94%', padding: '1.5rem' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.25rem' }}>
          <button className="btn-secondary" onClick={handleClose} style={{ padding: '0.45rem 1rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          
          <h2 className="title-primary" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={28} color="#fbbf24" /> Leaderboard
          </h2>

          <button className="btn-secondary" onClick={loadData} title="Refresh Leaderboard" style={{ padding: '0.45rem 0.75rem' }}>
            <RefreshCw size={16} className={isLoading ? 'spin' : ''} />
          </button>
        </div>

        <p className="subtitle" style={{ fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          Top Roti Masters across the World!
        </p>

        {/* Loading State */}
        {isLoading ? (
          <div style={{ padding: '3rem', color: '#fde68a', fontFamily: 'Fredoka, sans-serif' }}>
            Fetching Roti Champions...
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{ padding: '2.5rem', color: '#fef3c7', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', width: '100%', marginBottom: '1rem' }}>
            No scores submitted yet! Be the first Roti Master on the board!
          </div>
        ) : (
          /* Leaderboard Table */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', marginBottom: '1.5rem' }}>
            {leaderboard.map((item, idx) => {
              const isCurrentUser = currentUser && item.uid === currentUser.uid;

              return (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    background: isCurrentUser 
                      ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)' 
                      : 'rgba(255, 255, 255, 0.06)',
                    border: isCurrentUser ? '2px solid #fbbf24' : '1px solid rgba(254, 243, 199, 0.15)',
                    borderRadius: '0.85rem',
                    padding: '0.65rem 1rem',
                    gap: '0.75rem'
                  }}
                >
                  {/* Rank Badge */}
                  <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.2rem', fontWeight: '700', width: '36px', textAlign: 'center' }}>
                    {getRankBadge(idx)}
                  </span>

                  {/* User Photo & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', background: '#7c2d12', flexShrink: 0, border: '1.5px solid #fbbf24' }}>
                      {item.photoURL ? (
                        <img src={item.photoURL} alt={item.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontWeight: '700' }}>
                          🫓
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div style={{ fontFamily: 'Fredoka, sans-serif', color: '#ffffff', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {item.displayName}
                        {isCurrentUser && <UserCheck size={14} color="#fbbf24" />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#fde68a', opacity: 0.8 }}>
                        {item.shapeTitle || 'Circle Roti'}
                      </span>
                    </div>
                  </div>

                  {/* Score & Time */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24' }}>
                      {item.totalScore} <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>pts</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                      ⚡ {item.completionTime}s
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
