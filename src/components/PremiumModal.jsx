import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { purchasePackage, fetchOfferings } from "../services/revenuecat";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

// ── GOOGLE PLAY BILLING (Mock) ──────────────────────────────────────────
export const PLANS = {
  gold_monthly: {
    id:     "laya_gold_monthly",
    label:  "Gold Monthly",
    price:  "₹99.00",
    desc:   "₹99 / mo",
    save:   null,
    color:  "#d4af37"
  },
  gold_yearly: {
    id:     "laya_gold_yearly",
    label:  "Gold Yearly",
    price:  "₹999.00",
    desc:   "₹999 / yr",
    save:   "Save ₹189",
    color:  "#d4af37"
  },
  plat_monthly: {
    id:     "laya_plat_monthly",
    label:  "Platinum Monthly",
    price:  "₹199.00",
    desc:   "₹199 / mo",
    save:   null,
    color:  "#ff6b6b"
  },
  plat_yearly: {
    id:     "laya_plat_yearly",
    label:  "Platinum Yearly",
    price:  "₹1999.00",
    desc:   "₹1999 / yr",
    save:   "Save ₹389",
    color:  "#ff6b6b"
  },
};

export const ADDONS = {
  superconnect5: { id: "laya_super5", label: "5 SuperConnects", price: "₹9.00" },
  boost:         { id: "laya_boost",  label: "24hr Boost",      price: "₹19.00" },
  verified:      { id: "laya_verified", label: "Verified Badge", price: "₹19.00" },
};

