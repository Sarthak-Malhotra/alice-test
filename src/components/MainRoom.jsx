import { useState, useEffect } from 'react';
import { Spade, Club, Diamond, Heart, DoorClosed, DoorOpen, User } from 'lucide-react';

const MAP_WIDTH = 15;
const MAP_HEIGHT = 11;

// Tile types:
// 0 = Floor
// 1 = Wall
// 2 = Door (Exit)
// 3 = Spades Cabinet
// 4 = Clubs Cabinet
// 5 = Diamonds Cabinet
// 6 = Hearts Cabinet

const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export default function MainRoom({ timeLeft, unlockedCabinets, onOpenPuzzle, onAttemptEscape, escaped, isPuzzleActive }) {
  const [pos, setPos] = useState({ x: 7, y: 5 });
  const [dir, setDir] = useState('DOWN'); // 'UP', 'DOWN', 'LEFT', 'RIGHT'

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const allUnlocked = Object.values(unlockedCabinets).every(Boolean);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPuzzleActive || escaped) return;

      let nextX = pos.x;
      let nextY = pos.y;
      let nextDir = dir;
      let interacted = false;

      switch (e.key) {
        case 'w': case 'W': case 'ArrowUp':
          nextY -= 1; nextDir = 'UP'; break;
        case 's': case 'S': case 'ArrowDown':
          nextY += 1; nextDir = 'DOWN'; break;
        case 'a': case 'A': case 'ArrowLeft':
          nextX -= 1; nextDir = 'LEFT'; break;
        case 'd': case 'D': case 'ArrowRight':
          nextX += 1; nextDir = 'RIGHT'; break;
        case ' ': case 'Spacebar':
          interacted = true; break;
        default:
          return;
      }

      e.preventDefault(); // Prevent scrolling

      if (interacted) {
        // Check tile in front of player
        let faceX = pos.x;
        let faceY = pos.y;
        if (dir === 'UP') faceY -= 1;
        if (dir === 'DOWN') faceY += 1;
        if (dir === 'LEFT') faceX -= 1;
        if (dir === 'RIGHT') faceX += 1;

        if (faceY >= 0 && faceY < MAP_HEIGHT && faceX >= 0 && faceX < MAP_WIDTH) {
          const tile = MAP[faceY][faceX];
          if (tile === 2) {
            if (allUnlocked) onAttemptEscape();
          } else if (tile === 3 && !unlockedCabinets.spades) onOpenPuzzle('spades');
          else if (tile === 4 && !unlockedCabinets.clubs) onOpenPuzzle('clubs');
          else if (tile === 5 && !unlockedCabinets.diamonds) onOpenPuzzle('diamonds');
          else if (tile === 6 && !unlockedCabinets.hearts) onOpenPuzzle('hearts');
        }
        return;
      }

      // Movement Collision
      if (nextDir !== dir) setDir(nextDir);
      
      if (nextY >= 0 && nextY < MAP_HEIGHT && nextX >= 0 && nextX < MAP_WIDTH) {
        const tile = MAP[nextY][nextX];
        if (tile === 0) { // Only walk on floor
          setPos({ x: nextX, y: nextY });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pos, dir, isPuzzleActive, escaped, allUnlocked, unlockedCabinets]);

  const getTileComponent = (tileValue, x, y) => {
    switch(tileValue) {
      case 1: return <div key={`${x}-${y}`} className="tile tile-wall"></div>;
      case 2: return (
        <div key={`${x}-${y}`} className="tile tile-door" style={{borderColor: allUnlocked ? '#10b981' : '#4a5568'}}>
          {escaped ? <DoorOpen size={32} color="#10b981"/> : <DoorClosed size={32} color="#4a5568"/>}
        </div>
      );
      case 3: return (
        <div key={`${x}-${y}`} className={`tile tile-cabinet ${unlockedCabinets.spades ? 'unlocked' : ''}`} style={{color: 'var(--spade-color)'}}>
          <Spade size={32}/>
        </div>
      );
      case 4: return (
        <div key={`${x}-${y}`} className={`tile tile-cabinet ${unlockedCabinets.clubs ? 'unlocked' : ''}`} style={{color: 'var(--club-color)'}}>
          <Club size={32}/>
        </div>
      );
      case 5: return (
        <div key={`${x}-${y}`} className={`tile tile-cabinet ${unlockedCabinets.diamonds ? 'unlocked' : ''}`} style={{color: 'var(--diamond-color)'}}>
          <Diamond size={32}/>
        </div>
      );
      case 6: return (
        <div key={`${x}-${y}`} className={`tile tile-cabinet ${unlockedCabinets.hearts ? 'unlocked' : ''}`} style={{color: 'var(--heart-color)'}}>
          <Heart size={32}/>
        </div>
      );
      default: return <div key={`${x}-${y}`} className="tile tile-floor"></div>;
    }
  };

  const getPlayerRotation = () => {
    if (dir === 'UP') return '0deg';
    if (dir === 'DOWN') return '180deg';
    if (dir === 'LEFT') return '-90deg';
    if (dir === 'RIGHT') return '90deg';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 10 }}>
      
      {/* UI Overlay */}
      <div className="glass-panel" style={{ padding: '10px 40px', background: 'rgba(10, 10, 15, 0.9)', border: '1px solid #333', marginBottom: '30px' }}>
        <h1 style={{ color: '#ef4444', fontFamily: 'Share Tech Mono, monospace', fontSize: '3rem', margin: 0, textShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}>
          {formatTime(timeLeft)}
        </h1>
        <p style={{fontSize: '0.9rem', color: '#9ca3af', textAlign: 'center', marginTop: '10px'}}>Use WASD to move, Space to interact</p>
      </div>

      {/* Grid Engine */}
      <div className="game-map">
        {MAP.map((row, y) => 
          row.map((tile, x) => getTileComponent(tile, x, y))
        )}
        
        {/* Player Character */}
        <div 
          className="player-character"
          style={{
            gridColumnStart: pos.x + 1,
            gridRowStart: pos.y + 1,
            transform: `rotate(${getPlayerRotation()})`
          }}
        >
          {/* A simple arrow-like player icon facing UP by default */}
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 20L12 16L20 20L12 2Z" fill="#e2e8f0"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
