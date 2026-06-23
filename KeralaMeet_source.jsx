import { useState, useEffect, useRef } from "react";

// ── MOCK DATA ──────────────────────────────────────────────────
const MOCK_USERS = [
  { id: 1, name: "Arjun Nair", age: 26, district: "Ernakulam", interest: "Trekking & Music", bio: "Software engineer who loves weekend treks and indie music. Looking for adventure buddies!", avatar: "👨", verified: true, premium: true, online: true, joined: "2 days ago", whatsapp: "+91 98765 43210", tags: ["Trekking", "Music", "Travel"], gender: "Male", lookingFor: "Friends & Activity Partners" },
  { id: 2, name: "Meera Krishnan", age: 24, district: "Thrissur", interest: "Art & Food", bio: "Passionate artist and foodie. Let's explore Kerala's hidden cafes and art spots together!", avatar: "👩", verified: true, premium: false, online: true, joined: "5 days ago", whatsapp: "+91 87654 32109", tags: ["Art", "Food", "Photography"], gender: "Female", lookingFor: "Friends & Social Circle" },
  { id: 3, name: "Rahul Menon", age: 29, district: "Kozhikode", interest: "Cricket & Movies", bio: "NRI returned from Dubai. Reconnecting with Kerala. Love cricket, Malayalam movies and good conversation.", avatar: "🧑", verified: true, premium: true, online: false, joined: "1 week ago", whatsapp: "+91 76543 21098", tags: ["Cricket", "Movies", "NRI"], gender: "Male", lookingFor: "Social Circle" },
  { id: 4, name: "Divya Pillai", age: 22, district: "Thiruvananthapuram", interest: "Dance & Yoga", bio: "Classical dancer and yoga instructor. Looking for like-minded souls for morning yoga sessions!", avatar: "🧕", verified: true, premium: false, online: true, joined: "3 days ago", whatsapp: "+91 65432 10987", tags: ["Dance", "Yoga", "Wellness"], gender: "Female", lookingFor: "Activity Partners" },
  { id: 5, name: "Vishnu Raj", age: 31, district: "Palakkad", interest: "Cycling & Nature", bio: "Cycling enthusiast. Done 500+ km rides across Kerala. Looking for cycling partners and nature lovers.", avatar: "👨‍🦱", verified: true, premium: true, online: true, joined: "1 day ago", whatsapp: "+91 54321 09876", tags: ["Cycling", "Nature", "Adventure"], gender: "Male", lookingFor: "Activity Partners" },
  { id: 6, name: "Anjali Thomas", age: 27, district: "Kottayam", interest: "Books & Coffee", bio: "Bibliophile and coffee addict. Run a small book club in Kottayam. Always looking for reading buddies!", avatar: "👩‍🦰", verified: false, premium: false, online: false, joined: "2 weeks ago", whatsapp: "+91 43210 98765", tags: ["Books", "Coffee", "Writing"], gender: "Female", lookingFor: "Friends & Study Buddies" },
  { id: 7, name: "Sreekanth K", age: 33, district: "Kannur", interest: "Music & Football", bio: "Guitar player and football coach. Looking for bandmates and football teammates in Kannur.", avatar: "🧔", verified: true, premium: false, online: true, joined: "4 days ago", whatsapp: "+91 32109 87654", tags: ["Music", "Football", "Sports"], gender: "Male", lookingFor: "Activity Partners" },
  { id: 8, name: "Lakshmi Nambiar", age: 25, district: "Malappuram", interest: "Travel & Photography", bio: "Travel blogger capturing God's Own Country. Join me on weekend photo walks!", avatar: "👩‍🦱", verified: true, premium: true, online: true, joined: "6 days ago", whatsapp: "+91 21098 76543", tags: ["Travel", "Photography", "Blogging"], gender: "Female", lookingFor: "Travel Companions" },
];

const districts = ["All Kerala", "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"];
const interests = ["All", "Trekking", "Music", "Art", "Food", "Cricket", "Movies", "Dance", "Yoga", "Cycling", "Books", "Travel", "Photography", "Football", "Sports"];

const ADMIN_PIN = "1234";

