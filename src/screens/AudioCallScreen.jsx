import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";

export default function AudioCallScreen() {
  const { activeCall, endCall } = useApp();
  const [muted, setSpeaker]   = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [status, setStatus]   = useState("ringing"); // ringing|active

  useEffect(() => {
    const t = setTimeout(() => setStatus("active"), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== "active") return;
    const id = setInterval(() => setCallTime(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if (!activeCall) return null;

  return (
    <div className="call-screen" style={{ background:"linear-gradient(180deg,#0e1220,#080b12)", justifyContent:"space-between" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
        {/* Avatar */}
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", inset:-20, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,107,.18),transparent)", animation:"ripple 2s ease-out infinite" }} />
          <div style={{ width:130, height:130, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b33,#ff475722)", border:"3px solid rgba(255,107,107,.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:60 }}>
            {activeCall.user.photos?.[0] || "👤"}
          </div>
          {status === "active" && (
            <div style={{ position:"absolute", bottom:6, right:6, width:22, height:22, borderRadius:"50%", background:"#22c55e", border:"2.5px solid #080b12", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10 }}>🎙️</div>
          )}
        </div>

        <div style={{ textAlign:"center" }}>
          <div className="serif" style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>{activeCall.user.name}</div>
          <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:12 }}>📍 {activeCall.user.district}</div>
          <div style={{ display:"inline-block", background:"rgba(255,255,255,.08)", borderRadius:20, padding:"6px 18px", fontSize:14, fontWeight:700, color: status === "active" ? "#22c55e" : "#ffd93d" }}>
            {status === "ringing" ? "📞 Ringing..." : `🎙️ ${fmt(callTime)}`}
          </div>
        </div>

        {/* Waveform animation (active only) */}
        {status === "active" && (
          <div style={{ display:"flex", alignItems:"center", gap:4, height:40 }}>
            {Array(14).fill(0).map((_,i) => (
              <div key={i} style={{
                width:4, borderRadius:2,
                background:"linear-gradient(to top,#ff6b6b,#ffd93d)",
                height: `${12 + Math.sin(i * 0.8) * 10}px`,
                animation:`pulse ${0.5 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ padding:"24px 0 36px", background:"rgba(8,11,18,.6)", backdropFilter:"blur(20px)" }}>
        <div className="call-controls" style={{ justifyContent:"center", gap:24 }}>
          <div style={{ textAlign:"center" }}>
            <button className="call-btn" onClick={() => setSpeaker(m => !m)}
              style={{ background: muted ? "#ef4444" : "rgba(255,255,255,.12)", color:"white", width:54, height:54 }}>
              {muted ? "🔇" : "🎤"}
            </button>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:5 }}>{muted?"Unmute":"Mute"}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <button className="call-btn" onClick={endCall}
              style={{ background:"#ef4444", color:"white", width:66, height:66, boxShadow:"0 6px 20px rgba(239,68,68,.55)" }}>
              📵
            </button>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:5 }}>End</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <button className="call-btn"
              style={{ background:"rgba(255,255,255,.1)", color:"white", width:54, height:54 }}>
              🔊
            </button>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.35)", marginTop:5 }}>Speaker</div>
          </div>
        </div>
      </div>
    </div>
  );
}
