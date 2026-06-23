import { useApp } from "../contexts/AppContext";

export default function MatchCelebration() {
  const { matchedUser, setShowMatch, setActiveTab, setChatUser } = useApp();
  if (!matchedUser) return null;

  // Confetti pieces
  const confetti = Array(20).fill(0).map((_,i) => ({
    left: `${Math.random()*100}%`,
    color: ["#ff6b6b","#ffd93d","#22c55e","#60a5fa","#f59e0b"][i % 5],
    delay: `${Math.random()*1.5}s`,
    size:  `${6 + Math.random()*8}px`,
  }));

  return (
    <div className="match-overlay">
      {/* Confetti */}
      {confetti.map((c,i) => (
        <div key={i} className="confetti-piece" style={{
          left: c.left, background: c.color,
          width: c.size, height: c.size,
          animationDelay: c.delay,
          borderRadius: i % 3 === 0 ? "50%" : "2px",
        }} />
      ))}

      <div style={{ textAlign:"center", zIndex:10 }}>
        {/* Hearts */}
        <div style={{ fontSize:52, marginBottom:8, animation:"heartBeat 1s ease infinite" }}>❤️</div>

        {/* Title */}
        <div className="match-title">It's a Match!</div>

        {/* Avatars */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, margin:"24px 0" }}>
          <div style={{ width:84, height:84, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, boxShadow:"0 0 0 3px #ff6b6b55, 0 12px 32px rgba(255,71,87,.5)", animation:"float 2s ease-in-out infinite" }}>
            👤
          </div>
          <div style={{ fontSize:28 }}>💕</div>
          <div style={{ width:84, height:84, borderRadius:"50%", background:"linear-gradient(135deg,#ffd93d,#f59e0b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, boxShadow:"0 0 0 3px #ffd93d55, 0 12px 32px rgba(245,158,11,.5)", animation:"float 2s ease-in-out .4s infinite" }}>
            {matchedUser.photos?.[0] || "👤"}
          </div>
        </div>

        <p style={{ color:"rgba(255,255,255,.6)", fontSize:14, marginBottom:6 }}>
          You and <strong style={{color:"#fff"}}>{matchedUser.name}</strong> liked each other!
        </p>
        <p style={{ color:"rgba(255,255,255,.35)", fontSize:12, marginBottom:28 }}>
          {matchedUser.mode === "date" ? "She messages first within 24 hours 💌" : "Say hello and start a conversation! 👋"}
        </p>

        {/* Buttons */}
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button className="btn-ghost" style={{ padding:"13px 24px", fontSize:14 }}
            onClick={() => setShowMatch(false)}>
            Keep Swiping
          </button>
          <button className="btn-red" style={{ padding:"13px 28px", fontSize:14 }}
            onClick={() => { setShowMatch(false); setChatUser(matchedUser); setActiveTab("chat"); }}>
            💬 Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
