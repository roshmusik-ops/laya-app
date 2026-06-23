import { useState } from "react";
import { useApp } from "../contexts/AppContext";

// ── GOOGLE PLAY BILLING (Mock) ──────────────────────────────────────────
export const PLANS = {
  monthly: {
    id:     "laya_monthly",
    label:  "Monthly",
    price:  "₹29.00",
    desc:   "₹29 / month",
    save:   null,
  },
  yearly: {
    id:     "laya_yearly",
    label:  "Yearly",
    price:  "₹199.00",
    desc:   "₹199 / year",
    save:   "Save ₹149",
  },
};

export const ADDONS = {
  superconnect5: { id: "laya_super5", label: "5 SuperConnects", price: "₹9.00" },
  boost:         { id: "laya_boost",  label: "24hr Boost",      price: "₹19.00" },
  verified:      { id: "laya_verified", label: "Verified Badge", price: "₹19.00" },
};

// ── PREMIUM MODAL COMPONENT ───────────────────────────────────────────────
export default function PremiumModal() {
  const { setShowPremium, currentUser, showToast } = useApp();
  const [selected, setSelected] = useState("laya_yearly");

  const features = [
    { icon:"❤️", text:"Unlimited swipes & matches"     },
    { icon:"📹", text:"Unlimited video & audio calls"  },
    { icon:"👀", text:"See who liked your profile"     },
    { icon:"⏰", text:"Extend your 24hr match timer"   },
    { icon:"🖼️", text:"Upload up to 4 photos"          },
    { icon:"💎", text:"1 SuperConnect per day"         },
    { icon:"🚀", text:"1 Profile Boost per month"      },
    { icon:"🔁", text:"Rematch expired connections"    },
    { icon:"🕵️", text:"Incognito mode"                 },
    { icon:"✅", text:"Read receipts in chat"          },
    { icon:"🚫", text:"Zero ads, ever"                 },
  ];

  const handleUpgrade = () => {
    // In a real Android app using Capacitor, you would use a plugin here:
    // e.g. import { GooglePlayBilling } from '@capacitor-community/google-play-billing';
    // await GooglePlayBilling.purchase({ sku: selected });
    
    showToast("Connecting to Google Play... 🛒");
    alert("Google Play Billing integration goes here! \nYou would purchase: " + selected + "\n\n(Requires Android app environment & Play Console setup)");
    setShowPremium(false);
  };

  const handleAddon = (addon) => {
    showToast("Connecting to Google Play... 🛒");
    alert("Google Play In-App Purchase goes here! \nYou would purchase: " + addon.id);
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPremium(false)}>
      <div className="modal" style={{ maxHeight:"92vh", paddingBottom:32 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ marginBottom:16, animation:"fadeIn 1.5s ease both" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div className="serif" style={{ fontSize:32, fontWeight:400, marginBottom:8, letterSpacing:"0.02em" }}>
            <span style={{color:"#fcfcfc"}}>Laya</span><span style={{color:"#d4af37", fontStyle: "italic"}}> Select</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:12, letterSpacing:"0.1em", textTransform: "uppercase", fontWeight:300 }}>
            Exclusive access to our curated network.
          </p>
        </div>

        {/* Plan selector */}
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {Object.values(PLANS).map(plan => (
            <div key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                flex:1, padding:"20px 16px", borderRadius:16, cursor:"pointer", textAlign:"center",
                border: selected === plan.id ? "1px solid rgba(212, 175, 55, 0.6)" : "1px solid rgba(255,255,255,.05)",
                background: selected === plan.id ? "rgba(212, 175, 55, 0.05)" : "rgba(255,255,255,.02)",
                transition:"all .4s ease", position:"relative",
              }}>
              {plan.save && (
                <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:"#d4af37", color:"#050505", fontSize:9, fontWeight:600, padding:"4px 12px", borderRadius:20, whiteSpace:"nowrap", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {plan.save}
                </div>
              )}
              <div style={{ fontWeight:400, fontSize:14, marginBottom:8, color: "rgba(255,255,255,0.7)" }}>{plan.label}</div>
              <div style={{ color:"#d4af37", fontWeight:400, fontSize:22 }}>{plan.desc}</div>
            </div>
          ))}
        </div>

        {/* Features list */}
        <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", borderRadius:16, padding:"16px 20px", marginBottom:24 }}>
          {features.map(f => (
            <div key={f.text} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,.03)" }}>
              <span style={{ fontSize:16, width:24, textAlign:"center", opacity: 0.8 }}>{f.icon}</span>
              <span style={{ fontSize:13, color:"rgba(255,255,255,.7)", fontWeight: 300 }}>{f.text}</span>
              <span style={{ marginLeft:"auto", color:"#d4af37" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </span>
            </div>
          ))}
        </div>

        {/* Upgrade button */}
        <button className="btn-premium" style={{ width:"100%", padding:"16px", fontSize:14, marginBottom:12, textTransform: "uppercase", letterSpacing: "0.05em" }}
          onClick={handleUpgrade}>
          Subscribe with Google Play
        </button>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.3)", fontSize:10, marginBottom:24, fontWeight: 300, letterSpacing:"0.05em" }}>
          Secure payment via Google Play Billing. Cancel anytime.
        </p>

        {/* Separator */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.08)" }} />
          <span style={{ color:"rgba(255,255,255,.3)", fontSize:11, fontWeight:700 }}>OR BUY INDIVIDUALLY</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.08)" }} />
        </div>

        {/* Addons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24 }}>
          {Object.values(ADDONS).map(a => (
            <button key={a.label} onClick={() => handleAddon(a)}
              style={{ padding:"16px 8px", borderRadius:12, background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.05)", color:"#fcfcfc", cursor:"pointer", textAlign:"center", transition:"all .3s ease" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="rgba(212, 175, 55, 0.4)"}
              onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,.05)"}>
              <div style={{ fontSize:10, fontWeight:400, marginBottom:6, color: "rgba(255,255,255,0.7)" }}>{a.label}</div>
              <div style={{ color:"#d4af37", fontWeight:400, fontSize:14 }}>{a.price}</div>
            </button>
          ))}
        </div>

        <button onClick={() => setShowPremium(false)}
          style={{ width:"100%", padding:"12px", background:"none", border:"none", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:12, textTransform: "uppercase", letterSpacing: "0.05em", transition: "color 0.3s ease" }}
          onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.8)"}
          onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
          Not Now
        </button>
      </div>
    </div>
  );
}
