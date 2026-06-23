import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const TABS = [
  { id:"discover",  icon:"🔥", label:"Discover" },
  { id:"matches",   icon:"💬", label:"Matches"  },
  { id:"spotify",   icon:"🎵", label:"Roshmusik" },
  { id:"community", icon:"🏘️", label:"Community" },
  { id:"profile",   icon:"👤", label:"Profile"  },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.split("/").pop();
  const { matches } = useApp();
  const newMatches = matches.filter(m => !m.firstMessageSent).length;

  const getBadge = (id) => {
    if (id === "matches") return newMatches;
    return 0;
  };

  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:800, background:"rgba(5,5,5,.85)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,.05)", display:"flex", padding:"8px 0 18px", zIndex:100, transition: "max-width 0.3s ease" }}>
      {TABS.map(tab => {
        const badge = getBadge(tab.id);
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} className={`tab-btn ${active ? "active" : ""}`}
            onClick={() => navigate(`/app/${tab.id}`)}
            style={{ color: active ? "#d4af37" : "rgba(255,255,255,.3)" }}>
            <div style={{ position:"relative" }}>
              <span style={{ fontSize:21 }}>{tab.icon}</span>
              {badge > 0 && (
                <div style={{ position:"absolute", top:-5, right:-7, background:"#d4af37", color:"#050505", fontSize:9, fontWeight:800, width:15, height:15, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {badge > 9 ? "9+" : badge}
                </div>
              )}
            </div>
            <span style={{ fontSize:9, fontWeight:700, marginTop:1 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
