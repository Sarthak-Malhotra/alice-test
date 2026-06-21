export default function Intro({ onStart }) {
  return (
    <div className="glass-panel" style={{ maxWidth: '800px', padding: '50px', textAlign: 'center', zIndex: 10 }}>
      <h1>The Card Cabinets</h1>
      <div style={{ textAlign: 'left', margin: '30px 0', fontSize: '1.1rem', lineHeight: '1.8' }}>
        <p>You open your eyes. You are not in your room anymore. You are inside a bright, clean, white room with no windows. The walls look like they are made of metal and glass.</p>
        <br/>
        <p>In front of you is a heavy metal door. It is locked. Next to the door is a computer screen. On the screen, a red timer is counting down from 60 minutes.</p>
        <br/>
        <p>Underneath the screen, there are four metal cabinets built into the wall. Each cabinet has a glowing symbol of a playing card suit on it:</p>
        <ul style={{ listStyle: 'none', paddingLeft: '20px', margin: '20px 0' }}>
          <li style={{color: 'var(--spade-color)', fontWeight: 600}}>♠ The Spade (Blue light)</li>
          <li style={{color: 'var(--club-color)', fontWeight: 600}}>♣ The Club (Green light)</li>
          <li style={{color: 'var(--diamond-color)', fontWeight: 600}}>♦ The Diamond (Yellow light)</li>
          <li style={{color: 'var(--heart-color)', fontWeight: 600}}>♥ The Heart (Red light)</li>
        </ul>
        <p>Suddenly, a computerized voice speaks through a speaker in the ceiling:</p>
        <br/>
        <p style={{fontStyle: 'italic', background: 'rgba(0,0,0,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #333'}}>
          "Welcome, players. You have been selected for a test. To leave this room, you must open all four cabinets. Inside each cabinet is one word. When you put those four words together in the correct order, you will get the password to open the main door. You have one hour. Your time starts now."
        </p>
      </div>
      <button 
        onClick={onStart}
        style={{ padding: '15px 40px', fontSize: '1.2rem', background: '#1a202c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.1s' }}
        onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={e => e.target.style.transform = 'scale(1)'}
      >
        I am ready
      </button>
    </div>
  )
}
