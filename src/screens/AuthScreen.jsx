import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useApp } from "../contexts/AppContext";

import { auth, db } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan || "Free";
  const { setCurrentUser, showToast } = useApp();
  const [step, setStep]         = useState("phone"); // phone | otp | name
  const [phone, setPhone]       = useState("");
  const [otp, setOtp]           = useState(["","","","","",""]);
  const [loading, setLoading]   = useState(false);
  const [name, setName]         = useState("");

  const handleSendOtp = async () => {
    if (phone.replace(/\D/g,"").length < 10) {
      showToast("Enter a valid 10-digit number", "error"); return;
    }
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => {}
        });
      }
      const formatPhone = "+91" + phone.replace(/\D/g,"");
      const confirmationResult = await signInWithPhoneNumber(auth, formatPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setStep("otp");
      showToast("Verification code sent!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      showToast(error.message || "Failed to send code. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      showToast("Enter all 6 digits", "error"); return;
    }
    setLoading(true);
    try {
      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        showToast("Session expired. Please request OTP again.", "error");
        setStep("phone");
        return;
      }
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      
      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser(userData);
        navigate("/app");
        showToast(`Welcome back, ${userData.name}! 🌴`);
      } else {
        // New user - go to name input phase
        setStep("name");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showToast("Invalid code. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKey = (val, i, ref) => {
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && ref) ref.focus();
  };

  const handleFinish = () => {
    if (!name.trim()) { showToast("Enter your name", "error"); return; }
    
    const uid = auth.currentUser ? auth.currentUser.uid : "me_" + Date.now();
    
    const newUser = {
      id: uid,
      name: name.trim(),
      age: 25,
      district: "Ernakulam",
      bio: "",
      photos: ["👤","","",""],
      tags: [],
      gender: "Other",
      lookingFor: "Friends & Activity Partners",
      verified: false,
      premium: false,
      online: true,
      whatsapp: "+91" + phone,
      mode: "friends",
      joined: new Date().toISOString(),
      status: "approved",
    };
    setCurrentUser(newUser);
    navigate("/setup", { state: { plan: selectedPlan } });
    showToast(`Welcome to Laya, ${name}! 🌴`);
  };

  const refs = Array(6).fill(null).map(() => ({ current: null }));

  return (
    <div className="app-wrap fade-in" style={{ display:"flex", flexDirection:"column", minHeight:"100vh", padding:"0 32px", position:"relative", overflow:"hidden" }}>
      <Helmet>
        <title>Request Access | Laya</title>
        <meta name="description" content="Request access to the most exclusive network in Kerala." />
      </Helmet>
      {/* Model background */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"url('/model.png')", backgroundSize:"cover", backgroundPosition:"center top", filter:"brightness(0.2) grayscale(0.2)" }} />
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

      {/* ── OTP GATEWAY ENFORCED ── */}
      <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, padding:"16px 20px", marginBottom:32, textAlign:"center", backdropFilter: "blur(10px)" }}>
        <div style={{ fontSize:10, color:"#ff6b6b", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>🛡️ Security Notice</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,.5)", lineHeight:1.6, fontWeight: 300 }}>
          To ensure a genuine community, all users must verify their identity via mobile number and secure OTP verification.
        </div>
      </div>

      {/* ── STEP 1: Phone ── */}
      {step === "phone" && (
        <div className="fade-in">
          <h2 className="serif" style={{ fontSize:26, marginBottom:8, fontWeight: 400 }}>Request Access</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24, fontWeight: 300, lineHeight: 1.5 }}>
            Enter your mobile number to receive a secure verification code.
          </p>
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <div className="input" style={{ width:64, flexShrink:0, textAlign:"center", marginBottom:0, cursor:"default", padding: "16px 0", color:"rgba(255,255,255,0.7)" }}>+91</div>
            <input className="input" style={{ flex:1, marginBottom:0, letterSpacing: "0.05em" }}
              placeholder="Mobile Number" type="tel" maxLength={10}
              value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
              onKeyDown={e => e.key === "Enter" && handleSendOtp()} />
          </div>
          <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:14, marginTop:8, textTransform:"uppercase", letterSpacing:"0.05em" }}
            onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending..." : "Continue"}
          </button>
          <p style={{ color:"rgba(255,255,255,.2)", fontSize:11, textAlign:"center", marginTop:20, lineHeight:1.6, fontWeight: 300 }}>
            By continuing, you agree to our Terms of Service<br/>and Privacy Policy.
          </p>
        </div>
      )}

      {/* ── STEP 2: OTP ── */}
      {step === "otp" && (
        <div className="fade-in">
          <h2 className="serif" style={{ fontSize:26, marginBottom:8, fontWeight: 400 }}>Verify Identity</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24, fontWeight: 300 }}>
            Enter the secure code sent to +91 {phone}
          </p>
          
          <div style={{ display:"flex", gap:10, justifyContent:"space-between", marginBottom:32 }}>
            {otp.map((v, i) => (
              <input key={i}
                ref={el => { refs[i].current = el; }}
                value={v}
                onChange={e => {
                  handleOtpKey(e.target.value, i, refs[i+1]?.current);
                }}
                onKeyDown={e => {
                  if (e.key === "Backspace" && !otp[i] && i > 0) refs[i-1].current?.focus();
                }}
                maxLength={1} type="tel"
                style={{ width: "calc(16.66% - 8px)", height:56, background:"rgba(255,255,255,.02)", border: v ? "1px solid rgba(212, 175, 55, 0.5)" : "1px solid rgba(255,255,255,.1)", borderRadius:12, textAlign:"center", color:"#fcfcfc", fontSize:20, fontWeight:400, fontFamily:"Inter,sans-serif", outline:"none", transition: "all 0.3s ease" }} />
            ))}
          </div>
          <button className="btn-primary" style={{ width:"100%", padding:"16px", fontSize:14, textTransform:"uppercase", letterSpacing:"0.05em" }}
            onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          <button onClick={() => { setStep("phone"); setOtp(["","","","","",""]); }}
            style={{ width:"100%", marginTop:16, padding:"12px", background:"none", border:"none", color:"rgba(255,255,255,.3)", cursor:"pointer", fontSize:12, textTransform:"uppercase", letterSpacing:"0.05em", transition: "color 0.3s ease" }}
            onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
            Change number
          </button>
        </div>
      )}

      {/* ── STEP 3: Name (new users) ── */}
      {step === "name" && (
        <div className="fade-in">
          <h2 className="serif" style={{ fontSize:26, marginBottom:8, fontWeight: 400 }}>Your Details</h2>
          <p style={{ color:"rgba(255,255,255,.4)", fontSize:14, marginBottom:24, fontWeight: 300 }}>
            Please provide your name for your profile.
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

      {/* Recaptcha container for Firebase */}
      <div id="recaptcha-container" />
      </div>
    </div>
  );
}
