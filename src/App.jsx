import { useState, useEffect } from 'react';
import './App.css';
import Intro from './components/Intro';
import MainRoom from './components/MainRoom';
import Spades from './components/puzzles/Spades';
import Clubs from './components/puzzles/Clubs';
import Diamonds from './components/puzzles/Diamonds';
import Hearts from './components/puzzles/Hearts';
import FinalEscape from './components/FinalEscape';

function App() {
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'escaped', 'failed'
  const [timeLeft, setTimeLeft] = useState(3600);
  const [unlockedCabinets, setUnlockedCabinets] = useState({
    spades: false,
    clubs: false,
    diamonds: false,
    hearts: false
  });
  const [activePuzzle, setActivePuzzle] = useState(null); // 'spades', 'clubs', 'diamonds', 'hearts', 'escape', null

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('failed');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStart = () => {
    setGameState('playing');
  };

  const handleUnlock = (suit, fragment) => {
    setUnlockedCabinets(prev => ({ ...prev, [suit]: true }));
    setActivePuzzle(null);
  };

  const handleEscape = () => {
    setGameState('escaped');
    setActivePuzzle(null);
  };

  return (
    <div className="app-container">
      {gameState === 'intro' && <Intro onStart={handleStart} />}
      
      {(gameState === 'playing' || gameState === 'failed' || gameState === 'escaped') && (
        <MainRoom 
          timeLeft={timeLeft} 
          unlockedCabinets={unlockedCabinets}
          onOpenPuzzle={suit => setActivePuzzle(suit)}
          onAttemptEscape={() => setActivePuzzle('escape')}
          escaped={gameState === 'escaped'}
        />
      )}

      {gameState === 'escaped' && (
        <div className="modal-overlay" style={{background: 'rgba(16, 185, 129, 0.9)', zIndex: 200}}>
          <div className="glass-panel" style={{padding: '50px', textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.5)'}}>
            <h1>Congratulations</h1>
            <p style={{fontSize: '1.2rem', marginTop: '20px'}}>You have solved the puzzles and escaped the room. Your test is complete.</p>
          </div>
        </div>
      )}

      {gameState === 'failed' && (
        <div className="modal-overlay" style={{background: 'rgba(239, 68, 68, 0.9)', zIndex: 200}}>
          <div className="glass-panel" style={{padding: '50px', textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.5)'}}>
            <h1>Time's Up</h1>
            <p style={{fontSize: '1.2rem', marginTop: '20px'}}>You failed to escape.</p>
          </div>
        </div>
      )}

      {activePuzzle === 'spades' && <Spades onUnlock={(fragment) => handleUnlock('spades', fragment)} onClose={() => setActivePuzzle(null)} />}
      {activePuzzle === 'clubs' && <Clubs onUnlock={(fragment) => handleUnlock('clubs', fragment)} onClose={() => setActivePuzzle(null)} />}
      {activePuzzle === 'diamonds' && <Diamonds onUnlock={(fragment) => handleUnlock('diamonds', fragment)} onClose={() => setActivePuzzle(null)} />}
      {activePuzzle === 'hearts' && <Hearts onUnlock={(fragment) => handleUnlock('hearts', fragment)} onClose={() => setActivePuzzle(null)} />}
      {activePuzzle === 'escape' && <FinalEscape onEscape={handleEscape} onClose={() => setActivePuzzle(null)} />}
    </div>
  );
}

export default App;
