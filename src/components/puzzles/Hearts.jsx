import { useState } from 'react';

export default function Hearts({ onUnlock, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toUpperCase() === 'SAFE') {
      onUnlock('SAFE');
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>The Hidden Image</h2>
        <p>To unlock this cabinet, you must see past the illusion. Look closely at the picture to find what is hidden in plain sight.</p>
        
        <img src="/illusion_hearts.png" alt="Optical Illusion" className="puzzle-image" />
        
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
