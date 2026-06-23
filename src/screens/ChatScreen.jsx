import { useEffect, useRef, useState } from "react";
import { useApp } from "../contexts/AppContext";
import { SONGS } from "../App";

export default function ChatScreen() {
  const { chatUser, messages, msgInput, setMsgInput, sendMessage, startCall, setActiveTab } = useApp();
  const bottomRef = useRef();
  
  // Laya Sync State
  const [syncActive, setSyncActive] = useState(false);
  const [syncTrack, setSyncTrack] = useState(SONGS[0]);
  const [showTrackPicker, setShowTrackPicker] = useState(false);
  const [syncElapsed, setSyncElapsed] = useState(0);

  // Simulate sync timer when active
  useEffect(() => {
    if (!syncActive) { setSyncElapsed(0); return; }
    const timer = setInterval(() => {
      setSyncElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [syncActive, syncTrack]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, chatUser?.id]);

  if (!chatUser) return null;
  const msgs = messages[chatUser.id] || [];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 130px)", animation:"fadeIn .3s ease" }}>

      {/* Chat header */}
      <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <button onClick={() => setActiveTab("matches")}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,.5)", fontSize:20, cursor:"pointer", padding:"0 4px" }}>←</button>
        <div style={{ width:40, height:40, borderRadius:"50%", background:"rgba(255,107,107,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, border:"1px solid rgba(255,107,107,.2)" }}>
          {chatUser.photos?.[0] || "👤"}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:14 }}>{chatUser.name}</div>
          <div style={{ fontSize:11, color: chatUser.online ? "#22c55e" : "rgba(255,255,255,.3)" }}>
            {chatUser.online ? "● Online" : "● Offline"}
          </div>
        </div>
        {/* Call & Sync buttons */}
        <button onClick={() => setSyncActive(!syncActive)}
          style={{ padding:"6px 12px", borderRadius:20, background: syncActive ? "rgba(255,45,45,0.2)" : "rgba(212,175,55,0.1)", border: syncActive ? "1px solid rgba(255,45,45,0.5)" : "1px solid rgba(212,175,55,0.3)", color: syncActive ? "#ff4444" : "#d4af37", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all .3s ease", boxShadow: syncActive ? "0 0 15px rgba(255,45,45,0.2)" : "none" }}>
          {syncActive ? "End Sync" : "Laya Sync 🎧"}
        </button>
        <button onClick={() => startCall(chatUser, "audio")}
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(37,211,102,.12)", border:"1px solid rgba(37,211,102,.25)", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>📞</button>
        <button onClick={() => startCall(chatUser, "video")}
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,107,107,.12)", border:"1px solid rgba(255,107,107,.25)", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>📹</button>
      </div>

      {/* LAYA SYNC ROOM PANEL */}
      {syncActive && (
        <div style={{ margin:"12px 16px", padding:"20px", background:"rgba(20,5,5,0.55)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,45,45,0.25)", borderRadius:"32px", display:"flex", flexDirection:"column", gap:16, animation:"slideDown .4s cubic-bezier(0.2, 0.8, 0.2, 1) both", boxShadow:"0 16px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,45,45,0.05)" }}>
          
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:11, color:"#ff4444", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"#ff4444", boxShadow:"0 0 10px #ff4444", animation:"pulse 1.5s infinite" }} />
              Live Sync Room
            </div>
            <button onClick={() => setShowTrackPicker(!showTrackPicker)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:6, padding:"4px 10px", color:"#fff", fontSize:10, cursor:"pointer" }}>
              {showTrackPicker ? "Hide Tracks" : "Browse Tracks"}
            </button>
          </div>
          
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            {/* Spinning Album Art */}
            <div style={{ position:"relative", width:70, height:70, borderRadius:"50%", border:"2px solid rgba(212,175,55,0.4)", overflow:"hidden", animation:"spin 4s linear infinite", boxShadow:"0 0 30px rgba(212,175,55,0.15)", flexShrink:0 }}>
              <img src={syncTrack.cover || chatUser.photos?.[0] || "/fake1.jpg"} alt="Album Art" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", top:"50%", left:"50%", width:14, height:14, background:"#0a0000", borderRadius:"50%", transform:"translate(-50%, -50%)", border:"1px solid rgba(255,255,255,0.2)" }} />
            </div>

            {/* Track Info & Visualizer */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{syncTrack.title}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>{syncTrack.artist} • {syncTrack.mood}</div>
              
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:10, color:"#ff4444", fontWeight:"bold", fontFamily:"monospace" }}>{formatTime(syncElapsed)}</span>
                <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:16, flex:1 }}>
                  {[...Array(15)].map((_, i) => (
                    <div key={i} style={{ flex:1, maxWidth:4, background:"linear-gradient(to top, #d4af37, #ff4444)", borderRadius:2, animation:`eqBar${(i%5)+1} ${(i%3)*0.2 + 0.5}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontFamily:"monospace" }}>{syncTrack.duration}</span>
              </div>
            </div>
          </div>

          <div style={{ width:"100%", background:"rgba(255,255,255,0.1)", height:3, borderRadius:3, overflow:"hidden" }}>
             <div style={{ height:"100%", background:"linear-gradient(90deg, #ff4444, #d4af37)", width: `${Math.min(100, (syncElapsed / 180) * 100)}%`, transition:"width 1s linear" }} />
          </div>

          {/* Track Picker Drawer */}
          {showTrackPicker && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, maxHeight:150, overflowY:"auto", paddingRight:4, marginTop:8, animation:"fadeIn .3s" }}>
              {SONGS.map(track => (
                <div key={track.id} onClick={() => { setSyncTrack(track); setSyncElapsed(0); setShowTrackPicker(false); }}
                  style={{ display:"flex", alignItems:"center", gap:8, padding:8, background: syncTrack.id === track.id ? "rgba(255,68,68,0.1)" : "rgba(255,255,255,0.03)", border: syncTrack.id === track.id ? "1px solid rgba(255,68,68,0.3)" : "1px solid rgba(255,255,255,0.05)", borderRadius:8, cursor:"pointer" }}>
                  <img src={track.cover || "/fake1.jpg"} alt="" style={{ width:30, height:30, borderRadius:6, objectFit:"cover" }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:600, color: syncTrack.id === track.id ? "#ff4444" : "#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{track.title}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>{track.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontStyle:"italic", textAlign:"center" }}>You and {chatUser.name} are listening together.</div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:8, background: syncActive ? "radial-gradient(circle at center, rgba(40,10,10,0.8) 0%, rgba(10,0,0,1) 100%)" : "transparent", transition:"all .5s ease" }}>
        {/* System message */}
        <div style={{ textAlign:"center", marginBottom:4 }}>
          <span style={{ background:"rgba(255,255,255,.06)", padding:"5px 14px", borderRadius:20, fontSize:11, color:"rgba(255,255,255,.35)" }}>
            🎉 You matched! Say hello
          </span>
        </div>

        {msgs.length === 0 && (
          <div style={{ textAlign:"center", padding:"30px 0", color:"rgba(255,255,255,.25)" }}>
            <div style={{ fontSize:40, marginBottom:8 }}>👋</div>
            <p style={{ fontSize:13 }}>Be the first to say hello!</p>
          </div>
        )}

        {msgs.map(msg => (
          <div key={msg.id} style={{ display:"flex", flexDirection:"column", alignItems: msg.from === "me" ? "flex-end" : "flex-start" }}>
            <div className={msg.from === "me" ? "bubble-me" : "bubble-them"}>
              {msg.text}
              <div style={{ fontSize:10, color:"rgba(255,255,255,.45)", marginTop:4, textAlign:"right" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding:"10px 14px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", gap:8, flexShrink:0, background:"rgba(8,11,18,.95)", backdropFilter:"blur(20px)" }}>
        <input className="input"
          placeholder="Type a message..." value={msgInput}
          onChange={e => setMsgInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(chatUser.id)}
          style={{ flex:1, marginBottom:0 }} />
        <button className="btn-red" style={{ padding:"12px 18px", fontSize:17, flexShrink:0 }}
          onClick={() => sendMessage(chatUser.id)}>➤</button>
      </div>
    </div>
  );
}
