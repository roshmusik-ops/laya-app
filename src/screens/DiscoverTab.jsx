import { useState, useRef } from "react";
import { useApp } from "../contexts/AppContext";

const SWIPE_THRESHOLD = 80;

export default function DiscoverTab() {
  const { discoverUsers, handleSwipeRight, handleSwipeLeft, setSelectedUser, setShowConnect, currentUser, setShowPremium } = useApp();
  const [photoIdx, setPhotoIdx]   = useState({});
  const [dragStart, setDragStart] = useState(null);
  const [dragX, setDragX]         = useState(0);
  const [animating, setAnimating] = useState(null); // "left"|"right"
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [filterMode, setFilterMode]         = useState("All");
  const cardRef = useRef();

  const DISTRICTS = ["All","Ernakulam","Thrissur","Kozhikode","Thiruvananthapuram","Palakkad","Kannur","Kottayam","Malappuram"];
  const MODES     = ["All","date","intimacy","friends","network"];

  const filtered = discoverUsers.filter(u =>
    (filterDistrict === "All" || u.district === filterDistrict) &&
    (filterMode     === "All" || u.mode     === filterMode)
  );

  const top = filtered[0];

  const photos = (user) => (user?.photos || []).filter(Boolean);

  const onDragStart = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setDragStart(x);
    setDragX(0);
  };
  const onDragMove = (e) => {
    if (dragStart === null) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - dragStart;
    setDragX(x);
  };
  const onDragEnd = () => {
    if (Math.abs(dragX) >= SWIPE_THRESHOLD && top) {
      const dir = dragX > 0 ? "right" : "left";
      setAnimating(dir);
      setTimeout(() => {
        dir === "right" ? handleSwipeRight(top) : handleSwipeLeft(top);
        setAnimating(null);
        setDragX(0);
        setDragStart(null);
        setPhotoIdx({});
      }, 350);
    } else {
      setDragX(0);
      setDragStart(null);
    }
  };

  const swipeCard = (dir) => {
    if (!top) return;
    setAnimating(dir);
    setTimeout(() => {
      dir === "right" ? handleSwipeRight(top) : handleSwipeLeft(top);
      setAnimating(null); setPhotoIdx({});
    }, 350);
  };

  const rotation = dragX * 0.08;
  const opacity  = Math.max(0, 1 - Math.abs(dragX) / 200);

  return (
    <div style={{ padding:"12px 14px", animation:"fadeIn .4s ease" }}>

      {/* Filters */}
      <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:8, marginBottom:8 }}>
        {DISTRICTS.map(d => (
          <button key={d} className={`chip ${filterDistrict===d?"active":""}`}
            onClick={() => setFilterDistrict(d)}>
            {d === "All" ? "🌴 All Kerala" : d}
          </button>
        ))}
      </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:12, marginTop:24, msOverflowStyle:"none", scrollbarWidth:"none" }}>
          {MODES.map(m => (
            <button key={m} onClick={() => setFilterMode(m)}
              style={{
                background: filterMode === m ? "linear-gradient(135deg, #d4af37, #b8860b)" : "rgba(255,255,255,.05)",
                color: filterMode === m ? "#fff" : "rgba(255,255,255,0.7)",
                border: filterMode === m ? "none" : "1px solid rgba(255,255,255,.1)",
                padding:"6px 16px", borderRadius:20, fontSize:13, fontWeight:500, cursor:"pointer",
                whiteSpace:"nowrap", transition:"all .3s"
              }}>
              {m === "All" ? "All Vibes" : m === "date" ? "Date" : m === "intimacy" ? "Intimacy" : m === "friends" ? "Social" : "Network"}
            </button>
          ))}
        </div>

      {/* Swipe Deck */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(255,255,255,.3)" }}>
          <div style={{ fontSize:48, marginBottom:24, opacity: 0.5, animation:"float 4s ease-in-out infinite" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
          </div>
          <p style={{ fontSize:16, fontWeight:300, letterSpacing:"0.05em", color: "rgba(255,255,255,0.7)" }}>No more profiles available.</p>
          <p style={{ fontSize:12, marginTop:12, fontWeight:300, color: "rgba(255,255,255,0.4)" }}>Please check back later.</p>
        </div>
      ) : (
        <div style={{ position:"relative", height:540, marginBottom:24, maxWidth: 400, margin: "0 auto" }}>
          {/* Background card */}
          {filtered[1] && (
            <div style={{ position:"absolute", inset:0, borderRadius:20, overflow:"hidden", transform:"scale(.95) translateY(12px)", opacity:.4, zIndex:1 }}>
              <div style={{ height:"100%", background:"linear-gradient(180deg,rgba(255,255,255,.05),rgba(5,5,5,1))", border:"1px solid rgba(255,255,255,.05)", borderRadius:20 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"55%", fontSize:64, opacity: 0.2 }}>{filtered[1].photos?.[0] || "👤"}</div>
              </div>
            </div>
          )}

          {/* Top swipe card */}
          {top && (
            <div
              ref={cardRef}
              className={`swipe-card ${animating === "left" ? "animating-left" : animating === "right" ? "animating-right" : ""}`}
              style={{
                zIndex:2, height:500, cursor:"grab",
                transform: animating ? undefined : `translateX(${dragX}px) rotate(${rotation}deg)`,
                transition: dragStart ? "none" : "transform .2s ease",
              }}
              onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}
              onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>

              {/* Photo */}
              <div style={{ position:"relative", height:"100%", background:"#0c0c0e", borderRadius:20, overflow:"hidden", border:"1px solid rgba(255,255,255,.08)" }}>
                {/* Photo carousel */}
                <div style={{ position:"absolute", inset:0 }}>
                  {photos(top).length > 0 ? (
                    photos(top)[photoIdx[top.id] || 0].length > 2 ? (
                      <img src={photos(top)[photoIdx[top.id] || 0]} alt={top.name}
                        style={{ width:"100%", height:"100%", objectFit:"cover", filter: "brightness(0.8) contrast(1.1)" }} draggable={false} />
                    ) : (
                      <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:120, background:"linear-gradient(180deg,rgba(255,255,255,.05),rgba(5,5,5,.9))" }}>
                        {photos(top)[photoIdx[top.id] || 0]}
                      </div>
                    )
                  ) : (
                    <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:120, background:"linear-gradient(180deg,rgba(255,255,255,.05),rgba(5,5,5,.9))" }}>
                      👤
                    </div>
                  )}
                </div>

                {/* Photo navigation dots */}
                {photos(top).length > 1 && (
                  <div style={{ position:"absolute", top:16, left:0, right:0, display:"flex", justifyContent:"center", gap:6, zIndex:3 }}>
                    {photos(top).map((_,i) => (
                      <div key={i} onClick={e => { e.stopPropagation(); setPhotoIdx(p => ({...p, [top.id]: i})); }}
                        style={{ height:2, borderRadius:2, background: (photoIdx[top.id]||0)===i ? "#fcfcfc" : "rgba(255,255,255,.3)", width: (photoIdx[top.id]||0)===i ? 24 : 12, transition:"all .4s ease", cursor:"pointer" }} />
                    ))}
                  </div>
                )}

                {/* Photo nav tap areas */}
                <div style={{ position:"absolute", top:0, left:0, width:"40%", height:"75%", zIndex:3 }}
                  onClick={e => { e.stopPropagation(); setPhotoIdx(p => ({...p, [top.id]: Math.max(0,(p[top.id]||0)-1)})); }} />
                <div style={{ position:"absolute", top:0, right:0, width:"40%", height:"75%", zIndex:3 }}
                  onClick={e => { e.stopPropagation(); setPhotoIdx(p => ({...p, [top.id]: Math.min(photos(top).length-1,(p[top.id]||0)+1)})); }} />

                {/* Swipe indicators */}
                {dragX > 40 && (
                  <div style={{ position:"absolute", top:32, left:24, border:"1px solid rgba(255,255,255,0.8)", borderRadius:8, padding:"6px 16px", transform:"rotate(-15deg)", zIndex:4, backdropFilter:"blur(10px)" }}>
                    <span style={{ color:"#fcfcfc", fontWeight:500, fontSize:18, letterSpacing:"0.1em" }}>PASS</span>
                  </div>
                )}
                {dragX < -40 && (
                  <div style={{ position:"absolute", top:32, right:24, border:"1px solid rgba(212, 175, 55, 0.8)", borderRadius:8, padding:"6px 16px", transform:"rotate(15deg)", zIndex:4, backdropFilter:"blur(10px)", background: "rgba(212, 175, 55, 0.1)" }}>
                    <span style={{ color:"#d4af37", fontWeight:500, fontSize:18, letterSpacing:"0.1em" }}>APPROVE</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60%", background:"linear-gradient(transparent 0%, rgba(5,5,5,0.8) 50%, rgba(5,5,5,1) 100%)", zIndex:2 }} />

                {/* Card info */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 24px", zIndex:3 }}>
                  <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:8 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span className="serif" style={{ fontSize:28, fontWeight:400, color:"#fcfcfc" }}>{top.name}, {top.age}</span>
                        {top.verified && <span style={{ color:"#a1a1aa" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></span>}
                        {top.premium  && <span style={{ color:"#d4af37" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>}
                      </div>
                      <div style={{ color:"rgba(255,255,255,.5)", fontSize:12, marginTop:4, fontWeight: 300, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {top.district} · {top.mode === "date" ? "Date" : top.mode === "intimacy" ? "Intimacy" : top.mode === "friends" ? "Social" : "Network"}
                      </div>
                      {top.favoriteTrack && (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(212, 175, 55, 0.12)", border:"1px solid rgba(212, 175, 55, 0.25)", borderRadius:12, padding:"4px 10px", marginTop:8, fontSize:11, fontWeight:500, color:"#d4af37", letterSpacing:"0.02em" }}>
                          <span style={{ fontSize:10 }}>🎵 Anthem:</span>
                          <span style={{ color:"#fff" }}>{top.favoriteTrack}</span>
                          <span style={{ opacity:0.6 }}>by {top.favoriteArtist}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={e => { e.stopPropagation(); setSelectedUser(top); }}
                      style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,0.7)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.3s ease" }}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.1)"}
                      onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.05)"}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </button>
                  </div>
                  <p style={{ color:"rgba(255,255,255,.6)", fontSize:13, lineHeight:1.6, marginBottom:16, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", fontWeight:300 }}>{top.bio}</p>
                  <div style={{ marginBottom:20 }}>{(top.tags||[]).map(t => <span key={t} className="tag">{t}</span>)}</div>

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:16, justifyContent:"center" }}>
                    <button onClick={() => swipeCard("left")}
                      style={{ width:56, height:56, borderRadius:"50%", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,0.6)", cursor:"pointer", transition:"all .3s ease", display:"flex", alignItems:"center", justifyContent:"center" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.08)"; e.currentTarget.style.color="#fcfcfc"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.03)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <button onClick={() => { if (!currentUser?.premium) { setShowPremium(true); return; } }}
                      style={{ width:44, height:44, borderRadius:"50%", background:"rgba(212, 175, 55, 0.1)", border:"1px solid rgba(212, 175, 55, 0.3)", color:"#d4af37", cursor:"pointer", alignSelf:"center", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s ease" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(212, 175, 55, 0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(212, 175, 55, 0.1)"}
                      title="SuperConnect">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>

                    <button onClick={() => swipeCard("right")}
                      style={{ width:56, height:56, borderRadius:"50%", background:"rgba(212, 175, 55, 0.1)", border:"1px solid rgba(212, 175, 55, 0.5)", color:"#d4af37", cursor:"pointer", transition:"all .3s ease", display:"flex", alignItems:"center", justifyContent:"center" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(212, 175, 55, 0.2)"; e.currentTarget.style.transform="scale(1.05)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(212, 175, 55, 0.1)"; e.currentTarget.style.transform="scale(1)"; }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <p style={{ textAlign:"center", color:"rgba(255,255,255,.2)", fontSize:11 }}>
        Drag or tap ✗ / ❤️ to swipe · Tap ℹ️ for full profile
      </p>
    </div>
  );
}