// ── MAIN APP ───────────────────────────────────────────────────
export default function KeralaМeet() {
  const [screen, setScreen] = useState("splash"); // splash | onboard | main | admin
  const [activeTab, setActiveTab] = useState("discover");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(MOCK_USERS);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterDistrict, setFilterDistrict] = useState("All Kerala");
  const [filterInterest, setFilterInterest] = useState("All");
  const [showConnect, setShowConnect] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminTab, setAdminTab] = useState("users");
  const [onboardStep, setOnboardStep] = useState(0);
  const [form, setForm] = useState({ name: "", age: "", district: "", gender: "", interest: "", bio: "", whatsapp: "", lookingFor: "" });
  const [notifications, setNotifications] = useState([{ id: 1, text: "Arjun Nair sent you a connect request!", time: "2m ago", read: false }, { id: 2, text: "Meera Krishnan accepted your request!", time: "1h ago", read: false }]);
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [msgInput, setMsgInput] = useState("");
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState([]);
  const [liked, setLiked] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setTimeout(() => setScreen("onboard"), 2200);
  }, []);

  const filteredUsers = users.filter(u => {
    if (currentUser && u.id === currentUser.id) return false;
    if (filterDistrict !== "All Kerala" && u.district !== filterDistrict) return false;
    if (filterInterest !== "All" && !u.tags.includes(filterInterest)) return false;
    return true;
  });

  const swipeUsers = users.filter(u => !swipedUsers.includes(u.id) && (!currentUser || u.id !== currentUser.id));

  const handleOnboard = () => {
    if (!form.name || !form.district || !form.whatsapp) return;
    const newUser = { ...form, id: 99, avatar: form.gender === "Female" ? "👩" : "👨", verified: false, premium: false, online: true, joined: "Just now", tags: [form.interest], age: parseInt(form.age) || 25 };
    setCurrentUser(newUser);
    setUsers(prev => [newUser, ...prev]);
    setScreen("main");
  };

  const handleConnect = (user) => {
    setRequests(prev => [...prev, user]);
    setShowConnect(false);
    setSelectedUser(null);
    setSuccessMsg(`Connect request sent to ${user.name}! They'll get your WhatsApp number if they accept.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAccept = (user) => {
    setConnections(prev => [...prev, user]);
    setRequests(prev => prev.filter(r => r.id !== user.id));
    setSuccessMsg(`Connected with ${user.name}! You can now chat on WhatsApp.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSwipe = (direction, user) => {
    setSwipedUsers(prev => [...prev, user.id]);
    if (direction === "right") {
      setLiked(prev => [...prev, user.id]);
      handleConnect(user);
    }
    if (swipeIndex < swipeUsers.length - 1) setSwipeIndex(i => i + 1);
  };

  const sendMessage = (userId) => {
    if (!msgInput.trim()) return;
    setMessages(prev => ({ ...prev, [userId]: [...(prev[userId] || []), { text: msgInput, from: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] }));
    setMsgInput("");
    setTimeout(() => {
      setMessages(prev => ({ ...prev, [userId]: [...(prev[userId] || []), { text: "Thanks for connecting! Let's meet soon 😊", from: "them", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] }));
    }, 1200);
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  // ── SPLASH ──
  if (screen === "splash") return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#080b12", minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse-grow { 0%,100%{transform:scale(1);opacity:.8} 50%{transform:scale(1.12);opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple-out { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(3);opacity:0} }
        .glow { background:linear-gradient(135deg,#ff6b6b,#ffd93d,#ff6b6b); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3s linear infinite; }
        .btn-red { background:linear-gradient(135deg,#ff6b6b,#ff4757); color:#fff; border:none; border-radius:50px; font-family:'Nunito',sans-serif; font-weight:800; cursor:pointer; transition:all .3s; box-shadow:0 8px 28px rgba(255,71,87,.38); }
        .btn-red:hover { transform:scale(1.05); box-shadow:0 12px 36px rgba(255,71,87,.55); }
        .btn-ghost { background:transparent; color:#ff6b6b; border:2px solid #ff6b6b; border-radius:50px; font-family:'Nunito',sans-serif; font-weight:700; cursor:pointer; transition:all .3s; }
        .btn-ghost:hover { background:rgba(255,107,107,.1); }
        .input { width:100%; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); border-radius:14px; padding:14px 16px; color:#f0ede8; font-family:'Nunito',sans-serif; font-size:15px; outline:none; transition:border-color .2s; margin-bottom:12px; }
        .input:focus { border-color:#ff6b6b; }
        .input::placeholder { color:#555; }
        select.input option { background:#0e1220; color:#f0ede8; }
        .card { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07); border-radius:20px; transition:all .3s; cursor:pointer; }
        .card:hover { border-color:rgba(255,107,107,.3); transform:translateY(-3px); background:rgba(255,255,255,.05); }
        .card.selected { border-color:#ff6b6b; background:rgba(255,107,107,.08); }
        .tag { display:inline-block; background:rgba(255,107,107,.12); border:1px solid rgba(255,107,107,.25); color:#ff9a9a; border-radius:20px; padding:4px 12px; font-size:12px; font-weight:700; margin:3px; }
        .chip { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:30px; padding:7px 14px; font-size:12px; font-weight:700; cursor:pointer; transition:all .2s; color:#aaa; font-family:'Nunito',sans-serif; }
        .chip:hover, .chip.active { background:rgba(255,107,107,.12); border-color:#ff6b6b; color:#ff6b6b; }
        .tab-btn { background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:all .2s; display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 14px; border-radius:12px; flex:1; }
        .tab-btn.active { background:rgba(255,107,107,.1); }
        .msg-bubble-me { background:linear-gradient(135deg,#ff6b6b,#ff4757); border-radius:18px 18px 4px 18px; padding:10px 14px; margin-left:auto; max-width:75%; }
        .msg-bubble-them { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:18px 18px 18px 4px; padding:10px 14px; max-width:75%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#ff6b6b44; border-radius:3px; }
      `}</style>
      <div style={{ position:"relative", marginBottom:32 }}>
        <div style={{ width:120, height:120, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,107,107,.25),transparent)", position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", animation:"ripple-out 2s ease-out infinite" }} />
        <div style={{ width:100, height:100, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:48, boxShadow:"0 16px 48px rgba(255,71,87,.5)", animation:"pulse-grow 2s ease-in-out infinite" }}>🤝</div>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, animation:"fadeIn .8s ease .3s both" }}>
        <span className="glow">Kerala</span><span style={{color:"#f0ede8"}}>Meet</span>
      </div>
      <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginTop:10, animation:"fadeIn .8s ease .6s both" }}>Real Connections Across Kerala 🌴</p>
    </div>
  );

  // ── ONBOARDING ──
  if (screen === "onboard") {
    const steps = [
      { title: "Welcome to KeralaМeet 🌴", sub: "Find real friends across all 14 districts", fields: ["name","age","gender"] },
      { title: "Where are you from? 📍", sub: "We'll show you people nearby first", fields: ["district","whatsapp"] },
      { title: "What do you love? 🎭", sub: "Find people who share your passions", fields: ["interest","lookingFor","bio"] },
    ];
    const step = steps[onboardStep];
    return (
      <div style={{ fontFamily:"'Nunito',sans-serif", background:"#080b12", minHeight:"100vh", maxWidth:430, margin:"0 auto", color:"#f0ede8", padding:"52px 24px 40px" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} @keyframes shimmer{0%{background-position:0% center}100%{background-position:200% center}} @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} .glow{background:linear-gradient(135deg,#ff6b6b,#ffd93d,#ff6b6b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite} .btn-red{background:linear-gradient(135deg,#ff6b6b,#ff4757);color:#fff;border:none;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:all .3s;box-shadow:0 8px 28px rgba(255,71,87,.38)} .btn-red:hover{transform:scale(1.05)} .input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;color:#f0ede8;font-family:'Nunito',sans-serif;font-size:15px;outline:none;transition:border-color .2s;margin-bottom:12px} .input:focus{border-color:#ff6b6b} .input::placeholder{color:#555} select.input option{background:#0e1220;color:#f0ede8}`}</style>

        {/* Progress */}
        <div style={{ display:"flex", gap:8, marginBottom:36 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i <= onboardStep ? "linear-gradient(90deg,#ff6b6b,#ff4757)" : "rgba(255,255,255,.1)", transition:"background .4s" }} />
          ))}
        </div>

        <div style={{ animation:"fadeIn .4s ease" }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:8 }}>{step.title}</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:28 }}>{step.sub}</p>

          {step.fields.includes("name") && <input className="input" placeholder="Your full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />}
          {step.fields.includes("age") && <input className="input" placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} />}
          {step.fields.includes("gender") && (
            <select className="input" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          )}
          {step.fields.includes("district") && (
            <select className="input" value={form.district} onChange={e=>setForm({...form,district:e.target.value})}>
              <option value="">Select Your District</option>
              {districts.slice(1).map(d=><option key={d}>{d}</option>)}
            </select>
          )}
          {step.fields.includes("whatsapp") && <input className="input" placeholder="WhatsApp number (+91)" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})} />}
          {step.fields.includes("interest") && (
            <select className="input" value={form.interest} onChange={e=>setForm({...form,interest:e.target.value})}>
              <option value="">Your main interest</option>
              {interests.slice(1).map(i=><option key={i}>{i}</option>)}
            </select>
          )}
          {step.fields.includes("lookingFor") && (
            <select className="input" value={form.lookingFor} onChange={e=>setForm({...form,lookingFor:e.target.value})}>
              <option value="">Looking for...</option>
              <option>Friends & Social Circle</option>
              <option>Activity Partners</option>
              <option>Study / Work Buddies</option>
              <option>Travel Companions</option>
              <option>Romantic Connection</option>
            </select>
          )}
          {step.fields.includes("bio") && <textarea className="input" placeholder="Short bio (what makes you you?)" rows={3} value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} style={{resize:"none"}} />}
        </div>

        <div style={{ display:"flex", gap:12, marginTop:12 }}>
          {onboardStep > 0 && (
            <button onClick={()=>setOnboardStep(s=>s-1)} style={{ flex:1, padding:"16px", borderRadius:50, background:"rgba(255,255,255,.06)", border:"none", color:"#aaa", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:16, cursor:"pointer" }}>← Back</button>
          )}
          <button className="btn-red" style={{ flex:2, padding:"16px", fontSize:17 }}
            onClick={() => onboardStep < steps.length-1 ? setOnboardStep(s=>s+1) : handleOnboard()}>
            {onboardStep < steps.length-1 ? "Continue →" : "🌴 Find My People!"}
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", background:"#080b12", minHeight:"100vh", maxWidth:430, margin:"0 auto", color:"#f0ede8", paddingBottom:72, position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes shimmer{0%{background-position:0% center}100%{background-position:200% center}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(.88)}to{opacity:1;transform:scale(1)}}
        @keyframes swipeLeft{to{transform:translateX(-120%) rotate(-20deg);opacity:0}}
        @keyframes swipeRight{to{transform:translateX(120%) rotate(20deg);opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        .glow{background:linear-gradient(135deg,#ff6b6b,#ffd93d,#ff6b6b);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
        .btn-red{background:linear-gradient(135deg,#ff6b6b,#ff4757);color:#fff;border:none;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:800;cursor:pointer;transition:all .3s;box-shadow:0 8px 28px rgba(255,71,87,.38);}
        .btn-red:hover{transform:scale(1.05);box-shadow:0 12px 36px rgba(255,71,87,.55);}
        .btn-ghost{background:transparent;color:#ff6b6b;border:2px solid #ff6b6b;border-radius:50px;font-family:'Nunito',sans-serif;font-weight:700;cursor:pointer;transition:all .3s;}
        .btn-ghost:hover{background:rgba(255,107,107,.1);}
        .input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:13px 16px;color:#f0ede8;font-family:'Nunito',sans-serif;font-size:14px;outline:none;transition:border-color .2s;margin-bottom:10px;}
        .input:focus{border-color:#ff6b6b;}
        .input::placeholder{color:#555;}
        select.input option{background:#0e1220;color:#f0ede8;}
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:20px;transition:all .3s;cursor:pointer;}
        .card:hover{border-color:rgba(255,107,107,.3);transform:translateY(-3px);background:rgba(255,255,255,.05);}
        .tag{display:inline-block;background:rgba(255,107,107,.12);border:1px solid rgba(255,107,107,.22);color:#ff9a9a;border-radius:20px;padding:4px 12px;font-size:11px;font-weight:700;margin:3px;}
        .chip{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:30px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s;color:#aaa;font-family:'Nunito',sans-serif;}
        .chip:hover,.chip.active{background:rgba(255,107,107,.12);border-color:#ff6b6b;color:#ff6b6b;}
        .tab-btn{background:none;border:none;cursor:pointer;font-family:'Nunito',sans-serif;transition:all .2s;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 10px;border-radius:12px;flex:1;}
        .tab-btn.active{background:rgba(255,107,107,.1);}
        .user-row{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);margin-bottom:10px;cursor:pointer;transition:all .3s;}
        .user-row:hover{border-color:rgba(255,107,107,.3);background:rgba(255,255,255,.06);}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);display:flex;align-items:flex-end;justify-content:center;z-index:200;padding:16px;}
        .modal{background:#0e1220;border:1px solid rgba(255,255,255,.1);border-radius:28px 28px 24px 24px;padding:32px 24px;width:100%;max-width:430px;max-height:88vh;overflow-y:auto;animation:slideUp .3s ease;}
        .success-toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#22c55e,#16a34a);color:white;padding:12px 22px;border-radius:50px;font-weight:700;font-size:14px;z-index:999;animation:popIn .3s ease;max-width:360px;text-align:center;box-shadow:0 8px 24px rgba(34,197,94,.4);}
        .swipe-card{position:absolute;width:100%;border-radius:28px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);transition:transform .15s ease;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:#ff6b6b44;border-radius:3px;}
      `}</style>

      {/* Success Toast */}
      {showSuccess && <div className="success-toast">✅ {successMsg}</div>}

      {/* ── TOP NAV ── */}
      <div style={{ padding:"50px 20px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(8,11,18,.9)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>
          <span className="glow">Kerala</span><span style={{color:"#f0ede8"}}>Meet</span>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ position:"relative", cursor:"pointer" }} onClick={()=>setActiveTab("notifications")}>
            <span style={{ fontSize:22 }}>🔔</span>
            {unreadNotifs > 0 && <div style={{ position:"absolute", top:-4, right:-4, background:"#ff4757", color:"white", fontSize:10, fontWeight:800, width:16, height:16, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadNotifs}</div>}
          </div>
          <div onClick={()=>setActiveTab("profile")} style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, cursor:"pointer", boxShadow:"0 4px 14px rgba(255,71,87,.4)" }}>
            {currentUser?.avatar || "👤"}
          </div>
        </div>
      </div>

      {/* ── DISCOVER TAB ── */}
      {activeTab === "discover" && (
        <div style={{ padding:"16px", animation:"fadeIn .4s ease" }}>
          {/* Filters */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:14 }}>
            {districts.slice(0,8).map(d=>(
              <button key={d} className={`chip ${filterDistrict===d?"active":""}`} onClick={()=>setFilterDistrict(d)}>{d==="All Kerala"?"🌴 All":d}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:18 }}>
            {interests.map(i=>(
              <button key={i} className={`chip ${filterInterest===i?"active":""}`} onClick={()=>setFilterInterest(i)}>{i}</button>
            ))}
          </div>

          <div style={{ fontSize:12, color:"rgba(255,255,255,.3)", marginBottom:14, fontWeight:700, letterSpacing:2 }}>
            {filteredUsers.length} PEOPLE NEARBY
          </div>

          {filteredUsers.map(user => (
            <div key={user.id} className="user-row" onClick={()=>setSelectedUser(user)}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b33,#ff475733)", border:"2px solid rgba(255,107,107,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>{user.avatar}</div>
                {user.online && <div style={{ position:"absolute", bottom:2, right:2, width:12, height:12, borderRadius:"50%", background:"#22c55e", border:"2px solid #080b12" }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                  <span style={{ fontWeight:800, fontSize:15 }}>{user.name}</span>
                  {user.verified && <span style={{ fontSize:12 }}>✅</span>}
                  {user.premium && <span style={{ fontSize:12 }}>⭐</span>}
                </div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, marginBottom:5 }}>📍 {user.district} · {user.age}y · {user.gender}</div>
                <div>{user.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
              </div>
              <button className="btn-red" style={{ padding:"8px 14px", fontSize:12, whiteSpace:"nowrap" }} onClick={e=>{e.stopPropagation();setSelectedUser(user);setShowConnect(true);}}>
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── SWIPE TAB ── */}
      {activeTab === "swipe" && (
        <div style={{ padding:"16px", animation:"fadeIn .4s ease" }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22 }}>Quick Match 💫</div>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginTop:4 }}>Swipe right to connect, left to skip</p>
          </div>

          {swipeUsers.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,.3)" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🌴</div>
              <p style={{ fontSize:16, fontWeight:700 }}>You've seen everyone!</p>
              <p style={{ fontSize:13, marginTop:8 }}>Check back later for new members</p>
            </div>
          ) : (
            <div style={{ position:"relative", height:480, marginBottom:24 }}>
              {swipeUsers.slice(swipeIndex, swipeIndex+2).reverse().map((user, i) => (
                <div key={user.id} className="swipe-card" style={{ top: i===0?8:0, left:i===0?6:0, right:i===0?6:0, zIndex:i===0?1:2, transform:i===0?"scale(.97)":"scale(1)", opacity:i===0?.8:1 }}>
                  <div style={{ background:"linear-gradient(180deg,rgba(255,107,107,.12),rgba(8,11,18,.98))", border:"1px solid rgba(255,107,107,.2)", borderRadius:28, padding:28, height:480, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
                    <div style={{ textAlign:"center", marginBottom:20, animation:"float 3s ease-in-out infinite" }}>
                      <div style={{ fontSize:72 }}>{user.avatar}</div>
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, marginBottom:4 }}>{user.name}, {user.age}</div>
                    <div style={{ color:"rgba(255,255,255,.5)", fontSize:13, marginBottom:10 }}>📍 {user.district} · {user.lookingFor}</div>
                    <p style={{ color:"rgba(255,255,255,.7)", fontSize:14, lineHeight:1.6, marginBottom:14 }}>{user.bio}</p>
                    <div style={{ marginBottom:16 }}>{user.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
                    <div style={{ display:"flex", gap:14, justifyContent:"center" }}>
                      <button onClick={()=>handleSwipe("left",user)} style={{ width:62, height:62, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:"2px solid rgba(255,255,255,.15)", fontSize:28, cursor:"pointer", transition:"all .2s" }}>✗</button>
                      <button onClick={()=>handleSwipe("right",user)} style={{ width:62, height:62, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", border:"none", fontSize:28, cursor:"pointer", boxShadow:"0 8px 24px rgba(255,71,87,.5)", transition:"all .2s" }}>❤️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CONNECTIONS TAB ── */}
      {activeTab === "connections" && (
        <div style={{ padding:"16px", animation:"fadeIn .4s ease" }}>
          {requests.length > 0 && (
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginBottom:12, fontWeight:700, letterSpacing:2 }}>PENDING REQUESTS ({requests.length})</div>
              {requests.map(user=>(
                <div key={user.id} className="user-row" style={{ borderColor:"rgba(255,217,61,.2)" }}>
                  <div style={{ width:46, height:46, borderRadius:"50%", background:"rgba(255,107,107,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{user.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:14 }}>{user.name}</div>
                    <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>📍 {user.district}</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setRequests(p=>p.filter(r=>r.id!==user.id))} style={{ padding:"8px 12px", borderRadius:20, background:"rgba(255,255,255,.06)", border:"none", color:"#aaa", cursor:"pointer", fontSize:12, fontFamily:"'Nunito',sans-serif" }}>✗</button>
                    <button className="btn-red" style={{ padding:"8px 14px", fontSize:12 }} onClick={()=>handleAccept(user)}>Accept</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginBottom:12, fontWeight:700, letterSpacing:2 }}>YOUR CONNECTIONS ({connections.length})</div>

          {connections.length === 0 ? (
            <div style={{ textAlign:"center", padding:"48px 0", color:"rgba(255,255,255,.3)" }}>
              <div style={{ fontSize:52, marginBottom:12 }}>🤝</div>
              <p style={{ fontWeight:700, fontSize:15 }}>No connections yet</p>
              <p style={{ fontSize:13, marginTop:6 }}>Discover people and send connect requests!</p>
              <button className="btn-red" style={{ marginTop:20, padding:"12px 28px", fontSize:14 }} onClick={()=>setActiveTab("discover")}>Find People →</button>
            </div>
          ) : connections.map(user=>(
            <div key={user.id} className="user-row" style={{ borderColor:"rgba(34,197,94,.2)" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:"rgba(34,197,94,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{user.avatar}</div>
                <div style={{ position:"absolute", bottom:1, right:1, width:11, height:11, borderRadius:"50%", background:"#22c55e", border:"2px solid #080b12" }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:14 }}>{user.name}</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>📍 {user.district} · Connected ✅</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{setChatUser(user);setActiveTab("chat");}} style={{ padding:"8px 12px", borderRadius:20, background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", color:"#ccc", cursor:"pointer", fontSize:12, fontFamily:"'Nunito',sans-serif", fontWeight:700 }}>💬 Chat</button>
                <a href={`https://wa.me/${user.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ padding:"8px 12px", borderRadius:20, background:"rgba(37,211,102,.15)", border:"1px solid rgba(37,211,102,.3)", color:"#25d366", textDecoration:"none", fontSize:12, fontWeight:800, fontFamily:"'Nunito',sans-serif", display:"flex", alignItems:"center" }}>
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && chatUser && (
        <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)", animation:"fadeIn .3s ease" }}>
          <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={()=>setActiveTab("connections")} style={{ background:"none", border:"none", color:"#aaa", fontSize:20, cursor:"pointer" }}>←</button>
            <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{chatUser.avatar}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:14 }}>{chatUser.name}</div>
              <div style={{ color:"#22c55e", fontSize:11 }}>● Online</div>
            </div>
            <a href={`https://wa.me/${chatUser.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{ marginLeft:"auto", padding:"7px 14px", borderRadius:20, background:"rgba(37,211,102,.12)", border:"1px solid rgba(37,211,102,.25)", color:"#25d366", textDecoration:"none", fontSize:12, fontWeight:800, fontFamily:"'Nunito',sans-serif" }}>
              📱 WhatsApp
            </a>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ textAlign:"center", marginBottom:8 }}>
              <span style={{ background:"rgba(255,255,255,.06)", padding:"6px 14px", borderRadius:20, fontSize:11, color:"rgba(255,255,255,.4)" }}>You're now connected 🎉 Say hi!</span>
            </div>
            {(messages[chatUser.id] || []).map((msg,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:msg.from==="me"?"flex-end":"flex-start" }}>
                <div className={msg.from==="me"?"msg-bubble-me":"msg-bubble-them"} style={{ fontSize:14, lineHeight:1.5 }}>
                  <div>{msg.text}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,.5)", marginTop:4, textAlign:"right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", gap:10 }}>
            <input className="input" placeholder="Type a message..." value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMessage(chatUser.id)} style={{ marginBottom:0, flex:1 }} />
            <button className="btn-red" style={{ padding:"13px 18px", fontSize:16, flexShrink:0 }} onClick={()=>sendMessage(chatUser.id)}>➤</button>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS TAB ── */}
      {activeTab === "notifications" && (
        <div style={{ padding:"16px", animation:"fadeIn .4s ease" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:20 }}>Notifications</div>
          {notifications.map(n=>(
            <div key={n.id} onClick={()=>setNotifications(p=>p.map(x=>x.id===n.id?{...x,read:true}:x))} style={{ padding:"14px 16px", borderRadius:16, marginBottom:10, background: n.read?"rgba(255,255,255,.02)":"rgba(255,107,107,.06)", border:`1px solid ${n.read?"rgba(255,255,255,.06)":"rgba(255,107,107,.18)"}`, cursor:"pointer" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:22 }}>{n.text.includes("accepted")?"🎉":"👋"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, lineHeight:1.5, fontWeight:n.read?400:700 }}>{n.text}</div>
                  <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, marginTop:4 }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ff6b6b", flexShrink:0, marginTop:6 }} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE TAB ── */}
      {activeTab === "profile" && currentUser && (
        <div style={{ padding:"16px", animation:"fadeIn .4s ease" }}>
          <div style={{ textAlign:"center", padding:"24px 0 20px" }}>
            <div style={{ width:88, height:88, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b,#ff4757)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 14px", boxShadow:"0 12px 36px rgba(255,71,87,.4)" }}>{currentUser.avatar}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:4 }}>{currentUser.name}</div>
            <div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>📍 {currentUser.district} · {currentUser.age || 25}y</div>
            <div style={{ marginTop:12 }}>
              <span className="tag">{currentUser.interest || "Explorer"}</span>
              <span style={{ display:"inline-block", background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)", color:"#aaa", borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, margin:3 }}>Free Plan</span>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
            {[
              { n: connections.length, label:"Connections" },
              { n: liked.length, label:"Liked" },
              { n: requests.length, label:"Pending" },
            ].map(s=>(
              <div key={s.label} style={{ padding:"16px 10px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, textAlign:"center" }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:"#ff6b6b" }}>{s.n}</div>
                <div style={{ color:"rgba(255,255,255,.4)", fontSize:11, marginTop:4, fontWeight:700 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:16, padding:"16px", marginBottom:14 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.35)", marginBottom:10, fontWeight:700, letterSpacing:2 }}>MY INFO</div>
            {[
              { label:"WhatsApp", value: currentUser.whatsapp },
              { label:"Looking For", value: currentUser.lookingFor },
              { label:"Bio", value: currentUser.bio || "No bio yet" },
            ].map(item=>(
              <div key={item.label} style={{ marginBottom:12 }}>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11, fontWeight:700, marginBottom:3 }}>{item.label}</div>
                <div style={{ fontSize:14, color:"#e0dde8" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <button className="btn-red" style={{ width:"100%", padding:"15px", fontSize:16, marginBottom:12 }} onClick={()=>setShowPremium && setActiveTab("discover")}>
            ⭐ Upgrade to Premium ₹99/mo
          </button>
          <button onClick={()=>setShowAdminLogin(true)} style={{ width:"100%", padding:"13px", borderRadius:50, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(255,255,255,.4)", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            🔐 Admin Login
          </button>
        </div>
      )}

      {/* ── ADMIN DASHBOARD ── */}
      {screen === "admin" && (
        <div style={{ padding:"52px 16px 16px", animation:"fadeIn .4s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <button onClick={()=>setScreen("main")} style={{ background:"none", border:"none", color:"#aaa", fontSize:20, cursor:"pointer" }}>←</button>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22 }}>Admin <span className="glow">Dashboard</span></div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
            {[
              { n: users.length, label:"Total Users", icon:"👥", color:"#ff6b6b" },
              { n: users.filter(u=>u.verified).length, label:"Verified", icon:"✅", color:"#22c55e" },
              { n: users.filter(u=>u.premium).length, label:"Premium", icon:"⭐", color:"#ffd93d" },
              { n: users.filter(u=>u.online).length, label:"Online Now", icon:"🟢", color:"#22c55e" },
            ].map(s=>(
              <div key={s.label} style={{ padding:"18px 16px", background:"rgba(255,255,255,.03)", border:`1px solid ${s.color}22`, borderRadius:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:s.color }}>{s.n}</div>
                    <div style={{ color:"rgba(255,255,255,.4)", fontSize:12, fontWeight:700, marginTop:4 }}>{s.label}</div>
                  </div>
                  <span style={{ fontSize:24 }}>{s.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue */}
          <div style={{ padding:"18px", background:"linear-gradient(135deg,rgba(255,107,107,.08),rgba(255,71,87,.04))", border:"1px solid rgba(255,107,107,.2)", borderRadius:16, marginBottom:20 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,.4)", marginBottom:8, fontWeight:700, letterSpacing:2 }}>REVENUE THIS MONTH</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:38, color:"#ff6b6b" }}>₹{users.filter(u=>u.premium).length * 99}</div>
            <div style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginTop:4 }}>{users.filter(u=>u.premium).length} premium subscribers × ₹99</div>
          </div>

          {/* Admin tabs */}
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            {["users","districts","reports"].map(t=>(
              <button key={t} className={`chip ${adminTab===t?"active":""}`} onClick={()=>setAdminTab(t)} style={{ flex:1, textAlign:"center", textTransform:"capitalize" }}>{t}</button>
            ))}
          </div>

          {adminTab === "users" && users.map(u=>(
            <div key={u.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", marginBottom:8 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{u.avatar}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ fontWeight:700, fontSize:13 }}>{u.name}</span>
                  {u.verified && <span style={{ fontSize:10 }}>✅</span>}
                  {u.premium && <span style={{ fontSize:10 }}>⭐</span>}
                </div>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>{u.district} · {u.joined}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {!u.verified && (
                  <button onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,verified:true}:x))} style={{ padding:"5px 10px", borderRadius:14, background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.25)", color:"#22c55e", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Verify</button>
                )}
                <button onClick={()=>setUsers(p=>p.filter(x=>x.id!==u.id))} style={{ padding:"5px 10px", borderRadius:14, background:"rgba(255,71,87,.1)", border:"1px solid rgba(255,71,87,.2)", color:"#ff4757", cursor:"pointer", fontSize:11, fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Remove</button>
              </div>
            </div>
          ))}

          {adminTab === "districts" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {districts.slice(1).map(d=>{
                const count = users.filter(u=>u.district===d).length;
                return (
                  <div key={d} style={{ padding:"14px 16px", background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>📍 {d}</div>
                    <div style={{ color:"#ff6b6b", fontFamily:"'Playfair Display',serif", fontSize:22 }}>{count}</div>
                    <div style={{ color:"rgba(255,255,255,.3)", fontSize:11 }}>members</div>
                  </div>
                );
              })}
            </div>
          )}

          {adminTab === "reports" && (
            <div style={{ textAlign:"center", padding:"40px 0", color:"rgba(255,255,255,.3)" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>📊</div>
              <p style={{ fontWeight:700 }}>Analytics coming soon</p>
              <p style={{ fontSize:13, marginTop:6 }}>Connect Razorpay to see revenue reports</p>
            </div>
          )}
        </div>
      )}

      {/* ── USER PROFILE MODAL ── */}
      {selectedUser && !showConnect && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setSelectedUser(null)}>
          <div className="modal">
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#ff6b6b33,#ff475722)", border:"2px solid rgba(255,107,107,.3)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 14px" }}>{selectedUser.avatar}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:4 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700 }}>{selectedUser.name}</span>
                {selectedUser.verified && <span>✅</span>}
                {selectedUser.premium && <span>⭐</span>}
              </div>
              <div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>📍 {selectedUser.district} · {selectedUser.age}y · {selectedUser.gender}</div>
              <div style={{ marginTop:10 }}>{selectedUser.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.35)", marginBottom:8, fontWeight:700, letterSpacing:2 }}>ABOUT</div>
              <p style={{ fontSize:14, color:"rgba(255,255,255,.7)", lineHeight:1.6 }}>{selectedUser.bio}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              <div style={{ padding:"12px", background:"rgba(255,255,255,.03)", borderRadius:12, textAlign:"center" }}>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11, fontWeight:700 }}>LOOKING FOR</div>
                <div style={{ fontSize:13, fontWeight:700, marginTop:4 }}>{selectedUser.lookingFor}</div>
              </div>
              <div style={{ padding:"12px", background:"rgba(255,255,255,.03)", borderRadius:12, textAlign:"center" }}>
                <div style={{ color:"rgba(255,255,255,.35)", fontSize:11, fontWeight:700 }}>STATUS</div>
                <div style={{ fontSize:13, fontWeight:700, marginTop:4, color:selectedUser.online?"#22c55e":"#aaa" }}>{selectedUser.online?"🟢 Online":"⚫ Offline"}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-ghost" style={{ flex:1, padding:"14px" }} onClick={()=>setSelectedUser(null)}>Back</button>
              <button className="btn-red" style={{ flex:2, padding:"14px", fontSize:15 }} onClick={()=>setShowConnect(true)}>
                🤝 Send Connect Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONNECT CONFIRM MODAL ── */}
      {showConnect && selectedUser && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowConnect(false)}>
          <div className="modal" style={{ maxHeight:"70vh" }}>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:52, marginBottom:10 }}>🤝</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:8 }}>Connect with {selectedUser.name}?</div>
              <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, lineHeight:1.6 }}>
                They'll receive your connect request. If they accept, both of you will get each other's WhatsApp numbers.
              </p>
            </div>
            <div style={{ background:"rgba(255,107,107,.06)", border:"1px solid rgba(255,107,107,.15)", borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:24 }}>{selectedUser.avatar}</span>
                <div>
                  <div style={{ fontWeight:800 }}>{selectedUser.name}</div>
                  <div style={{ color:"rgba(255,255,255,.4)", fontSize:12 }}>📍 {selectedUser.district}</div>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-ghost" style={{ flex:1, padding:"14px" }} onClick={()=>setShowConnect(false)}>Cancel</button>
              <button className="btn-red" style={{ flex:2, padding:"14px", fontSize:15 }} onClick={()=>handleConnect(selectedUser)}>
                Send Request ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN LOGIN MODAL ── */}
      {showAdminLogin && (
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setShowAdminLogin(false)}>
          <div className="modal">
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:44, marginBottom:10 }}>🔐</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22 }}>Admin Login</div>
            </div>
            <input className="input" type="password" placeholder="Enter admin PIN" value={adminPin} onChange={e=>setAdminPin(e.target.value)} />
            <button className="btn-red" style={{ width:"100%", padding:"14px", fontSize:16, marginTop:4 }}
              onClick={()=>{ if(adminPin===ADMIN_PIN){ setScreen("admin"); setShowAdminLogin(false); setAdminPin(""); } else alert("Wrong PIN!"); }}>
              Login →
            </button>
            <p style={{ color:"rgba(255,255,255,.25)", fontSize:11, textAlign:"center", marginTop:10 }}>Default PIN: 1234 (change in code)</p>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      {screen !== "admin" && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(8,11,18,.95)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", padding:"10px 0 16px", zIndex:100 }}>
          {[
            { id:"discover", icon:"🔍", label:"Discover" },
            { id:"swipe", icon:"💫", label:"Swipe" },
            { id:"connections", icon:"🤝", label:"Connect", badge: requests.length },
            { id:"notifications", icon:"🔔", label:"Alerts", badge: unreadNotifs },
            { id:"profile", icon:"👤", label:"Profile" },
          ].map(tab=>(
            <button key={tab.id} className={`tab-btn ${activeTab===tab.id?"active":""}`}
              onClick={()=>setActiveTab(tab.id)}
              style={{ color: activeTab===tab.id?"#ff6b6b":"rgba(255,255,255,.35)" }}>
              <div style={{ position:"relative" }}>
                <span style={{ fontSize:20 }}>{tab.icon}</span>
                {tab.badge>0 && <div style={{ position:"absolute", top:-4, right:-6, background:"#ff4757", color:"white", fontSize:9, fontWeight:800, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>{tab.badge}</div>}
              </div>
              <span style={{ fontSize:9, fontWeight:700 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
