import { useState } from 'react';

export default function Spades({ onUnlock, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase() === 'GATE') {
      onUnlock('GATE');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>The Maze</h2>
        <p>To unlock this cabinet, you must find your way from the start of the maze to the end. But be careful. Only one path is correct.</p>
        
        <img src="/maze_spades.png" alt="Digital Maze" className="puzzle-image" />
        
        <form onSubmit={handleSubmit} className="puzzle-input-group">
          <input 
            type="text" 
            className="puzzle-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter word"
            maxLength={4}
            autoFocus
          />
          <button type="submit" className="puzzle-submit">Submit</button>
        </form>
        {error && <p className="error-shake">Incorrect. Try again.</p>}
      </div>
    </div>
  );
}
