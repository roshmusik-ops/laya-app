import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import ScrollReveal from "../components/ScrollReveal";

const LIVE_ROOMS = [
  {
    id: "r1",
    title: "Late Night Vibes 🌙",
    host: "Meera Nair",
    hostPhoto: "/girl1.png",
    listeners: 42,
    speakers: 3,
    topic: "Chill",
    color: "linear-gradient(135deg, #667eea, #764ba2)",
    live: true,
    participants: [
      { name: "Meera", photo: "/girl1.png", speaking: true },
      { name: "Sneha", photo: "/sneha.png", speaking: false },
      { name: "Vishnu", photo: "/vishnu.png", speaking: true },
    ]
  },
  {
    id: "r2",
    title: "Malayalam Music Lovers 🎶",
    host: "Jithin Joseph",
    hostPhoto: "/jithin.png",
    listeners: 89,
    speakers: 5,
    topic: "Music",
    color: "linear-gradient(135deg, #f093fb, #f5576c)",
    live: true,
    participants: [
      { name: "Jithin", photo: "/jithin.png", speaking: true },
      { name: "Gopika", photo: "/gopika.png", speaking: false },
      { name: "Appu", photo: "/appu.png", speaking: true },
      { name: "Ananya", photo: "/ananya.png", speaking: false },
    ]
  },
  {
    id: "r3",
    title: "Dating Stories & Advice 💕",
    host: "Priya Pillai",
    hostPhoto: "/priya.png",
    listeners: 156,
    speakers: 4,
    topic: "Dating",
    color: "linear-gradient(135deg, #fa709a, #fee140)",
    live: true,
    participants: [
      { name: "Priya", photo: "/priya.png", speaking: true },
      { name: "Midhun", photo: "/midhun.png", speaking: true },
      { name: "Nandita", photo: "/nandita.png", speaking: false },
    ]
  },
  {
    id: "r4",
    title: "Kerala Travel Buddies ✈️",
    host: "Appu Mathew",
    hostPhoto: "/appu.png",
    listeners: 34,
    speakers: 2,
    topic: "Travel",
    color: "linear-gradient(135deg, #4facfe, #00f2fe)",
    live: true,
    participants: [
      { name: "Appu", photo: "/appu.png", speaking: true },
      { name: "Arundhati", photo: "/arundhati.png", speaking: false },
    ]
  },
  {
    id: "r5",
    title: "Friday Night Karaoke 🎤",
    host: "Ananya Menon",
    hostPhoto: "/ananya.png",
    listeners: 67,
    speakers: 6,
    topic: "Fun",
    color: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    live: false,
    scheduledAt: "9:00 PM Tonight",
    participants: []
  },
  {
    id: "r6",
    title: "Startup Founders Kerala 🚀",
    host: "Vishnu Prasad",
    hostPhoto: "/vishnu.png",
    listeners: 28,
    speakers: 3,
    topic: "Business",
    color: "linear-gradient(135deg, #ffecd2, #fcb69f)",
    live: false,
    scheduledAt: "Tomorrow 7:00 PM",
    participants: []
  }
];

