import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";

function Timer({ expiresAt }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) { setRemaining("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  const isUrgent = expiresAt - Date.now() < 3600000;
  return (
    <span style={{ fontSize:11, fontWeight:800, color: isUrgent ? "#ff4757" : "rgba(255,255,255,.4)", display:"flex", alignItems:"center", gap:3 }}>
      ⏰ {remaining}
    </span>
  );
}

export default function MatchesTab() {
  const { matches, messages, setChatUser, setActiveTab, startCall, currentUser, setShowPremium, setSelectedUser } = useApp();
  const [view, setView] = useState("matches"); // matches|chats

  const newMatches = matches.filter(m => !m.firstMessageSent);
  const chats      = matches.filter(m => m.firstMessageSent || (messages[m.id]?.length > 0));

  const lastMsg = (userId) => {
    const msgs = messages[userId] || [];
    return msgs[msgs.length - 1];
  };

  return (
    <div style={{ padding:"14px", animation:"fadeIn .4s ease" }}>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["matches","chats"].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex:1, padding:"10px", borderRadius:14, border:"none", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:14, cursor:"pointer", transition:"all .2s",
              background: view === v ? "linear-gradient(135deg,#ff6b6b,#ff4757)" : "rgba(255,255,255,.05)",
              color: view === v ? "white" : "rgba(255,255,255,.4)",
              boxShadow: view === v ? "0 4px 14px rgba(255,71,87,.35)" : "none" }}>
            {v === "matches" ? `🎉 Matches${newMatches.length > 0 ? ` (${newMatches.length})` : ""}` : `💬 Chats${chats.length > 0 ? ` (${chats.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* ── MATCHES view ── */}
      {view === "matches" && (
        <>
          {newMatches.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,.3)" }}>
              <div style={{ fontSize:56, marginBottom:14, animation:"float 3s ease-in-out infinite" }}>💫</div>
              <p style={{ fontWeight:700, fontSize:15 }}>No new matches yet</p>
              <p style={{ fontSize:13, marginTop:6 }}>Keep swiping to find your match!</p>
              <button className="btn-red" style={{ marginTop:20, padding:"11px 28px", fontSize:13 }}
                onClick={() => setActiveTab("discover")}>Go to Discover →</button>
            </div>
          ) : (
            <>
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:11, fontWeight:700, letterSpacing:1.5, marginBottom:12 }}>
                NEW MATCHES — MESSAGE BEFORE TIMER EXPIRES!
              </p>
              <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:8, marginBottom:8 }}>
                {newMatches.map(m => (
                  <div key={m.id} onClick={() => { setChatUser(m); setActiveTab("chat"); }}
                    style={{ flexShrink:0, textAlign:"center", cursor:"pointer" }}>
                    <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ffd93d)", padding:2.5, marginBottom:6 }}>
                      <div style={{ width:"100%", height:"100%", borderRadius:"50%", border:"2.5px solid #080b12", background:"#141828", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>
                        {m.photos?.[0] || "👤"}
                      </div>
                    </div>
                    <div style={{ fontSize:11, fontWeight:700, maxWidth:68, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.name.split(" ")[0]}</div>
                    <Timer expiresAt={m.expiresAt} />
                  </div>
                ))}
              </div>

              {/* Match cards */}
              <p style={{ color:"rgba(255,255,255,.35)", fontSize:11, fontWeight:700, letterSpacing:1.5, margin:"16px 0 10px" }}>
                SAY HELLO FIRST!
              </p>
              {newMatches.map(m => (
                <div key={m.id} className="user-row" onClick={() => { setChatUser(m); setActiveTab("chat"); }}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b33,#ffd93d22)", border:"2px solid rgba(255,107,107,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>
                      {m.photos?.[0] || "👤"}
                    </div>
                    {m.online && <div style={{ position:"absolute", bottom:1, right:1, width:12, height:12, borderRadius:"50%", background:"#22c55e", border:"2px solid #080b12" }} />}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:800, fontSize:14, marginBottom:2 }}>{m.name}</div>
                    <div style={{ color:"rgba(255,255,255,.4)", fontSize:11 }}>📍 {m.district}</div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <Timer expiresAt={m.expiresAt} />
                    <button className="btn-red" style={{ padding:"7px 14px", fontSize:11 }}
                      onClick={e => { e.stopPropagation(); setChatUser(m); setActiveTab("chat"); }}>
                      Say Hi 👋
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* ── CHATS view ── */}
      {view === "chats" && (
        <>
          {chats.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,.3)" }}>
              <div style={{ fontSize:52, marginBottom:14 }}>💬</div>
              <p style={{ fontWeight:700 }}>No conversations yet</p>
              <p style={{ fontSize:13, marginTop:6 }}>Match with someone and say hello!</p>
            </div>
          ) : chats.map(m => {
            const last = lastMsg(m.id);
            return (
              <div key={m.id} className="user-row" style={{ alignItems:"flex-start" }}
                onClick={() => { setChatUser(m); setActiveTab("chat"); }}>
                <div style={{ position:"relative", flexShrink:0 }}>
                  <div style={{ width:52, height:52, borderRadius:"50%", background:"rgba(34,197,94,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, border:"1px solid rgba(34,197,94,.2)" }}>
                    {m.photos?.[0] || "👤"}
                  </div>
                  {m.online && <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #080b12" }} />}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontWeight:800, fontSize:14 }}>{m.name}</span>
                    <span style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>{last?.time || ""}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {last ? (last.from === "me" ? "You: " : "") + last.text : "Send the first message!"}
                  </div>
                </div>
                {/* Call buttons */}
                <div style={{ display:"flex", gap:6, marginLeft:8 }}>
                  <button onClick={e => { e.stopPropagation(); startCall(m, "audio"); }}
                    style={{ width:34, height:34, borderRadius:"50%", background:"rgba(37,211,102,.12)", border:"1px solid rgba(37,211,102,.25)", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>📞</button>
                  <button onClick={e => { e.stopPropagation(); startCall(m, "video"); }}
                    style={{ width:34, height:34, borderRadius:"50%", background:"rgba(255,107,107,.12)", border:"1px solid rgba(255,107,107,.25)", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>📹</button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
