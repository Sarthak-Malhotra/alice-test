import { useState } from 'react';

export default function FinalEscape({ onEscape, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase() === 'GATEKEY96SAFE') {
      onEscape();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Final Exit</h2>
        <p>Arrange the fragments from the lowest card value to the highest: Spades, Clubs, Diamonds, Hearts.</p>
        
        <form onSubmit={handleSubmit} className="puzzle-input-group" style={{maxWidth: '400px', marginTop: '20px', width: '100%'}}>
          <input 
            type="text" 
            className="puzzle-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password"
            autoFocus
          />
          <button type="submit" className="puzzle-submit">Unlock</button>
        </form>
        {error && <p className="error-shake">Access Denied.</p>}
      </div>
    </div>
  );
}
