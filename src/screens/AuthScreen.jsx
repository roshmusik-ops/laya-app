import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useApp } from "../contexts/AppContext";

import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  // Restore plan from sessionStorage (survives Google OAuth redirect) or location state
  const selectedPlan = location.state?.plan || sessionStorage.getItem("laya_selected_plan") || "Free";
  const { setCurrentUser, showToast } = useApp();
  const [step, setStep]         = useState("login"); // login | name
  const [loading, setLoading]   = useState(false);
  const [name, setName]         = useState("");

  // Handle redirect result when user returns from Google sign-in
  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) { setLoading(false); return; }
        const user = result.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Always ensure email comes from Firebase Auth (source of truth)
          const mergedUser = {
            ...userData,
            email: user.email || userData.email || "",
            uid:   user.uid,
            id:    user.uid,
          };
          // Patch Firestore if email was missing
          if (!userData.email && user.email) {
            setDoc(doc(db, "users", user.uid), { email: user.email, uid: user.uid }, { merge: true });
          }
          setCurrentUser(mergedUser);
          navigate("/app");
          showToast(`Welcome back, ${mergedUser.name}! 🌴`);
        } else {
          setName(user.displayName || "");
          setStep("name");
        }
      })
      .catch((error) => {
        console.error("Redirect result error:", error);
        if (error.code !== 'auth/no-auth-event') {
          showToast(error.message || "Sign-in failed. Try again.", "error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleGoogleLogin = () => {
    // Save plan before redirect — signInWithRedirect causes a full page reload
    // which wipes React Router state. sessionStorage survives the redirect.
    sessionStorage.setItem("laya_selected_plan", selectedPlan);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const handleFinish = () => {
    if (!name.trim()) { showToast("Enter your name", "error"); return; }
    
    const user = auth.currentUser;
    const uid = user ? user.uid : "me_" + Date.now();
    
    const newUser = {
      id:         uid,
      uid:        uid,
      name:       name.trim(),
      email:      user ? user.email : "",
      age: 25,
      district: "Ernakulam",
      bio: "",
      photos: [user?.photoURL || "👤","","",""],
      tags: [],
      gender: "Other",
      lookingFor: "Friends & Activity Partners",
      verified: true,
      premium: false,
      online: true,
      whatsapp: "",
      mode: "friends",
      joined: new Date().toISOString(),
      status: "approved",
    };
    setCurrentUser(newUser);
    // Clear the persisted plan now that we're navigating forward
    sessionStorage.removeItem("laya_selected_plan");
    navigate("/setup", { state: { plan: selectedPlan } });
    showToast(`Welcome to Laya, ${name}! 🌴`);
  };

  return (
    <div className="app-wrap fade-in" style={{ display:"flex", flexDirection:"column", minHeight:"100vh", padding:"0 32px", position:"relative", overflow:"hidden" }}>
      <Helmet>
        <title>Request Access | Laya</title>
        <meta name="description" content="Request access to the most exclusive network in Kerala." />
      </Helmet>
      {/* Model background */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"url('/realistic_bg.png')", backgroundSize:"cover", backgroundPosition:"center top", filter:"brightness(0.25) grayscale(0.1)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 60%, rgba(5,5,5,1) 100%)" }} />
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", flex:1 }}>

      {/* Logo */}
      <div style={{ paddingTop:64, paddingBottom:32, textAlign:"center" }}>
        <div className="serif" style={{ fontSize:42, fontWeight:400, letterSpacing:"0.05em" }}>
          <span style={{color: "#fcfcfc"}}>Laya</span>
        </div>
        <div style={{ width: "30px", height: "1px", background: "rgba(212, 175, 55, 0.4)", margin: "12px auto" }} />
        <p style={{ color:"rgba(255,255,255,.4)", fontSize:11, letterSpacing:"0.15em", textTransform: "uppercase", fontWeight: 300 }}>
          The Exclusive Network
        </p>
      </div>

      {/* ── SECURITY GATEWAY ── */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 20px", marginBottom:32, textAlign:"center", backdropFilter: "blur(10px)" }}>
        <div style={{ fontSize:10, color:"#ff6b6b", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🛡️ Security Notice</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.6, fontWeight: 300 }}>
          To ensure a genuine community, all users must securely verify their identity using a real Google Account.
        </div>
      </div>

      {/* ── STEP 1: Google Login ── */}
      {step === "login" && (
        <div className="fade-in">
          <h2 className="serif" style={{ fontSize:26, marginBottom:8, fontWeight: 400 }}>Request Access</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24, fontWeight: 300, lineHeight: 1.5 }}>
            Sign in securely with Google to join the network.
          </p>
          
          <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:14, marginTop:8, textTransform:"uppercase", letterSpacing:"0.05em", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", background:"#ffffff", color:"#050505" }}
            onClick={handleGoogleLogin} disabled={loading}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" style={{ width: 18, height: 18 }} />
            {loading ? "Connecting..." : "Continue with Google"}
          </button>
          <p style={{ color:"rgba(255,255,255,.2)", fontSize:11, textAlign:"center", marginTop:20, lineHeight:1.6, fontWeight: 300 }}>
            By continuing, you agree to our Terms of Service<br/>and Privacy Policy.
          </p>
        </div>
      )}

      {/* ── STEP 2: Name (new users) ── */}
      {step === "name" && (
        <div className="fade-in">
          <h2 className="serif" style={{ fontSize:26, marginBottom:8, fontWeight: 400 }}>Your Details</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24, fontWeight: 300 }}>
            Please confirm your name for your profile.
          </p>
          <input className="input" placeholder="Full Name" value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleFinish()} 
            style={{ padding: "16px 18px" }}/>
          <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:14, marginTop:16, textTransform:"uppercase", letterSpacing:"0.05em" }}
            onClick={handleFinish}>
            Complete Setup
          </button>
        </div>
      )}

      </div>
    </div>
  );
}
