import { useApp } from "../contexts/AppContext";

export default function NotificationsTab() {
  const { notifications, markNotifRead } = useApp();
  const icons = { like:"💫", match:"🎉", message:"💬", boost:"🚀", default:"🔔" };
  const unread = notifications.filter(n => !n.read).length;
  return (
    <div style={{ padding:"14px", animation:"fadeIn .4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div className="serif" style={{ fontSize:22 }}>Notifications {unread > 0 && <span style={{ color:"#ff6b6b", fontSize:16 }}>({unread})</span>}</div>
      </div>
      {notifications.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,.3)" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔔</div>
          <p style={{ fontWeight:700 }}>No notifications yet</p>
        </div>
      ) : notifications.map(n => (
        <div key={n.id} onClick={() => markNotifRead(n.id)}
          style={{ padding:"13px 15px", borderRadius:14, marginBottom:8, cursor:"pointer",
            background: n.read ? "rgba(255,255,255,.02)" : "rgba(255,107,107,.06)",
            border: `1px solid ${n.read ? "rgba(255,255,255,.06)" : "rgba(255,107,107,.18)"}`,
            transition:"all .2s" }}>
          <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{icons[n.type] || icons.default}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, lineHeight:1.5, fontWeight: n.read ? 400 : 700 }}>{n.text}</div>
              <div style={{ color:"rgba(255,255,255,.3)", fontSize:11, marginTop:3 }}>{n.time}</div>
            </div>
            {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#ff6b6b", flexShrink:0, marginTop:5 }} />}
          </div>
        </div>
      ))}
    </div>
  );
}
