import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { db } from "../firebase";
import { doc, setDoc, deleteDoc, updateDoc, collection, query, where, onSnapshot, getDocs } from "firebase/firestore";


const ADMIN_PIN = "9191";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const { users, setUsers, matches, currentUser, showToast } = useApp();
  const [pin, setPin]             = useState("");
  const [pinError, setPinError]   = useState("");
  // Check if already authenticated this session
  const [pinAuth, setPinAuth]     = useState(() => sessionStorage.getItem("laya_admin_auth") === "yes");
  const [tab, setTab]             = useState("users");
  const [search, setSearch]       = useState("");
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [manualEmail, setManualEmail]         = useState("");
  const [manualPlan, setManualPlan]           = useState("Gold");
  const [manualDays, setManualDays]           = useState(30);
  const [manualLoading, setManualLoading]     = useState(false);

  const handleManualActivate = async () => {
    if (!manualEmail.trim()) { showToast("Enter user email", "error"); return; }
    setManualLoading(true);
    try {
      // Find user by email in Firestore
      const q = query(collection(db, "users"), where("email", "==", manualEmail.trim().toLowerCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        showToast(`No user found with email: ${manualEmail}`, "error");
        setManualLoading(false);
        return;
      }
      const userDoc = snap.docs[0];
      const now = Date.now();
      await updateDoc(doc(db, "users", userDoc.id), {
        premium: true,
        plan: manualPlan,
        premiumUntil: now + manualDays * 24 * 60 * 60 * 1000,
        activatedAt: now,
        activatedBy: "admin"
      });
      showToast(`✅ ${manualEmail} activated as ${manualPlan} for ${manualDays} days!`, "success");
      setManualEmail("");
    } catch (err) {
      showToast("Failed: " + err.message, "error");
    }
    setManualLoading(false);
  };


  const handlePinSubmit = () => {
    if (pin.toLowerCase() === ADMIN_PIN) {
      sessionStorage.setItem("laya_admin_auth", "yes");
      setPinAuth(true);
      setPinError("");
    } else {
      setPinError("Wrong PIN. Try again.");
      setPin("");
    }
  };


  // ── Real-time listener for activation requests ─────────────────────────
  useEffect(() => {
    if (!pinAuth) return;
    const q = query(collection(db, "activation_requests"), where("status", "==", "pending"));
    const unsub = onSnapshot(q, snap => {
      const reqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPaymentRequests(reqs);
      // Toast when a NEW request arrives (after initial load)
      if (reqs.length > 0) {
        showToast(`💰 ${reqs.length} pending payment request${reqs.length > 1 ? 's' : ''}!`);
      }
    });
    return () => unsub();
  }, [pinAuth]);

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
      },
      {
        id: "arun_varghese",
        name: "Arun Varghese",
        age: 31,
        district: "Thiruvananthapuram",
        bio: "Senior Architect working in Trivandrum. Genuine, easy-going, and passionate about minimal design and late-night drives. Looking for a real connection.",
        photos: ["https://keralameet-kquef6rag.vercel.app/boy1.png", "", "", ""],
        tags: ["Design", "Travel", "Movies"],
        gender: "Male",
        lookingFor: "Romantic Connection",
        verified: true,
        premium: true,
        online: true,
        whatsapp: "+919988776655",
        mode: "date",
        joined: new Date().toISOString(),
        status: "approved",
        favoriteTrack: "Sky Full of Stars",
        favoriteArtist: "Coldplay"
      },
      {
        id: "priya_fake_age",
        name: "Priya Nair",
        age: 45,
        district: "Ernakulam",
        bio: "Entered my birth year wrong, I am actually 24! 😂 Love cafe hopping, styling, and meeting new people.",
        photos: ["https://keralameet-kquef6rag.vercel.app/girl1.png", "", "", ""],
        tags: ["Fashion", "Foodie", "Fun"],
        gender: "Female",
        lookingFor: "Friends & Social Circle",
        verified: false,
        premium: false,
        online: true,
        whatsapp: "+918877665544",
        mode: "friends",
        joined: new Date().toISOString(),
        status: "approved",
        favoriteTrack: "Espresso",
        favoriteArtist: "Sabrina Carpenter"
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

  const safeUsers = users || [];
  const safeMatches = matches || [];

  const premiumUsers   = safeUsers.filter(u => u?.premium);
  const verifiedUsers  = safeUsers.filter(u => u?.verified);
  const onlineUsers    = safeUsers.filter(u => u?.online);
  const pendingUsers   = safeUsers.filter(u => u?.status === "pending");
  const approvedUsers  = safeUsers.filter(u => u?.status !== "pending");
  const revenue        = premiumUsers.length * 29;

  const filtered = safeUsers.filter(u =>
    ((u?.name || "").toLowerCase().includes((search || "").toLowerCase()) ||
    (u?.district || "").toLowerCase().includes((search || "").toLowerCase())) &&
    (tab === "applications" ? u?.status === "pending" : u?.status !== "pending")
  );

  // ── PIN Gate ────────────────────────────────────────────────
  if (!pinAuth) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", padding:"0 32px", textAlign:"center" }}>
      <div style={{ fontSize:48, marginBottom:16 }}>🔐</div>
      <div className="serif" style={{ fontSize:22, marginBottom:8 }}>Admin Access</div>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:24 }}>Enter your admin PIN to continue.</p>
      <input
        type="password"
        className="input"
        placeholder="Enter PIN"
        value={pin}
        onChange={e => { setPin(e.target.value); setPinError(""); }}
        onKeyDown={e => e.key === "Enter" && handlePinSubmit()}
        style={{ textAlign:"center", letterSpacing:"0.2em", marginBottom:12, maxWidth:220 }}
        autoFocus
      />
      {pinError && <p style={{ color:"#ff4757", fontSize:12, marginBottom:12 }}>{pinError}</p>}
      <button className="btn-red" onClick={handlePinSubmit} style={{ padding:"12px 32px", fontSize:14 }}>Unlock Dashboard</button>
      <button onClick={() => navigate("/app/profile")} style={{ marginTop:16, background:"none", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:13 }}>← Go Back</button>
    </div>
  );

  return (
    <div style={{ padding:"14px", animation:"fadeIn .4s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <button onClick={() => { setAuth(false); navigate("/app/profile"); }}
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
          { n: safeMatches.length,  label:"Matches",      icon:"💕", color:"#f472b6" },
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
      <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
        {["users","applications","payments","districts","revenue"].map(t => (
          <button key={t} className={`chip ${tab===t?"active":""}`} onClick={() => setTab(t)}
            style={{ flex:1, textAlign:"center", textTransform:"capitalize", position:"relative", minWidth:60 }}>
            {t}
            {t === "applications" && pendingUsers.length > 0 && (
              <span style={{ position:"absolute", top:-4, right:-4, background:"#ff6b6b", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:10 }}>{pendingUsers.length}</span>
            )}
            {t === "payments" && paymentRequests.length > 0 && (
              <span style={{ position:"absolute", top:-4, right:-4, background:"#22c55e", color:"#fff", fontSize:9, fontWeight:700, padding:"2px 5px", borderRadius:10 }}>{paymentRequests.length}</span>
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
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0, overflow:"hidden" }}>
                {u.photos?.[0] ? <img src={u.photos[0]} alt={u.name} style={{width:"100%", height:"100%", objectFit:"cover"}} /> : "👤"}
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

      {/* Payments tab — manual activation + pending requests */}
      {tab === "payments" && (
        <div>
          {/* Manual Activate Section */}
          <div style={{ padding:"16px", borderRadius:14, background:"rgba(212,175,55,.06)", border:"1px solid rgba(212,175,55,.2)", marginBottom:16 }}>
            <div style={{ fontSize:11, color:"#d4af37", fontWeight:700, letterSpacing:1.2, marginBottom:12 }}>⚡ MANUAL ACTIVATE USER</div>
            <input
              className="input"
              placeholder="User email (e.g. user@gmail.com)"
              value={manualEmail}
              onChange={e => setManualEmail(e.target.value)}
              style={{ marginBottom:10 }}
            />
            <div style={{ display:"flex", gap:8, marginBottom:12 }}>
              <select
                value={manualPlan}
                onChange={e => setManualPlan(e.target.value)}
                style={{ flex:1, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.12)", color:"#fcfcfc", fontFamily:"Nunito,sans-serif", fontSize:13 }}
              >
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
              <select
                value={manualDays}
                onChange={e => setManualDays(Number(e.target.value))}
                style={{ flex:1, padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.12)", color:"#fcfcfc", fontFamily:"Nunito,sans-serif", fontSize:13 }}
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days</option>
                <option value={180}>180 Days</option>
                <option value={365}>1 Year</option>
              </select>
            </div>
            <button
              onClick={handleManualActivate}
              disabled={manualLoading}
              style={{ width:"100%", padding:"12px", borderRadius:10, background:"rgba(34,197,94,.15)", border:"1px solid rgba(34,197,94,.35)", color:"#22c55e", cursor: manualLoading ? "not-allowed" : "pointer", fontSize:13, fontWeight:700 }}
            >
              {manualLoading ? "Activating..." : "✅ Activate This User"}
            </button>
          </div>

          {/* Pending activation requests from Firebase */}
          {paymentRequests.length === 0 ? (
            <div style={{ textAlign:"center", color:"rgba(255,255,255,.3)", padding:"20px 0" }}>
              <div style={{ fontSize:13 }}>No pending automatic requests</div>
            </div>
          ) : paymentRequests.map(req => (
            <div key={req.id} style={{ padding:"14px", borderRadius:14, background:"rgba(34,197,94,.05)", border:"1px solid rgba(34,197,94,.2)", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:12, marginBottom:5, wordBreak:"break-all" }}>📧 {req.email}</div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
                    <span style={{ background:"rgba(212,175,55,.15)", border:"1px solid rgba(212,175,55,.3)", color:"#d4af37", padding:"2px 8px", borderRadius:20, fontSize:10, fontWeight:700 }}>⭐ {req.plan}</span>
                    <span style={{ background:"rgba(255,255,255,.05)", color:"rgba(255,255,255,.4)", padding:"2px 8px", borderRadius:20, fontSize:10 }}>{req.durationDays}d</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,.3)", fontSize:10 }}>
                    🕐 {new Date(req.requestedAt).toLocaleString('en-IN')}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                  <button onClick={async () => {
                    try {
                      const now = Date.now();
                      await updateDoc(doc(db, "users", req.uid), {
                        premium: true, plan: req.plan,
                        premiumUntil: now + req.durationDays * 24 * 60 * 60 * 1000
                      });
                      await updateDoc(doc(db, "activation_requests", req.id), { status:"approved", approvedAt: now });
                      showToast(`✅ ${req.email} activated as ${req.plan}!`, "success");
                    } catch(err) { showToast("Failed: " + err.message, "error"); }
                  }} style={{ padding:"7px 14px", borderRadius:10, background:"rgba(34,197,94,.15)", border:"1px solid rgba(34,197,94,.35)", color:"#22c55e", cursor:"pointer", fontSize:11, fontWeight:700 }}>
                    ✅ Approve
                  </button>
                  <button onClick={async () => {
                    try {
                      await updateDoc(doc(db, "activation_requests", req.id), { status:"rejected", rejectedAt: Date.now() });
                      showToast(`❌ Request from ${req.email} rejected.`);
                    } catch(err) { showToast("Failed: " + err.message, "error"); }
                  }} style={{ padding:"7px 14px", borderRadius:10, background:"rgba(255,71,87,.1)", border:"1px solid rgba(255,71,87,.25)", color:"#ff4757", cursor:"pointer", fontSize:11, fontWeight:700 }}>
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
