import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || "000000";

export default function AdminDashboard() {
  const { users, setUsers, matches, setActiveTab, showToast } = useApp();
  const [pin, setPin]         = useState("");
  const [auth, setAuth]       = useState(false);
  const [tab, setTab]         = useState("users"); // users|revenue|districts
  const [search, setSearch]   = useState("");

  const handleSeed = async () => {
    const mockProfiles = [
      {
        id: "meera_nair",
        name: "Meera Nair",
        age: 24,
        district: "Ernakulam",
        bio: "Designer & model. Love weekend beach sunsets, synth-pop, and exploring high-end cafes in Kochi. Let's vibe!",
        photos: ["https://keralameet-kquef6rag.vercel.app/girl1.png", "", "", ""],
        tags: ["Art", "Design", "Music"],
        gender: "Female",
        lookingFor: "Romantic Connection",
        verified: true,
        premium: true,
        online: true,
        whatsapp: "+919846200111",
        mode: "date",
        joined: new Date().toISOString(),
        status: "approved",
        favoriteTrack: "Starboy",
        favoriteArtist: "The Weeknd"
      },
      {
        id: "sneha_kurian",
        name: "Sneha Kurian",
        age: 22,
        district: "Kottayam",
        bio: "Aesthetic wanderer & classical dancer. Let's share long drives, lofi music sessions, and deep conversations.",
        photos: ["https://keralameet-kquef6rag.vercel.app/girl2.png", "", "", ""],
        tags: ["Dance", "Coffee", "Wanderlust"],
        gender: "Female",
        lookingFor: "Friends & Social Circle",
        verified: true,
        premium: false,
        online: true,
        whatsapp: "+919447180222",
        mode: "date",
        joined: new Date().toISOString(),
        status: "approved",
        favoriteTrack: "Lo-Fi Nights",
        favoriteArtist: "Bensound"
      },
      {
        id: "rahul_menon_curated",
        name: "Rahul Menon",
        age: 28,
        district: "Kozhikode",
        bio: "Co-founder & creative director. Exploring new visual media and lofi music aesthetics. Reconnecting with Kerala vibes.",
        photos: ["https://keralameet-kquef6rag.vercel.app/boy1.png", "", "", ""],
        tags: ["Founder", "Art", "Lofi"],
        gender: "Male",
        lookingFor: "Social Circle",
        verified: true,
        premium: true,
        online: true,
        whatsapp: "+919876543210",
        mode: "network",
        joined: new Date().toISOString(),
        status: "approved",
        favoriteTrack: "After Hours",
        favoriteArtist: "The Weeknd"
      }
    ];

    try {
      for (const profile of mockProfiles) {
        await setDoc(doc(db, "users", profile.id), profile);
      }
      showToast("Successfully seeded premium profiles! 🔥");
    } catch (error) {
      console.error(error);
      showToast("Seeding failed: " + error.message, "error");
    }
  };

  const DISTRICTS = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"];

  const premiumUsers   = users.filter(u => u.premium);
  const verifiedUsers  = users.filter(u => u.verified);
  const onlineUsers    = users.filter(u => u.online);
  const pendingUsers   = users.filter(u => u.status === "pending");
  const approvedUsers  = users.filter(u => u.status !== "pending");
  const revenue        = premiumUsers.length * 29;

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.district?.toLowerCase().includes(search.toLowerCase())) &&
    (tab === "applications" ? u.status === "pending" : u.status !== "pending")
  );

  if (!auth) return (
    <div className="app-wrap" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:"0 32px" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:44, marginBottom:10 }}>🔐</div>
        <div className="serif" style={{ fontSize:24 }}>Admin Login</div>
        <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginTop:4 }}>Enter your admin PIN to continue</p>
      </div>
      <input className="input" type="password" placeholder="Admin PIN" value={pin}
        onChange={e => setPin(e.target.value)} maxLength={6} style={{ textAlign:"center", fontSize:22, letterSpacing:8 }}
        onKeyDown={e => e.key === "Enter" && (pin === ADMIN_PIN ? setAuth(true) : showToast("Wrong PIN!", "error"))} />
      <button className="btn-red" style={{ width:"100%", padding:"15px", fontSize:15, marginTop:4 }}
        onClick={() => pin === ADMIN_PIN ? setAuth(true) : showToast("Wrong PIN!", "error")}>
        Login →
      </button>
      <button onClick={() => setActiveTab("profile")} style={{ marginTop:16, background:"none", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:13 }}>← Back</button>
    </div>
  );

  return (
    <div style={{ padding:"14px", animation:"fadeIn .4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <button onClick={() => { setAuth(false); setActiveTab("profile"); }}
          style={{ background:"none", border:"none", color:"rgba(255,255,255,.4)", fontSize:20, cursor:"pointer" }}>←</button>
        <div className="serif" style={{ fontSize:22 }}>Admin <span className="glow">Dashboard</span></div>
        <button onClick={handleSeed}
          style={{ marginLeft: "auto", background: "rgba(212, 175, 55, 0.15)", border: "1px solid rgba(212, 175, 55, 0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 11, fontWeight: 500, color: "#d4af37", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all .3s ease" }}>
          Seed Profiles
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
        {[
          { n: approvedUsers.length, label:"Total Users",  icon:"👥", color:"#ff6b6b" },
          { n: pendingUsers.length,  label:"Applications", icon:"⏳", color:"#fbbf24" },
          { n: verifiedUsers.length, label:"Verified",icon:"✅", color:"#22c55e" },
          { n: premiumUsers.length,  label:"Premium", icon:"⭐", color:"#ffd93d" },
          { n: onlineUsers.length,   label:"Online",  icon:"🟢", color:"#22c55e" },
          { n: matches.length,  label:"Matches",      icon:"💕", color:"#f472b6" },
        ].map(s => (
          <div key={s.label} style={{ padding:"16px 14px", background:"rgba(255,255,255,.03)", border:`1px solid ${s.color}22`, borderRadius:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div className="serif" style={{ fontSize:30, color:s.color }}>{s.n}</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:11, fontWeight:700, marginTop:3 }}>{s.label}</div>
              </div>
              <span style={{ fontSize:22 }}>{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue card */}
      <div style={{ padding:"16px 18px", background:"linear-gradient(135deg,rgba(255,107,107,.1),rgba(255,71,87,.04))", border:"1px solid rgba(255,107,107,.2)", borderRadius:16, marginBottom:16 }}>
        <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", fontWeight:700, letterSpacing:1.5, marginBottom:6 }}>RAZORPAY REVENUE THIS MONTH</div>
        <div className="serif" style={{ fontSize:36, color:"#ff6b6b" }}>₹{revenue.toLocaleString()}</div>
        <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginTop:3 }}>{premiumUsers.length} premium × ₹29 + add-ons</div>
        <a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer"
          style={{ display:"inline-block", marginTop:10, padding:"6px 16px", borderRadius:20, background:"rgba(255,107,107,.15)", border:"1px solid rgba(255,107,107,.3)", color:"#ff9a9a", fontSize:12, fontWeight:700 }}>
          Open Razorpay Dashboard →
        </a>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:7, marginBottom:14 }}>
        {["users","applications","districts","revenue"].map(t => (
          <button key={t} className={`chip ${tab===t?"active":""}`} onClick={() => setTab(t)}
            style={{ flex:1, textAlign:"center", textTransform:"capitalize", position:"relative" }}>
            {t}
            {t === "applications" && pendingUsers.length > 0 && (
              <span style={{ position:"absolute", top:-4, right:-4, background:"#ff6b6b", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:10 }}>{pendingUsers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Users / Applications tab */}
      {(tab === "users" || tab === "applications") && (
        <>
          <input className="input" placeholder="🔍 Search users..." value={search}
            onChange={e => setSearch(e.target.value)} style={{ marginBottom:10 }} />
          {filtered.length === 0 && <div style={{textAlign:"center", color:"rgba(255,255,255,.3)", padding:"20px"}}>No users found.</div>}
          {filtered.map(u => (
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 13px", borderRadius:13, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", marginBottom:7 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                {u.photos?.[0] || "👤"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:13 }}>{u.name}</span>
                  {u.verified && <span style={{ fontSize:10 }}>✅</span>}
                  {u.premium  && <span style={{ fontSize:10 }}>⭐</span>}
                  {u.online   && <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />}
                </div>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{u.district} · {u.joined}</div>
              </div>
              <div style={{ display:"flex", gap:5 }}>
                {tab === "applications" ? (
                  <button onClick={async () => {
                    try {
                      await updateDoc(doc(db, "users", u.id), { status: "approved" });
                      showToast(`${u.name} Approved! ✅`);
                    } catch (err) {
                      showToast("Approval failed: " + err.message, "error");
                    }
                  }}
                    style={{ padding:"4px 9px", borderRadius:12, background:"rgba(212, 175, 55, 0.12)", border:"1px solid rgba(212, 175, 55, 0.25)", color:"#d4af37", cursor:"pointer", fontSize:10, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>Approve</button>
                ) : (
                  <>
                    {!u.verified && (
                      <button onClick={async () => {
                        try {
                          await updateDoc(doc(db, "users", u.id), { verified: true });
                          showToast(`${u.name} verified ✅`);
                        } catch (err) {
                          showToast("Verification failed: " + err.message, "error");
                        }
                      }}
                        style={{ padding:"4px 9px", borderRadius:12, background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.25)", color:"#22c55e", cursor:"pointer", fontSize:10, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>Verify</button>
                    )}
                    <button onClick={async () => {
                      try {
                        await deleteDoc(doc(db, "users", u.id));
                        showToast(`${u.name} removed`);
                      } catch (err) {
                        showToast("Removal failed: " + err.message, "error");
                      }
                    }}
                      style={{ padding:"4px 9px", borderRadius:12, background:"rgba(255,71,87,.1)", border:"1px solid rgba(255,71,87,.2)", color:"#ff4757", cursor:"pointer", fontSize:10, fontWeight:700, fontFamily:"Nunito,sans-serif" }}>Remove</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Districts tab */}
      {tab === "districts" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
          {DISTRICTS.map(d => {
            const count = users.filter(u => u.district === d).length;
            return (
              <div key={d} style={{ padding:"13px 14px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:13 }}>
                <div style={{ fontWeight:700, fontSize:12, marginBottom:3 }}>📍 {d}</div>
                <div className="serif" style={{ color:"#ff6b6b", fontSize:20 }}>{count}</div>
                <div style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>members</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue tab */}
      {tab === "revenue" && (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ fontSize:44, marginBottom:14 }}>📊</div>
          <p style={{ fontWeight:700, marginBottom:8 }}>Full analytics in Razorpay Dashboard</p>
          <p style={{ color:"rgba(255,255,255,.35)", fontSize:13, marginBottom:20 }}>Connect your Razorpay account to see payment history, subscriptions, and refunds in real-time.</p>
          <a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer" className="btn-red"
            style={{ padding:"12px 28px", fontSize:14, display:"inline-block" }}>
            Open Razorpay Dashboard →
          </a>
        </div>
      )}
    </div>
  );
}
