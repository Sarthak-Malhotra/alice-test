import { useEffect, useRef } from 'react';
import { Spade, Club, Diamond, Heart, DoorClosed, DoorOpen } from 'lucide-react';

const MAP_WIDTH = 960;
const MAP_HEIGHT = 720;
const PLAYER_SIZE = 48;
const CABINET_SIZE = 64;
const DOOR_WIDTH = 120;
const DOOR_HEIGHT = 32;

const OBJECTS = [
  { id: 'escape', type: 'door', x: (MAP_WIDTH - DOOR_WIDTH) / 2, y: 0, width: DOOR_WIDTH, height: DOOR_HEIGHT },
  { id: 'spades', type: 'cabinet', x: 100, y: 100, width: CABINET_SIZE, height: CABINET_SIZE, suit: 'spades', icon: Spade, color: 'var(--spade-color)' },
  { id: 'clubs', type: 'cabinet', x: MAP_WIDTH - 100 - CABINET_SIZE, y: 100, width: CABINET_SIZE, height: CABINET_SIZE, suit: 'clubs', icon: Club, color: 'var(--club-color)' },
  { id: 'diamonds', type: 'cabinet', x: 100, y: MAP_HEIGHT - 100 - CABINET_SIZE, width: CABINET_SIZE, height: CABINET_SIZE, suit: 'diamonds', icon: Diamond, color: 'var(--diamond-color)' },
  { id: 'hearts', type: 'cabinet', x: MAP_WIDTH - 100 - CABINET_SIZE, y: MAP_HEIGHT - 100 - CABINET_SIZE, width: CABINET_SIZE, height: CABINET_SIZE, suit: 'hearts', icon: Heart, color: 'var(--heart-color)' }
];

const SPEED = 300;