// ── PREMIUM MODAL COMPONENT ───────────────────────────────────────────────
export default function PremiumModal() {
  const { setShowPremium, currentUser, setCurrentUser, showToast } = useApp();
  const [selected, setSelected] = useState("laya_gold_yearly");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [rcPackages, setRcPackages] = useState([]);
  const [activationKey, setActivationKey] = useState("");

  const SP_LINKS = {
    laya_gold_monthly: "https://superprofile.bio/vp/gold-monthly",
    laya_gold_yearly: "https://superprofile.bio/vp/gold-yearly",
    laya_plat_monthly: "https://superprofile.bio/vp/platinum-monthly",
    laya_plat_yearly: "https://superprofile.bio/vp/platinum-yearly",
    laya_super5: "https://superprofile.bio/vp/5-superconnects",
    laya_boost: "https://superprofile.bio/vp/--24hr-profile-boost",
    laya_verified: "https://superprofile.bio/vp/--verified-badge"
  };

  useEffect(() => {
    const loadOfferings = async () => {
      const pkgs = await fetchOfferings();
      if (pkgs && pkgs.length > 0) {
        setRcPackages(pkgs);
      }
    };
    loadOfferings();
  }, []);

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

  const handleUpgrade = async () => {
    setIsPurchasing(true);
    showToast("Connecting to Google Play... 🛒");
    
    // Find the actual RevenueCat package if loaded
    const pkgToBuy = rcPackages.find(p => p.identifier === selected);
    
    if (pkgToBuy) {
      const result = await purchasePackage(pkgToBuy);
      if (result.success) {
        showToast("Welcome to Premium! 🎉", "success");
        // Update user state
        setCurrentUser({ ...currentUser, premium: true, plan: selected.includes("gold") ? "Gold" : "Platinum" });
        setShowPremium(false);
      } else {
        showToast("Purchase cancelled or failed.", "error");
      }
    } else {
      // Fallback for Web Demo
      setTimeout(() => {
        alert("Google Play Billing integration is active! \nBut you are on the Web version.\n\nSimulating successful purchase...");
        setCurrentUser({ ...currentUser, premium: true, plan: selected.includes("gold") ? "Gold" : "Platinum" });
        setShowPremium(false);
      }, 1000);
    }
    setIsPurchasing(false);
  };

  const handleAddon = (addon) => {
    if (rcPackages.length === 0) {
      window.open(SP_LINKS[addon.id] || "https://superprofile.bio/vp", "_blank");
    } else {
      showToast("Connecting to Google Play... 🛒");
      alert("Google Play In-App Purchase goes here! \nYou would purchase: " + addon.id);
    }
  };

  const handleActivationKey = async () => {
    const key = activationKey.trim().toUpperCase();
    const now = Date.now();
    let updates = {};

    if (key === "LAYA2026") {
      updates = { premium: true, premiumUntil: now + 100 * 365 * 24 * 60 * 60 * 1000, plan: "Gold" };
      showToast("Master Key applied! 🎉", "success");
    } else if (key === "LAYA-MONTHLY") {
      updates = { premium: true, premiumUntil: now + 30 * 24 * 60 * 60 * 1000, plan: "Gold" };
      showToast("30 Days Gold applied! 🎉", "success");
    } else if (key === "LAYA-YEARLY") {
      updates = { premium: true, premiumUntil: now + 365 * 24 * 60 * 60 * 1000, plan: "Gold" };
      showToast("1 Year Gold applied! 🎉", "success");
    } else if (key === "LAYAPLATINUM") {
      updates = { premium: true, premiumUntil: now + 30 * 24 * 60 * 60 * 1000, plan: "Platinum" };
      showToast("30 Days Platinum applied! 🎉", "success");
    } else if (key === "LAYA-BOOST") {
      updates = { boostUntil: now + 24 * 60 * 60 * 1000 };
      showToast("24hr Boost active! 🚀", "success");
    } else if (key === "LAYA-VERIFIED") {
      updates = { verified: true };
      showToast("Profile Verified! ✅", "success");
    } else {
      showToast("Invalid or expired activation key.", "error");
      return;
    }

    try {
      await updateDoc(doc(db, "users", currentUser.uid), updates);
      setCurrentUser({ ...currentUser, ...updates });
      setShowPremium(false);
    } catch (err) {
      showToast("Error applying key.", "error");
    }
  };

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && setShowPremium(false)}>
      <div className="modal" style={{ maxHeight:"92vh", paddingBottom:32, width: "90%", maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ marginBottom:12, animation:"fadeIn 1.5s ease both" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div className="serif" style={{ fontSize:28, fontWeight:400, marginBottom:8, letterSpacing:"0.02em" }}>
            <span style={{color:"#fcfcfc"}}>Laya</span><span style={{color:"#d4af37", fontStyle: "italic"}}> Select</span>
          </div>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:11, letterSpacing:"0.1em", textTransform: "uppercase", fontWeight:300 }}>
            Exclusive access to our curated network.
          </p>
        </div>

        {/* Plan selector (2x2 Grid) */}
        <div style={{ display:"grid", gridTemplateColumns: "1fr 1fr", gap:12, marginBottom:24 }}>
          {Object.values(PLANS).map(plan => (
            <div key={plan.id}
              onClick={() => setSelected(plan.id)}
              style={{
                padding:"16px 12px", borderRadius:16, cursor:"pointer", textAlign:"center",
                border: selected === plan.id ? `1px solid ${plan.color}` : "1px solid rgba(255,255,255,.05)",
                background: selected === plan.id ? `${plan.color}15` : "rgba(255,255,255,.02)",
                transition:"all .4s ease", position:"relative",
              }}>
              {plan.save && (
                <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)", background:plan.color, color:"#050505", fontSize:9, fontWeight:600, padding:"4px 10px", borderRadius:20, whiteSpace:"nowrap", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {plan.save}
                </div>
              )}
              <div style={{ fontWeight:500, fontSize:12, marginBottom:6, color: plan.color }}>{plan.label}</div>
              <div style={{ color:"#fcfcfc", fontWeight:400, fontSize:18 }}>{plan.desc}</div>
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
        <button className="btn-premium" style={{ width:"100%", padding:"16px", fontSize:14, marginBottom:12, textTransform: "uppercase", letterSpacing: "0.05em", opacity: isPurchasing ? 0.7 : 1 }}
          onClick={() => {
            if (rcPackages.length === 0) {
              window.open(SP_LINKS[selected] || "https://superprofile.bio/vp", "_blank");
            } else {
              handleUpgrade();
            }
          }} disabled={isPurchasing}>
          {rcPackages.length === 0 ? "Subscribe via Superprofile" : (isPurchasing ? "Processing..." : "Subscribe with Google Play")}
        </button>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.3)", fontSize:10, marginBottom:24, fontWeight: 300, letterSpacing:"0.05em" }}>
          {rcPackages.length === 0 ? "Web payments securely handled by Superprofile." : "Secure payment via Google Play Billing. Cancel anytime."}
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

        {/* Separator */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.08)" }} />
          <span style={{ color:"rgba(255,255,255,.3)", fontSize:11, fontWeight:700 }}>HAVE AN ACTIVATION KEY?</span>
          <div style={{ flex:1, height:1, background:"rgba(255,255,255,.08)" }} />
        </div>

        {/* Activation Key Input */}
        <div style={{ display:"flex", gap: 10, marginBottom:24 }}>
          <input className="input" placeholder="Enter License Key" value={activationKey} onChange={e => setActivationKey(e.target.value)} style={{ flex: 1, marginBottom: 0, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }} />
          <button className="btn-hot" onClick={handleActivationKey} disabled={!activationKey} style={{ padding: "0 20px", fontSize: 13, textTransform: "uppercase" }}>Apply</button>
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