export default function LiveRoomTab() {
  const { showToast, currentUser } = useApp();
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [raised, setRaised] = useState(false);

  const liveRooms = LIVE_ROOMS.filter(r => r.live);
  const scheduled = LIVE_ROOMS.filter(r => !r.live);

  if (joinedRoom) {
    const room = LIVE_ROOMS.find(r => r.id === joinedRoom);
    return (
      <div className="fade-in" style={{ padding: "16px", minHeight: "85vh", paddingBottom: 100 }}>
        {/* Room Header */}
        <div style={{ background: room.color, borderRadius: 20, padding: "24px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <button onClick={() => setJoinedRoom(null)}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(10px)" }}>
                ← Leave Room
              </button>
              <div style={{ background: "rgba(255,0,0,0.8)", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: "pulse 1.5s infinite" }} />
                LIVE
              </div>
            </div>
            <h2 className="serif" style={{ fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{room.title}</h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Hosted by {room.host} · {room.listeners + 1} listening</p>
          </div>
        </div>

        {/* Speakers Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            Speakers
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {room.participants.filter(p => p.speaking).map((p, i) => (
              <ScrollReveal key={i} animation="popIn" delay={i * 0.1}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
                      border: "3px solid #22c55e",
                      boxShadow: "0 0 20px rgba(34,197,94,0.3)",
                      animation: "pulse 2s infinite"
                    }}>
                      <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: "#22c55e", border: "2px solid #0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🎙️</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{p.name}</span>
                </div>
              </ScrollReveal>
            ))}
            {/* You */}
            <ScrollReveal animation="popIn" delay={0.3}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", overflow: "hidden",
                    border: isMuted ? "3px solid rgba(255,255,255,0.15)" : "3px solid #22c55e",
                    boxShadow: isMuted ? "none" : "0 0 20px rgba(34,197,94,0.3)"
                  }}>
                    {currentUser?.photos?.[0]
                      ? <img src={currentUser.photos[0]} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👤</div>}
                  </div>
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: isMuted ? "#ef4444" : "#22c55e", border: "2px solid #0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                    {isMuted ? "🔇" : "🎙️"}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#d4af37" }}>You</span>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Listeners Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
            Listeners · {room.listeners}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {room.participants.filter(p => !p.speaking).map((p, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.08)" }}>
                  <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{p.name}</span>
              </div>
            ))}
            {/* Placeholder listeners */}
            {Array(Math.min(room.listeners, 8) - room.participants.filter(p => !p.speaking).length).fill(0).map((_, i) => (
              <div key={`ph-${i}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Listener</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls */}
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "rgba(20,20,20,0.95)", backdropFilter: "blur(20px)",
          borderRadius: 30, padding: "12px 20px", display: "flex", gap: 16, alignItems: "center",
          border: "1px solid rgba(255,255,255,0.08)", zIndex: 60
        }}>
          <button onClick={() => setIsMuted(!isMuted)}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              background: isMuted ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
              border: `2px solid ${isMuted ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease"
            }}>
            {isMuted ? "🔇" : "🎙️"}
          </button>
          <button onClick={() => { setRaised(!raised); showToast(raised ? "Hand lowered" : "✋ Hand raised! Host will invite you to speak"); }}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              background: raised ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${raised ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s ease"
            }}>
            ✋
          </button>
          <button onClick={() => showToast("💬 Chat coming soon!")}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.1)",
              color: "#fff", fontSize: 20, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
            💬
          </button>
          <button onClick={() => { setJoinedRoom(null); showToast("Left the room"); }}
            style={{
              padding: "10px 20px", borderRadius: 20,
              background: "rgba(239,68,68,0.2)", border: "2px solid rgba(239,68,68,0.4)",
              color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "all 0.3s ease"
            }}>
            Leave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ padding: "16px", minHeight: "85vh", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop: 10 }}>
        <div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Live <span className="glow" style={{ color: "#d4af37" }}>Rooms</span></div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Join audio rooms & meet new people</p>
        </div>
        <button onClick={() => showToast("🎙️ Create Room coming soon!")}
          style={{
            background: "linear-gradient(135deg, #d4af37, #b8941f)", border: "none",
            color: "#0a0a0a", padding: "10px 18px", borderRadius: 20,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 15px rgba(212,175,55,0.3)"
          }}>
          + Create Room
        </button>
      </div>

      {/* Live Now */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Live Now</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {liveRooms.map((room, i) => (
            <ScrollReveal key={room.id} animation="slideUp" delay={i * 0.1}>
              <div
                onClick={() => { setJoinedRoom(room.id); setIsMuted(true); setRaised(false); }}
                style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16, padding: "16px", cursor: "pointer",
                  transition: "all 0.3s ease", position: "relative", overflow: "hidden"
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
              >
                {/* Gradient accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: room.color }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{room.title}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Hosted by {room.host}</div>
                  </div>
                  <div style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", padding: "4px 10px", borderRadius: 12, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", animation: "pulse 1.5s infinite" }} />
                    LIVE
                  </div>
                </div>

                {/* Participants */}
                <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", marginRight: 10 }}>
                    {room.participants.slice(0, 4).map((p, j) => (
                      <div key={j} style={{
                        width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                        border: "2px solid #0a0a0a", marginLeft: j > 0 ? -8 : 0,
                        position: "relative", zIndex: 4 - j
                      }}>
                        <img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    {room.speakers} speaking · {room.listeners} listening
                  </div>
                </div>

                {/* Join button */}
                <div style={{
                  background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)",
                  borderRadius: 12, padding: "8px", textAlign: "center",
                  fontSize: 12, fontWeight: 700, color: "#d4af37",
                  transition: "all 0.3s ease"
                }}>
                  🎧 Tap to Join
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Scheduled */}
      {scheduled.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            📅 Scheduled
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {scheduled.map((room, i) => (
              <ScrollReveal key={room.id} animation="slideRight" delay={i * 0.1}>
                <div style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{room.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                      {room.host} · {room.scheduledAt}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); showToast("🔔 You'll be notified when this room goes live!"); }}
                    style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12, padding: "8px 14px", color: "rgba(255,255,255,0.6)",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0
                    }}>
                    🔔 Remind
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
