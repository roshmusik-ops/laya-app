import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProfileTab() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, matches, likedIds, setShowPremium, setAdminMode, showToast } = useApp();
  const fileRef = useRef();
  if (!currentUser) return null;

  const handlePhotoChange = (e, idx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = async () => {
        // Compress image using canvas
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Get compressed base64 (jpeg, 0.7 quality)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        // Update local state
        const newPhotos = [...(currentUser.photos || ["","","",""])];
        newPhotos[idx] = compressedBase64;
        setCurrentUser(p => ({ ...p, photos: newPhotos }));
        showToast("Photo updated! 📸");

        // Sync to Firestore
        try {
          await setDoc(doc(db, "users", currentUser.id), { photos: newPhotos }, { merge: true });
        } catch (err) {
          console.error("Failed to sync photo to Firestore", err);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding:"16px", animation:"fadeIn .4s ease", maxWidth: 600, margin: "0 auto" }}>
      {/* Profile header */}
      <div style={{ textAlign:"center", padding:"20px 0" }}>
        {/* Main photo */}
        <div style={{ position:"relative", display:"inline-block", marginBottom:14 }}>
          <div style={{ width:92, height:92, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, boxShadow:"0 12px 36px rgba(255,71,87,.45)", overflow:"hidden" }}>
            {currentUser.photos?.[0] && currentUser.photos[0].length > 2
              ? <img src={currentUser.photos[0]} alt="You" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : currentUser.photos?.[0] || "👤"}
          </div>
          <button onClick={() => fileRef.current?.click()}
            style={{ position:"absolute", bottom:0, right:0, width:28, height:28, borderRadius:"50%", background:"#ff6b6b", border:"2px solid #080b12", fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>📷</button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handlePhotoChange(e, 0)} />
        </div>
        <div className="serif" style={{ fontSize:24, marginBottom:3 }}>{currentUser.name}</div>
        <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:10 }}>
          📍 {currentUser.district} · {currentUser.age || 25}y
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap" }}>
          {(currentUser.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>

      {/* Membership Card */}
      {currentUser.premium ? (
        <div style={{ background: currentUser.plan === "Platinum" ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.05))", border: currentUser.plan === "Platinum" ? "1px solid rgba(255,80,80,0.3)" : "1px solid rgba(212, 175, 55, 0.3)", borderRadius:16, padding:"16px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, borderRadius:"50%", background: currentUser.plan === "Platinum" ? "linear-gradient(135deg, #ff6b6b, #ff4757)" : "linear-gradient(135deg, #d4af37, #b8860b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow: currentUser.plan === "Platinum" ? "0 4px 12px rgba(255,107,107, 0.3)" : "0 4px 12px rgba(212, 175, 55, 0.3)" }}>👑</div>
            <div>
              <div style={{ color: currentUser.plan === "Platinum" ? "#ff6b6b" : "#d4af37", fontSize:16, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>{currentUser.plan || "Gold"} Member</div>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginTop:2, fontWeight: 300 }}>Active Subscription</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"#fcfcfc", fontSize:20, fontWeight:700 }}>
              {currentUser.premiumUntil ? Math.max(0, Math.ceil((currentUser.premiumUntil - Date.now()) / (1000 * 60 * 60 * 24))) : 30}
            </div>
            <div style={{ color: currentUser.plan === "Platinum" ? "rgba(255,107,107, 0.8)" : "rgba(212, 175, 55, 0.8)", fontSize:10, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight: 700 }}>Days Left</div>
          </div>
        </div>
      ) : (
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"16px", marginBottom:20, textAlign:"center" }}>
          <div style={{ color:"rgba(255,255,255,0.8)", fontSize:14, fontWeight:500, marginBottom:4 }}>Free Plan</div>
          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:12, marginBottom:12 }}>Upgrade to connect directly with matches.</div>
          <button onClick={() => setShowPremium(true)} style={{ background:"linear-gradient(135deg, #d4af37, #b8860b)", border:"none", borderRadius:20, padding:"8px 20px", color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>UPGRADE NOW</button>
        </div>
      )}

      {/* Photos grid */}
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", fontWeight:700, letterSpacing:1.5, marginBottom:10 }}>MY PHOTOS</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {(currentUser.photos || ["","","",""]).map((photo, i) => (
            <div key={i} className={`photo-slot ${photo ? "filled" : ""}`} style={{ minHeight:72 }}>
              {photo ? (
                <img src={photo} alt={`Photo ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0, borderRadius:12 }} />
              ) : (
                <span style={{ fontSize:18, color:"rgba(255,107,107,.4)" }}>+</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          { n: matches.length, label:"Matches" },
          { n: (likedIds||[]).length, label:"Liked" },
          { n: 0, label:"Pending" },
        ].map(s => (
          <div key={s.label} style={{ padding:"14px 10px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, textAlign:"center" }}>
            <div className="serif" style={{ fontSize:26, color:"#ff6b6b" }}>{s.n}</div>
            <div style={{ color:"rgba(255,255,255,.4)", fontSize:10, marginTop:3, fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* My Info */}
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"14px 16px", marginBottom:14 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:10, fontWeight:700, letterSpacing:1.5 }}>MY INFO</div>
        {[
          { label:"WhatsApp",   value: currentUser.whatsapp   },
          { label:"Looking For",value: currentUser.lookingFor },
          { label:"Bio",        value: currentUser.bio || "No bio yet" },
          { label:"Favorite Track / Anthem", value: currentUser.favoriteTrack ? `🎵 ${currentUser.favoriteTrack} by ${currentUser.favoriteArtist}` : "Not set" },
          { label:"Connected Music Channel", value: currentUser.musicLink ? `🎧 ${currentUser.musicLinkType}: ${currentUser.musicLink}` : "Not set" }
        ].map(item => (
          <div key={item.label} style={{ marginBottom:10, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <div style={{ color:"rgba(255,255,255,.3)", fontSize:10, fontWeight:700, marginBottom:2 }}>{item.label}</div>
            <div style={{ fontSize:13, color:"#e0dde8" }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Quick addons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:14 }}>
        <button onClick={() => alert("Please download the Android app to purchase addons via Google Play.")}
          style={{ padding:"13px 10px", borderRadius:14, background:"rgba(255,107,107,.07)", border:"1px solid rgba(255,107,107,.2)", cursor:"pointer", color:"#f0ede8", fontFamily:"Nunito,sans-serif" }}>
          <div style={{ fontSize:18, marginBottom:3 }}>🚀</div>
          <div style={{ fontWeight:800, fontSize:12 }}>Boost Profile</div>
          <div style={{ color:"#ff6b6b", fontSize:11, fontWeight:700 }}>₹19 / 24hrs</div>
        </button>
        <button onClick={() => alert("Please download the Android app to purchase addons via Google Play.")}
          style={{ padding:"13px 10px", borderRadius:14, background:"rgba(96,165,250,.07)", border:"1px solid rgba(96,165,250,.2)", cursor:"pointer", color:"#f0ede8", fontFamily:"Nunito,sans-serif" }}>
          <div style={{ fontSize:18, marginBottom:3 }}>✅</div>
          <div style={{ fontWeight:800, fontSize:12 }}>Get Verified</div>
          <div style={{ color:"#60a5fa", fontSize:11, fontWeight:700 }}>₹19 one-time</div>
        </button>
      </div>

      {/* Premium upgrade */}
      {!currentUser.premium && (
        <button className="btn-red" style={{ width:"100%", padding:"15px", fontSize:15, marginBottom:10 }}
          onClick={() => setShowPremium(true)}>
          ⭐ Upgrade to Laya Premium
        </button>
      )}

      {/* Hidden Admin Access (Only for VIPs) */}
      {["pharmalinkthrissur@gmail.com", "anoop@gmail.com", "rosh.musik@gmail.com"].includes(currentUser?.email) && (
        <button 
          onClick={() => window.location.assign("/app/admin")}
          style={{ width:"100%", padding:"15px", borderRadius:14, background:"rgba(212,175,55,0.15)", border:"1px solid rgba(212,175,55,0.4)", cursor:"pointer", color:"#d4af37", fontFamily:"Nunito,sans-serif", fontSize:14, fontWeight:700, marginBottom:10 }}>
          🔐 Open Admin Dashboard
        </button>
      )}

      {/* Community */}
      <button onClick={() => navigate("/app/community")}
        style={{ width:"100%", padding:"12px", borderRadius:50, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,.55)", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:10 }}>
        🏘️ Community Feed
      </button>



      {/* Sign out */}
      <button onClick={() => { setCurrentUser(null); navigate("/"); }}
        style={{ width:"100%", padding:"12px", borderRadius:50, background:"none", color:"rgba(255,71,87,.5)", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", border:"1px solid rgba(255,71,87,0.2)" }}>
        Sign Out
      </button>
    </div>
  );
}
