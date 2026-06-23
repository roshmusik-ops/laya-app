import { Helmet } from "react-helmet-async";
import { useApp } from "../contexts/AppContext";

export default function WaitlistScreen() {
  const { currentUser } = useApp();

  return (
    <div className="app-wrap fade-in" style={{ display:"flex", flexDirection:"column", minHeight:"100vh", padding:"0 32px", position:"relative", overflow:"hidden" }}>
      <Helmet>
        <title>Application Under Review | Laya</title>
      </Helmet>
      
      {/* Background */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"url('/model.png')", backgroundSize:"cover", backgroundPosition:"center top", filter:"brightness(0.1) grayscale(0.3)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.95) 60%, rgba(5,5,5,1) 100%)" }} />
      
      <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", flex:1, justifyContent:"center", alignItems:"center", textAlign:"center", paddingBottom: 64 }}>
        
        {/* Animated Icon */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(212, 175, 55, 0.05)", border: "1px solid rgba(212, 175, 55, 0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom: 32, animation: "pulse 2s infinite" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 className="serif" style={{ fontSize: 32, fontWeight: 400, color: "#fcfcfc", marginBottom: 16 }}>
          Application Under Review
        </h2>
        
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.6, fontWeight: 300, maxWidth: 300 }}>
          Thank you for applying, <span style={{color: "#fcfcfc", fontWeight: 500}}>{currentUser?.name}</span>. 
          Laya is a highly curated community. Our membership committee is currently reviewing your profile to ensure network exclusivity.
        </p>

        <div style={{ marginTop: 48, background: "rgba(255,255,255,0.03)", padding: "16px 24px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
            Current Status
          </div>
          <div style={{ display:"flex", alignItems:"center", gap: 8, justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#d4af37", boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)" }} />
            <span style={{ color: "#d4af37", fontWeight: 500, fontSize: 14, letterSpacing: "0.05em" }}>Pending Approval</span>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,.3)", fontSize: 12, marginTop: 40, fontWeight: 300 }}>
          You will be notified via SMS when your access is granted.
        </p>
      </div>
    </div>
  );
}
