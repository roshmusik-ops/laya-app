import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { db, storage, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DISTRICTS = ["Thiruvananthapuram","Kollam","Pathanamthitta","Alappuzha","Kottayam","Idukki","Ernakulam","Thrissur","Palakkad","Malappuram","Kozhikode","Wayanad","Kannur","Kasaragod"];
const INTERESTS = ["Trekking","Music","Art","Food","Cricket","Movies","Dance","Yoga","Cycling","Books","Travel","Photography","Football","Sports","Cooking","Fitness"];
const MODES = [
  { id:"date",    icon:"❤️", label:"Date",    desc:"Find romantic connections"  },
  { id:"friends", icon:"👫", label:"Friends", desc:"Find activity buddies"      },
  { id:"network", icon:"💼", label:"Network", desc:"Professional connections"   },
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "Free";
  const { currentUser, setCurrentUser, showToast } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    age: "", district: "", gender: "", bio: "", interest: "", lookingFor: "", mode: "friends",
    photos: ["","","",""],
    favoriteTrack: "", favoriteArtist: "",
    musicLinkType: "", musicLink: ""
  });
  const [files, setFiles] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const fileRefs = [useRef(), useRef(), useRef(), useRef()];

  const steps = [
    { title:"Tell us about you 🌴",    sub:"Basic details to get started" },
    { title:"Add your photos 📸",      sub:"Up to 4 photos — first one is your main pic" },
    { title:"What are you here for? 🎯", sub:"Choose your mode on Laya" },
  ];

  const handlePhoto = (i, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Save file object for upload later
    const newFiles = [...files];
    newFiles[i] = file;
    setFiles(newFiles);

    // Compress and show preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scale = Math.min(MAX_WIDTH / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // 70% quality JPEG
        const newPhotos = [...form.photos];
        newPhotos[i] = compressedDataUrl;
        setForm({...form, photos: newPhotos});
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (i) => {
    const newPhotos = [...form.photos];
    newPhotos[i] = "";
    setForm(p => ({ ...p, photos: newPhotos }));
    
    const newFiles = [...files];
    newFiles[i] = null;
    setFiles(newFiles);
  };

  const canNext = () => {
    if (step === 0) return form.age && form.district && form.gender && form.musicLinkType && form.musicLink;
    if (step === 1) return form.photos.some(p => p); // at least 1 photo
    return true;
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser ? auth.currentUser.uid : currentUser?.id || ("me_" + Date.now());
      
      const updated = {
        ...currentUser,
        ...form,
        photos: form.photos, // Just use the local data URIs since we aren't uploading
        age: parseInt(form.age) || 25,
        tags: form.interest ? [form.interest] : [],
        premium: selectedPlan !== "Free",
        plan: selectedPlan,
        status: "approved"
      };
      
      // Bypass Firebase entirely to prevent hanging
      setTimeout(() => {
        setCurrentUser(updated);
        setLoading(false);
        navigate("/app");
        showToast(`Profile ready, ${updated.name || "friend"}! Welcome to Laya 🎉`);
      }, 500);
      
    } catch (err) {
      console.error(err);
      setLoading(false);
      showToast("Error saving profile", "error");
    }
  };

  return (
    <div className="app-wrap" style={{ padding:"52px 24px 40px" }}>

      {/* Progress */}
      <div style={{ display:"flex", gap:8, marginBottom:32 }}>
        {steps.map((_,i) => (
          <div key={i} style={{ flex:1, height:4, borderRadius:4, background: i <= step ? "linear-gradient(90deg,#ff6b6b,#ff4757)" : "rgba(255,255,255,.1)", transition:"background .4s" }} />
        ))}
      </div>

      <div className="fade-in" key={step}>
        <h2 className="serif" style={{ fontSize:24, marginBottom:6 }}>{steps[step].title}</h2>
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:13, marginBottom:24 }}>{steps[step].sub}</p>

        {/* ── STEP 0: Basic info ── */}
        {step === 0 && (
          <>
            <input className="input" placeholder="Age" type="number" min={18} max={60}
              value={form.age} onChange={e => setForm(p => ({...p, age: e.target.value}))} />
            <select className="input" value={form.gender} onChange={e => setForm(p => ({...p, gender: e.target.value}))}>
              <option value="">Select Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            <select className="input" value={form.district} onChange={e => setForm(p => ({...p, district: e.target.value}))}>
              <option value="">Your District</option>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="input" value={form.interest} onChange={e => setForm(p => ({...p, interest: e.target.value}))}>
              <option value="">Main Interest</option>
              {INTERESTS.map(i => <option key={i}>{i}</option>)}
            </select>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <input className="input" placeholder="🎵 Favorite Track"
                value={form.favoriteTrack || ""} onChange={e => setForm(p => ({...p, favoriteTrack: e.target.value}))} style={{ marginBottom:10 }} />
              <input className="input" placeholder="👤 Artist Name"
                value={form.favoriteArtist || ""} onChange={e => setForm(p => ({...p, favoriteArtist: e.target.value}))} style={{ marginBottom:10 }} />
            </div>
            
            {/* Mandatory Music Channel Link */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(212, 175, 55, 0.4)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>🔗 CONNECT MUSIC CHANNEL (MANDATORY)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 10 }}>
                <select className="input" value={form.musicLinkType} onChange={e => setForm(p => ({...p, musicLinkType: e.target.value}))} style={{ marginBottom: 0 }}>
                  <option value="">Platform</option>
                  <option value="Spotify">Spotify</option>
                  <option value="YouTube Music">YouTube Music</option>
                  <option value="Apple Music">Apple Music</option>
                  <option value="Soundcloud">Soundcloud</option>
                </select>
                <input className="input" placeholder="Profile or Playlist Link"
                  value={form.musicLink || ""} onChange={e => setForm(p => ({...p, musicLink: e.target.value}))} style={{ marginBottom: 0 }} />
              </div>
            </div>
            <select className="input" value={form.lookingFor} onChange={e => setForm(p => ({...p, lookingFor: e.target.value}))}>
              <option value="">Looking for...</option>
              <option>Romantic Connection</option>
              <option>Friends & Social Circle</option>
              <option>Activity Partners</option>
              <option>Travel Companions</option>
              <option>Study / Work Buddies</option>
            </select>
            <textarea className="input" placeholder="Write a short bio (what makes you you?)" rows={3}
              value={form.bio} onChange={e => setForm(p => ({...p, bio: e.target.value}))}
              style={{ resize:"none" }} />
          </>
        )}

        {/* ── STEP 1: Photos ── */}
        {step === 1 && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {form.photos.map((photo, i) => (
                <div key={i} className={`photo-slot ${photo ? "filled" : ""}`}
                  style={{ minHeight:150 }}
                  onClick={() => !photo && fileRefs[i].current?.click()}>
                  {photo ? (
                    <>
                      <img src={photo} alt={`Photo ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
                      {i === 0 && (
                        <div style={{ position:"absolute", top:8, left:8, background:"rgba(255,107,107,.9)", borderRadius:20, padding:"2px 10px", fontSize:10, fontWeight:800 }}>MAIN</div>
                      )}
                      <button onClick={e => { e.stopPropagation(); removePhoto(i); }}
                        style={{ position:"absolute", top:8, right:8, width:26, height:26, borderRadius:"50%", background:"rgba(0,0,0,.7)", border:"none", color:"white", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:28, marginBottom:6, color:"rgba(255,107,107,.5)" }}>📷</div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,.3)", fontWeight:700 }}>
                        {i === 0 ? "Main Photo" : `Photo ${i+1}`}
                      </div>
                    </>
                  )}
                  <input ref={fileRefs[i]} type="file" accept="image/*" style={{ display:"none" }}
                    onChange={e => handlePhoto(i, e)} />
                </div>
              ))}
            </div>
            <p style={{ color:"rgba(255,255,255,.3)", fontSize:11, textAlign:"center" }}>
              Max 5MB per photo · JPG, PNG, WEBP supported
            </p>
          </>
        )}

        {/* ── STEP 2: Mode selection ── */}
        {step === 2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {MODES.map(m => (
              <div key={m.id}
                onClick={() => setForm(p => ({...p, mode: m.id}))}
                style={{
                  padding:"18px 20px", borderRadius:18, cursor:"pointer",
                  border: form.mode === m.id ? "2px solid #ff6b6b" : "1px solid rgba(255,255,255,.1)",
                  background: form.mode === m.id ? "rgba(255,107,107,.08)" : "rgba(255,255,255,.03)",
                  display:"flex", alignItems:"center", gap:14, transition:"all .2s",
                }}>
                <span style={{ fontSize:28 }}>{m.icon}</span>
                <div>
                  <div style={{ fontWeight:800, fontSize:16 }}>{m.label}</div>
                  <div style={{ color:"rgba(255,255,255,.4)", fontSize:13 }}>{m.desc}</div>
                </div>
                {form.mode === m.id && <span style={{ marginLeft:"auto", color:"#ff6b6b", fontSize:20 }}>✓</span>}
              </div>
            ))}
            <p style={{ color:"rgba(255,255,255,.3)", fontSize:12, textAlign:"center", marginTop:6 }}>
              In Date mode, women message first for safety 🛡️
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display:"flex", gap:12, marginTop:24 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s-1)}
            style={{ flex:1, padding:"15px", borderRadius:50, background:"rgba(255,255,255,.06)", border:"none", color:"#aaa", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:15, cursor:"pointer" }}>
            ← Back
          </button>
        )}
        <button className="btn-red" style={{ flex:2, padding:"15px", fontSize:16 }}
          onClick={() => step < 2 ? (canNext() ? setStep(s => s+1) : showToast("Fill in required fields", "error")) : handleFinish()}
          disabled={(!canNext() && step < 2) || loading}>
          {loading ? "Saving..." : step < 2 ? "Continue →" : "✨ Start Exploring Laya!"}
        </button>
      </div>
    </div>
  );
}