export default function MainRoom({ timeLeft, unlockedCabinets, onOpenPuzzle, onAttemptEscape, escaped, isPuzzleActive }) {
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const allUnlocked = Object.values(unlockedCabinets).every(Boolean);

  const keys = useRef({});
  const pos = useRef({ x: (MAP_WIDTH - PLAYER_SIZE) / 2, y: (MAP_HEIGHT - PLAYER_SIZE) / 2 });
  const dir = useRef('DOWN');
  const playerRef = useRef(null);
  const requestRef = useRef();
  const lastTimeRef = useRef(0);
  const isInteracting = useRef(false);

  const isColliding = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        isInteracting.current = true;
        e.preventDefault();
      }
    };
    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
      if (e.key === ' ' || e.key === 'Spacebar') {
        isInteracting.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const update = (time) => {
      if (lastTimeRef.current !== 0 && !isPuzzleActive && !escaped) {
        const deltaTime = (time - lastTimeRef.current) / 1000;
        const dt = Math.min(deltaTime, 0.1);

        let dx = 0;
        let dy = 0;

        if (keys.current['w'] || keys.current['arrowup']) { dy -= 1; dir.current = 'UP'; }
        if (keys.current['s'] || keys.current['arrowdown']) { dy += 1; dir.current = 'DOWN'; }
        if (keys.current['a'] || keys.current['arrowleft']) { dx -= 1; dir.current = 'LEFT'; }
        if (keys.current['d'] || keys.current['arrowright']) { dx += 1; dir.current = 'RIGHT'; }

        if (dx !== 0 && dy !== 0) {
          const length = Math.sqrt(dx * dx + dy * dy);
          dx /= length;
          dy /= length;
        }

        const moveDistance = SPEED * dt;
        let nextX = pos.current.x + dx * moveDistance;
        let nextY = pos.current.y + dy * moveDistance;

        if (nextX < 0) nextX = 0;
        if (nextY < 0) nextY = 0;
        if (nextX > MAP_WIDTH - PLAYER_SIZE) nextX = MAP_WIDTH - PLAYER_SIZE;
        if (nextY > MAP_HEIGHT - PLAYER_SIZE) nextY = MAP_HEIGHT - PLAYER_SIZE;

        const rectX = { x: nextX, y: pos.current.y, width: PLAYER_SIZE, height: PLAYER_SIZE };
        let collidesX = false;
        for (const obj of OBJECTS) {
          if (isColliding(rectX, obj)) collidesX = true;
        }
        if (!collidesX) pos.current.x = nextX;

        const rectY = { x: pos.current.x, y: nextY, width: PLAYER_SIZE, height: PLAYER_SIZE };
        let collidesY = false;
        for (const obj of OBJECTS) {
          if (isColliding(rectY, obj)) collidesY = true;
        }
        if (!collidesY) pos.current.y = nextY;

        if (isInteracting.current) {
          isInteracting.current = false;
          
          let intX = pos.current.x;
          let intY = pos.current.y;
          const INT_SIZE = 20;
          
          if (dir.current === 'UP') { intY -= INT_SIZE; }
          if (dir.current === 'DOWN') { intY += PLAYER_SIZE; }
          if (dir.current === 'LEFT') { intX -= INT_SIZE; }
          if (dir.current === 'RIGHT') { intX += PLAYER_SIZE; }

          const interactionRect = { 
            x: dir.current === 'LEFT' || dir.current === 'RIGHT' ? intX : pos.current.x, 
            y: dir.current === 'UP' || dir.current === 'DOWN' ? intY : pos.current.y, 
            width: dir.current === 'LEFT' || dir.current === 'RIGHT' ? INT_SIZE : PLAYER_SIZE, 
            height: dir.current === 'UP' || dir.current === 'DOWN' ? INT_SIZE : PLAYER_SIZE
          };

          for (const obj of OBJECTS) {
            const interactBox = { x: obj.x - 10, y: obj.y - 10, width: obj.width + 20, height: obj.height + 20 };
            if (isColliding(interactionRect, interactBox)) {
              if (obj.id === 'escape' && allUnlocked) onAttemptEscape();
              else if (obj.type === 'cabinet' && !unlockedCabinets[obj.id]) onOpenPuzzle(obj.id);
            }
          }
        }

        if (playerRef.current) {
          playerRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${getPlayerRotation()})`;
        }
      }
      
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPuzzleActive, escaped, allUnlocked, unlockedCabinets, onOpenPuzzle, onAttemptEscape]);

  const getPlayerRotation = () => {
    if (dir.current === 'UP') return '0deg';
    if (dir.current === 'DOWN') return '180deg';
    if (dir.current === 'LEFT') return '-90deg';
    if (dir.current === 'RIGHT') return '90deg';
    return '0deg';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 10 }}>
      <div className="glass-panel" style={{ padding: '10px 40px', background: 'rgba(10, 10, 15, 0.9)', border: '1px solid #333', marginBottom: '30px' }}>
        <h1 style={{ color: '#ef4444', fontFamily: 'Share Tech Mono, monospace', fontSize: '3rem', margin: 0, textShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}>
          {formatTime(timeLeft)}
        </h1>
        <p style={{fontSize: '0.9rem', color: '#9ca3af', textAlign: 'center', marginTop: '10px'}}>Use WASD to move, Space to interact</p>
      </div>

      <div className="game-map" style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
        {OBJECTS.map(obj => {
          if (obj.type === 'door') {
            return (
              <div key={obj.id} className="tile-door" style={{ left: obj.x, top: obj.y, width: obj.width, height: obj.height, borderColor: allUnlocked ? '#10b981' : '#4a5568' }}>
                {escaped ? <DoorOpen size={24} color="#10b981"/> : <DoorClosed size={24} color="#4a5568"/>}
              </div>
            );
          }
          if (obj.type === 'cabinet') {
            const Icon = obj.icon;
            const isUnlocked = unlockedCabinets[obj.id];
            return (
              <div 
                key={obj.id} 
                className={`tile-cabinet ${isUnlocked ? 'unlocked' : ''}`} 
                style={{ 
                  left: obj.x, 
                  top: obj.y, 
                  width: obj.width, 
                  height: obj.height, 
                  color: isUnlocked ? obj.color : '#a0aec0',
                  boxShadow: isUnlocked ? `0 0 15px ${obj.color}` : 'none',
                  borderColor: isUnlocked ? obj.color : '#475569'
                }}
              >
                <Icon size={32}/>
              </div>
            );
          }
          return null;
        })}

        <div 
          ref={playerRef}
          className="player-character"
          style={{ width: PLAYER_SIZE, height: PLAYER_SIZE }}
        >
          <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 20L12 16L20 20L12 2Z" fill="#334155"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
