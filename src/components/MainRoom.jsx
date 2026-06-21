import { Spade, Club, Diamond, Heart, DoorClosed, DoorOpen } from 'lucide-react';

export default function MainRoom({ timeLeft, unlockedCabinets, onOpenPuzzle, onAttemptEscape, escaped }) {
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const allUnlocked = Object.values(unlockedCabinets).every(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', width: '100%', zIndex: 10 }}>
      <div className="glass-panel" style={{ padding: '20px 50px', background: 'rgba(10, 10, 15, 0.9)', border: '1px solid #333' }}>
        <h1 style={{ color: '#ef4444', fontFamily: 'Share Tech Mono, monospace', fontSize: '4rem', margin: 0, textShadow: '0 0 15px rgba(239, 68, 68, 0.8)' }}>
          {formatTime(timeLeft)}
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Cabinet 
          suit="spades" 
          icon={<Spade size={48} />} 
          color="var(--spade-color)" 
          unlocked={unlockedCabinets.spades} 
          onClick={() => onOpenPuzzle('spades')} 
        />
        <Cabinet 
          suit="clubs" 
          icon={<Club size={48} />} 
          color="var(--club-color)" 
          unlocked={unlockedCabinets.clubs} 
          onClick={() => onOpenPuzzle('clubs')} 
        />
        <Cabinet 
          suit="diamonds" 
          icon={<Diamond size={48} />} 
          color="var(--diamond-color)" 
          unlocked={unlockedCabinets.diamonds} 
          onClick={() => onOpenPuzzle('diamonds')} 
        />
        <Cabinet 
          suit="hearts" 
          icon={<Heart size={48} />} 
          color="var(--heart-color)" 
          unlocked={unlockedCabinets.hearts} 
          onClick={() => onOpenPuzzle('hearts')} 
        />
      </div>

      <div 
        onClick={allUnlocked ? onAttemptEscape : null}
        className="glass-panel" 
        style={{ 
          marginTop: '20px',
          width: '240px', 
          height: '360px', 
          background: 'var(--metal-bg)',
          boxShadow: 'var(--metal-shadow)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: allUnlocked ? 'pointer' : 'not-allowed',
          opacity: allUnlocked ? 1 : 0.7,
          transition: 'all 0.3s',
          border: '4px solid #a0aec0'
        }}
      >
        {escaped ? <DoorOpen size={80} color="#10b981" /> : <DoorClosed size={80} color="#4a5568" />}
        {allUnlocked && !escaped && <p style={{marginTop: '20px', fontWeight: 'bold'}}>ENTER PASSWORD</p>}
      </div>
    </div>
  );
}

function Cabinet({ suit, icon, color, unlocked, onClick }) {
  return (
    <div 
      onClick={unlocked ? null : onClick}
      className="glass-panel"
      style={{
        width: '120px',
        height: '160px',
        background: 'var(--metal-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: unlocked ? 'default' : 'pointer',
        boxShadow: unlocked ? `0 0 20px ${color}` : 'var(--metal-shadow)',
        border: unlocked ? `2px solid ${color}` : '1px solid var(--glass-border)',
        transition: 'all 0.3s',
        color: unlocked ? color : '#a0aec0'
      }}
    >
      {icon}
      {unlocked && <span style={{marginTop: '10px', fontSize: '0.8rem', fontWeight: 'bold'}}>UNLOCKED</span>}
    </div>
  )
}
