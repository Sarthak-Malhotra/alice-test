import { useState } from 'react';

export default function Diamonds({ onUnlock, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '96') {
      onUnlock('96');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>The Number Pattern</h2>
        <p>To unlock this cabinet, you must use your mind. Find the rule behind these numbers and complete the sequence.</p>
        
        <div style={{ padding: '40px 0', fontSize: '2rem', fontFamily: 'Share Tech Mono, monospace', letterSpacing: '2px', wordSpacing: '10px' }}>
          3 6 12 24 48 [ ? ]
        </div>
        
        <form onSubmit={handleSubmit} className="puzzle-input-group">
          <input 
            type="number" 
            className="puzzle-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter number"
            autoFocus
          />
          <button type="submit" className="puzzle-submit">Submit</button>
        </form>
        {error && <p className="error-shake">Incorrect. Try again.</p>}
      </div>
    </div>
  );
}
