import { useState } from 'react';

export default function Clubs({ onUnlock, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase() === 'KEY') {
      onUnlock('KEY');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>The Word Link</h2>
        <p>To unlock this cabinet, you must find the bridge. Find the single word that connects all three of these items.</p>
        
        <div style={{ padding: '40px 0', display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '4px' }}>LOCK</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '4px', color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '4px' }}>PIANO</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '4px', color: '#cbd5e1' }}>|</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '4px' }}>CHAIN</span>
        </div>
        
        <form onSubmit={handleSubmit} className="puzzle-input-group">
          <input 
            type="text" 
            className="puzzle-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter word"
            autoFocus
          />
          <button type="submit" className="puzzle-submit">Submit</button>
        </form>
        {error && <p className="error-shake">Incorrect. Try again.</p>}
      </div>
    </div>
  );
}
