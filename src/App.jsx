import "./index.css";
import { useRef, useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppProvider, useApp } from "./contexts/AppContext";
import { Capacitor } from "@capacitor/core";

// Screens
import AuthScreen       from "./screens/AuthScreen";
import ProfileSetup     from "./screens/ProfileSetup";
import DiscoverTab      from "./screens/DiscoverTab";
import MatchesTab       from "./screens/MatchesTab";
import ChatScreen       from "./screens/ChatScreen";
import VideoCallScreen  from "./screens/VideoCallScreen";
import AudioCallScreen  from "./screens/AudioCallScreen";
import LandingPage      from "./screens/LandingPage";

// Components
import BottomNav         from "./components/BottomNav";
import MatchCelebration  from "./components/MatchCelebration";
import PremiumModal      from "./components/PremiumModal";

// Inline screens (small enough to keep here)
import NotificationsTab  from "./screens/NotificationsTab";
import ProfileTab        from "./screens/ProfileTab";
import CommunityTab      from "./screens/CommunityTab";
import AdminDashboard    from "./screens/AdminDashboard";
import SpotifyTab        from "./screens/SpotifyTab";

// ── SPLASH (LANDING PAGE) ──────────────────────────────────────────────────────
function SplashScreen() {
  const navigate = useNavigate();

  const backgroundCards = [
    { name: "Meera", age: 24, img: "/fake1.jpg", rotate: -12, top: "5%", left: "2%", duration: "6s" },
    { name: "Sneha", age: 22, img: "/fake2.jpg", rotate: -5, top: "2%", left: "25%", duration: "5s" },
    { name: "Priya", age: 23, img: "/fake3.jpg", rotate: 8, top: "6%", left: "80%", duration: "7s" },
    { name: "Arundhati", age: 38, img: "/fake4.jpg", rotate: -15, top: "30%", left: "2%", duration: "8s" },
    { name: "Nandita", age: 45, img: "/fake5.jpg", rotate: 12, top: "35%", left: "85%", duration: "6s" },
    { name: "Shalini", age: 42, img: "/fake6.jpg", rotate: -8, top: "55%", left: "1%", duration: "7s" },
    { name: "Divya", age: 26, img: "/fake7.jpg", rotate: 10, top: "60%", left: "88%", duration: "5s" },
    { name: "Kavya", age: 25, img: "/fake8.jpg", rotate: -10, top: "80%", left: "5%", duration: "8s" },
    { name: "Anjali", age: 28, img: "/fake9.jpg", rotate: 5, top: "85%", left: "25%", duration: "6s" },
    { name: "Riya", age: 23, img: "/fake10.jpg", rotate: -12, top: "82%", left: "75%", duration: "7s" }
  ];

  const floatingElements = [
    { text: "❤️", top: "10%", left: "15%", duration: "7s", size: 30, rotate: 15 },
    { text: "💖", top: "42%", left: "20%", duration: "9s", size: 24, rotate: -10 },
    { text: "💋", top: "15%", left: "65%", duration: "6s", size: 36, rotate: 20 },
    { text: "Anuragam", top: "58%", left: "88%", duration: "8s", size: 22, rotate: -15 },
    { text: "🔥", top: "72%", left: "12%", duration: "10s", size: 28, rotate: 10 },
    { text: "Vibe", top: "28%", left: "48%", duration: "5s", size: 20, rotate: -25 },
    { text: "Match", top: "68%", left: "62%", duration: "7s", size: 22, rotate: 15 },
    { text: "Chemistry", top: "35%", left: "90%", duration: "8s", size: 18, rotate: -30 },
    { text: "Pranayam", top: "82%", left: "45%", duration: "9s", size: 24, rotate: 20 },
    { text: "Flirt", top: "25%", left: "85%", duration: "6s", size: 24, rotate: -15 },
    { text: "Swipe", top: "5%", left: "55%", duration: "8s", size: 22, rotate: 10 },
    { text: "Crush", top: "85%", left: "25%", duration: "7s", size: 20, rotate: -20 },
  ];

  // Equalizer bar animation durations
  const eqBars = [
    { h: "eqBar1", dur: "0.8s", delay: "0s" },
    { h: "eqBar2", dur: "0.6s", delay: "0.1s" },
    { h: "eqBar3", dur: "0.9s", delay: "0.2s" },
    { h: "eqBar4", dur: "0.5s", delay: "0.05s" },
    { h: "eqBar5", dur: "0.7s", delay: "0.15s" },
    { h: "eqBar1", dur: "0.65s", delay: "0.25s" },
    { h: "eqBar3", dur: "0.85s", delay: "0.1s" },
    { h: "eqBar2", dur: "0.55s", delay: "0.2s" },
    { h: "eqBar4", dur: "0.75s", delay: "0s" },
  ];

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", minHeight:"100vh", position:"relative", overflow:"hidden", background: "linear-gradient(160deg, #0a0000 0%, #2d0505 25%, #1a0000 50%, #3a0a0a 75%, #0a0000 100%)", color: "#fcfcfc" }}>
      <Helmet>
        <title>Laya | Where Music Meets Desire</title>
        <meta name="description" content="Where music meets desire. Find your rhythm, find your match." />
      </Helmet>

      {/* RED GLOW ORBS — ambient background lighting */}
      <div className="red-glow-orb" style={{ width: 350, height: 350, top: "5%", left: "-8%", animationDelay: "0s" }} />
      <div className="red-glow-orb" style={{ width: 300, height: 300, top: "55%", right: "-10%", animationDelay: "-3s" }} />
      <div className="red-glow-orb" style={{ width: 250, height: 250, top: "35%", left: "45%", animationDelay: "-1.5s", background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)" }} />
 
      {/* ★ BIG PROFILE CARDS — the main attraction, FULL visibility */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 1, overflow: "hidden", pointerEvents: "none" }}>
        {backgroundCards.map((card, idx) => (
          <div key={idx} 
            className="moving-card"
            style={{
              position: "absolute",
              width: 180,
              height: 260,
              borderRadius: 20,
              overflow: "hidden",
              border: "2px solid rgba(255, 60, 60, 0.25)",
              background: "rgba(15, 0, 0, 0.5)",
              top: card.top,
              left: card.left,
              boxShadow: "0 16px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,45,45,0.12), inset 0 0 20px rgba(255,45,45,0.05)",
              transition: "all 0.5s ease",
              "--rotate": `${card.rotate}deg`,
              "--duration": card.duration
            }}>
            <img src={card.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px", background: "linear-gradient(transparent, rgba(0,0,0,0.92))" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}>{card.name}, {card.age}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>♫ Music lover</div>
            </div>
            {/* Red shimmer edge */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, transparent, rgba(255,60,60,0.6), transparent)", animation: "shimmer 3s linear infinite", backgroundSize: "200% 100%" }} />
          </div>
        ))}
      </div>

      {/* Floating Elements (Emojis & Crooked Words) */}
      {floatingElements.map((el, i) => (
        <span key={i} className="floating-instrument" style={{ 
          top: el.top, 
          left: el.left, 
          fontSize: el.size, 
          "--duration": el.duration, 
          fontWeight: 700, 
          color: "rgba(255, 100, 100, 0.6)", 
          textShadow: "0 0 20px rgba(255, 45, 45, 0.3)",
          transform: `rotate(${el.rotate}deg)`,
          fontFamily: "'Dancing Script', cursive"
        }}>
          {el.text}
        </span>
      ))}

      {/* FLOWING SVG MUSIC WAVES — 3 layers */}
      <div className="music-wave-container">
        <svg viewBox="0 0 120 28" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <path className="music-wave" d="M0 18 Q 15 8, 30 18 T 60 18 T 90 18 T 120 18 T 150 18 T 180 18 T 210 18 T 240 18 L 240 28 L 0 28 Z" 
            style={{ fill: "rgba(255, 45, 45, 0.35)" }} />
          <path className="music-wave" d="M0 20 Q 20 10, 40 20 T 80 20 T 120 20 T 160 20 T 200 20 T 240 20 L 240 28 L 0 28 Z" 
            style={{ animationDelay: "-3s", fill: "rgba(212, 175, 55, 0.2)" }} />
          <path className="music-wave" d="M0 22 Q 25 14, 50 22 T 100 22 T 150 22 T 200 22 T 240 22 L 240 28 L 0 28 Z" 
            style={{ animationDelay: "-6s", fill: "rgba(255, 100, 100, 0.2)" }} />
        </svg>
      </div>

      {/* Top Navbar */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", background: "transparent" }}>
        <div className="serif" style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.02em", cursor: "pointer" }} onClick={() => navigate("/")}>
          <span className="glow-gold">Laya</span>
        </div>
        
        <nav style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
          <span style={{ cursor: "pointer" }} className="nav-item">Products</span>
          <span style={{ cursor: "pointer" }} className="nav-item">Learn</span>
          <span style={{ cursor: "pointer" }} className="nav-item">Safety</span>
          <span style={{ cursor: "pointer" }} className="nav-item">Support</span>
        </nav>

        {/* Log in Button */}
        <button onClick={() => navigate("/app/discover")}
          style={{ background: "linear-gradient(135deg, #ff4444, #cc0000)", color: "#fff", border: "none", borderRadius: 24, padding: "9px 26px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(255,45,45,0.25)" }}>
          Log in
        </button>
      </header>

      {/* ★ HERO — Glassmorphism panel over visible profile cards */}
      <div style={{ position: "relative", zIndex: 3, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", marginTop: "12vh" }}>
        
        {/* Glass hero panel - Bubble Style */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.03)", 
          backdropFilter: "blur(28px)", 
          WebkitBackdropFilter: "blur(28px)", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "50% 50% 40% 40%", 
          padding: "60px 40px 50px", 
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 0 40px rgba(255,255,255,0.05)",
        }}>
          {/* LAYA Logo with Crooked Stamp */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
            <div className="serif" style={{ fontSize: "80px", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1 }}>
              <span className="glow-gold" style={{ textShadow: "0 0 50px rgba(212,175,55,0.3), 0 0 100px rgba(212,175,55,0.1)" }}>Laya</span>
            </div>
            {/* Crooked word over logo */}
            <div style={{ 
              position: "absolute", 
              top: "-15px", 
              left: "-10px", 
              color: "#ff3c3c", 
              fontFamily: "'Dancing Script', cursive", 
              fontSize: "26px", 
              fontWeight: 800, 
              transform: "rotate(-10deg)",
              textShadow: "0 2px 10px rgba(255,45,45,0.4)"
            }}>
              Kerala's Own
            </div>
            {/* Crooked word bottom right */}
            <div style={{ 
              position: "absolute", 
              bottom: "-5px", 
              right: "-30px", 
              color: "#ff3c3c", 
              fontFamily: "'Dancing Script', cursive", 
              fontSize: "24px", 
              fontWeight: 800, 
              transform: "rotate(-15deg)",
              textShadow: "0 2px 10px rgba(255,45,45,0.4)"
            }}>
              Pranayam
            </div>
          </div>

          {/* Equalizer Visualizer */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40, marginBottom: 14, justifyContent: "center" }}>
            {eqBars.map((bar, i) => (
              <div key={i} className="eq-bar" style={{ animation: `${bar.h} ${bar.dur} ease-in-out infinite alternate`, animationDelay: bar.delay }} />
            ))}
          </div>
          
          {/* MARQUEE SLOGAN */}
          <div style={{ width: "100%", overflow: "hidden", marginBottom: 24, height: 45 }}>
            <p className="slogan-marquee" style={{ 
              color: "#ff6b6b", 
              fontSize: "28px", 
              fontFamily: "'Dancing Script', cursive", 
              fontWeight: 700,
              textShadow: "0 0 30px rgba(255,45,45,0.4), 0 0 60px rgba(255,45,45,0.15)"
            }}>
              🔥 Your vibe attracts your tribe — Let the music decide 🔥
            </p>
          </div>

          {/* Subtitle */}
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 28 }}>
            Where Music Meets Desire
          </p>
          
          <button className="btn-hot" 
            onClick={() => navigate("/request-access")}
            style={{
              padding: "16px 48px",
              fontSize: "15px",
              width: "100%",
              maxWidth: 300,
            }}>
            Create account
          </button>

          {/* Roshmusik Live badge */}
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", opacity: 0.5 }}>
            <span style={{ fontSize: 14, color: "#1DB954" }}>🎵</span>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Powered by Roshmusik Live Tracks</span>
          </div>
        </div>
      </div>

      {/* ═══ PRICING / RATES SECTION ═══ */}
      <div style={{ position: "relative", zIndex: 5, padding: "80px 24px", background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 20%, rgba(10,0,0,0.95) 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 className="serif" style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, color: "#fff" }}>Membership Plans</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 48, letterSpacing: "0.05em" }}>Choose your vibe. Upgrade anytime.</p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {/* FREE */}
            <div style={{ flex: "1 1 240px", maxWidth: 280, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 28px", textAlign: "center", transition: "all 0.3s ease" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Free</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", marginBottom: 4 }}>₹0</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>forever</div>
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                <div>✓ 10 swipes per day</div>
                <div>✓ Basic profile</div>
                <div>✓ Listen to Roshmusik tracks</div>
                <div>✓ Text chat with matches</div>
                <div style={{ opacity: 0.3 }}>✕ Audio / Video calls</div>
                <div style={{ opacity: 0.3 }}>✕ See who liked you</div>
              </div>
              <button onClick={() => navigate("/request-access")} style={{ marginTop: 24, width: "100%", padding: "12px", borderRadius: 30, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>Get Started</button>
            </div>

            {/* GOLD — Popular */}
            <div style={{ flex: "1 1 240px", maxWidth: 280, background: "linear-gradient(160deg, rgba(212,175,55,0.1), rgba(139,69,19,0.08))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: "36px 28px", textAlign: "center", position: "relative", transform: "scale(1.05)", boxShadow: "0 0 40px rgba(212,175,55,0.1)" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #d4af37, #aa8b2b)", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 16px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.08em" }}>Most Popular</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Gold</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#d4af37", marginBottom: 4 }}>₹99</div>
              <div style={{ fontSize: 12, color: "rgba(212,175,55,0.6)", marginBottom: 24 }}>per month</div>
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
                <div>✓ Unlimited swipes</div>
                <div>✓ See who liked you</div>
                <div>✓ 5 Super Likes / day</div>
                <div>✓ 🎧 Audio calls (mutual consent)</div>
                <div>✓ Priority matching</div>
                <div>✓ Roshmusik Live access</div>
              </div>
              <button className="btn-premium" onClick={() => navigate("/request-access")} style={{ marginTop: 24, width: "100%", padding: "12px", fontSize: 13 }}>Subscribe Now</button>
            </div>

            {/* PLATINUM */}
            <div style={{ flex: "1 1 240px", maxWidth: 280, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,80,80,0.15)", borderRadius: 20, padding: "36px 28px", textAlign: "center", transition: "all 0.3s ease" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#ff6b6b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Platinum</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: "#ff6b6b", marginBottom: 4 }}>₹199</div>
              <div style={{ fontSize: 12, color: "rgba(255,100,100,0.5)", marginBottom: 24 }}>per month</div>
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                <div>✓ Everything in Gold</div>
                <div>✓ 📹 Video calls (mutual consent)</div>
                <div>✓ 🎧 Unlimited audio calls</div>
                <div>✓ Profile boost weekly</div>
                <div>✓ VIP badge on profile</div>
                <div>✓ Ad-free experience</div>
              </div>
              <div style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic", textAlign: "center" }}>Calls only when both users agree</div>
              <button className="btn-hot" onClick={() => navigate("/request-access")} style={{ marginTop: 24, width: "100%", padding: "12px", fontSize: 13 }}>Go Platinum</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 60, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#d4af37" }}>10K+</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Active Users</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#ff6b6b" }}>5K+</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Matches Made</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1DB954" }}>50+</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Roshmusik Tracks</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ REVIEWS / TESTIMONIALS ═══ */}
      <div style={{ position: "relative", zIndex: 5, padding: "80px 24px 60px", background: "linear-gradient(180deg, rgba(10,0,0,0.95) 0%, rgba(20,5,5,0.98) 50%, rgba(0,0,0,0.95) 100%)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 className="serif" style={{ fontSize: 36, fontWeight: 500, marginBottom: 8, color: "#fff" }}>What People Say</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 48, letterSpacing: "0.05em" }}>Real stories from real connections</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            
            {/* Review 1 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", textAlign: "left", transition: "all 0.3s" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {"⭐⭐⭐⭐⭐".split("").filter(c => c !== "").map((s, i) => <span key={i} style={{ fontSize: 14 }}>⭐</span>)}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
                "Found my soulmate through a shared playlist. The music matching is genius — we both loved the same Roshmusik tracks. Best decision ever!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,175,55,0.3)" }}>
                  <img src="/girl1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Ananya R.</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Kochi • Gold Member</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", textAlign: "left", transition: "all 0.3s" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14 }}>⭐</span>)}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
                "Unlike other apps, Laya feels premium and exclusive. The vibe here is different — people are genuine, the music feature is 🔥, and the UI is beautiful."
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,60,60,0.3)" }}>
                  <img src="/girl3.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Divya S.</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Trivandrum • Platinum</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", textAlign: "left", transition: "all 0.3s" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14 }}>⭐</span>)}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
                "The Roshmusik live tracks while swiping? Absolute vibe. Found someone amazing who matches my maturity and taste in music. Highly recommend!"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(212,175,55,0.3)" }}>
                  <img src="/mature1.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Lakshmi K.</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Calicut • Gold Member</div>
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "28px 24px", textAlign: "left", transition: "all 0.3s" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 14 }}>⭐</span>)}
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 18, fontStyle: "italic" }}>
                "Super premium feel. As a 40-year-old, I finally found an app with classy, genuine people. The audio call feature is very secure too. 💕"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,60,60,0.3)" }}>
                  <img src="/mature2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Nandita M.</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Thrissur • Platinum</div>
                </div>
              </div>
            </div>

          </div>

          {/* App Store badges */}
          <div style={{ marginTop: 48, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.3s" }}>
              <span style={{ fontSize: 22 }}>🍎</span>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Download on the</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>App Store</div>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "all 0.3s" }}>
              <span style={{ fontSize: 22 }}>▶️</span>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Get it on</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Google Play</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ position: "relative", zIndex: 5, padding: "32px 24px", background: "rgba(0,0,0,0.9)", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
        <div className="serif glow-gold" style={{ fontSize: 20, marginBottom: 8 }}>Laya</div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>© 2026 Laya. All rights reserved. Made with ❤️ by Roshmusik</p>
      </footer>
    </div>
  );
}

// ── TOP NAV ───────────────────────────────────────────────────────────────────
function TopNav() {
  const navigate = useNavigate();
  const { currentUser, setAdminMode, unreadCount, setShowPremium, appMode, setAppMode } = useApp();
  const MODES = [
    { id:"date",    icon:"Date" },
    { id:"friends", icon:"Social" },
    { id:"network", icon:"Biz" },
  ];
  return (
    <div style={{ padding:"48px 24px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(5,5,5,.85)", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,.03)" }}>
      <div className="serif" style={{ fontSize:24, fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }} onClick={() => navigate("/app/discover")}>
        <span>Laya</span>
      </div>
      {/* Mode switcher */}
      <div style={{ display:"flex", gap:2, background:"rgba(255,255,255,.03)", borderRadius:30, padding:"3px", border: "1px solid rgba(255,255,255,0.05)" }}>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>setAppMode(m.id)}
            style={{ padding:"6px 14px", borderRadius:20, border:"none", fontSize:11, fontWeight: 500, cursor:"pointer", transition:"all .3s ease", textTransform: "uppercase", letterSpacing: "0.05em",
              background: appMode===m.id ? "rgba(255,255,255,0.1)" : "transparent",
              color: appMode===m.id ? "#fcfcfc" : "rgba(255,255,255,.3)" }}>
            {m.icon}
          </button>
        ))}
      </div>
      {/* Right side */}
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <button onClick={() => setShowPremium(true)}
          style={{ background:"transparent", border:"1px solid rgba(212, 175, 55, 0.3)", borderRadius:20, padding:"6px 12px", fontSize:10, fontWeight:500, color:"#d4af37", cursor:"pointer", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all .3s ease" }}
          onMouseEnter={e => e.currentTarget.style.background="rgba(212, 175, 55, 0.1)"}
          onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          Member
        </button>
        <div style={{ position:"relative", cursor:"pointer", color: "rgba(255,255,255,0.7)" }} onClick={() => navigate("/app/alerts")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          {unreadCount > 0 && (
            <div style={{ position:"absolute", top:-2, right:-4, background:"#d4af37", color:"#050505", fontSize:9, fontWeight:600, width:14, height:14, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {unreadCount}
            </div>
          )}
        </div>
        <div onClick={() => navigate("/app/profile")}
          style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, cursor:"pointer", overflow: "hidden" }}>
          {currentUser?.photos?.[0] ? <img src={currentUser.photos[0]} alt="Profile" style={{width:"100%", height:"100%", objectFit:"cover"}} /> : "👤"}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP (after login) ────────────────────────────────────────────────────
function MainApp() {
  const { showMatch, showPremium, currentUser } = useApp();

  // SECURITY FIX: Prevent unauthenticated users from bypassing the landing page
  if (!currentUser) return <Navigate to="/" replace />;

  // Web paywall: Only Premium members can use the web version
  const isNative = Capacitor.isNativePlatform();
  if (!isNative && !currentUser?.premium) {
    return (
      <div className="app-wrap fade-in" style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:32, textAlign:"center", background: "#0a0a0a" }}>
        <div style={{ marginBottom:24 }}>
          <span style={{ fontSize:48 }}>🔒</span>
        </div>
        <h2 className="serif" style={{ fontSize:28, color:"#d4af37", marginBottom:16 }}>Premium Exclusive</h2>
        <p style={{ color:"rgba(255,255,255,.6)", fontSize:14, marginBottom:32, lineHeight:1.6, maxWidth:300 }}>
          Laya Web is restricted to Premium Members. Please download the Android app from Google Play to subscribe and unlock web access.
        </p>
        <button className="btn-hot" style={{ padding:"16px 32px", fontSize: 14 }}>
          Get the Android App
        </button>
      </div>
    );
  }

  return (
    <div className="app-wrap" style={{ paddingBottom:72 }}>
      <TopNav />
      <Routes>
        <Route path="discover" element={<DiscoverTab />} />
        <Route path="matches" element={<MatchesTab />} />
        <Route path="spotify" element={<SpotifyTab />} />
        <Route path="chat" element={<ChatScreen />} />
        <Route path="community" element={<CommunityTab />} />
        <Route path="alerts" element={<NotificationsTab />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="discover" replace />} />
      </Routes>
      <BottomNav />
      {showMatch   && <MatchCelebration />}
      {showPremium && <PremiumModal />}
    </div>
  );
}

// ── GLOBAL TOAST ─────────────────────────────────────────────────────────────
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className={toast.type === "error" ? "toast-error" : "toast-success"}>
      {toast.msg}
    </div>
  );
}

// ── FLOATING MUSIC PLAYER ─────────────────────────────────────────────────────
export const SONGS = [
  { id: "t1", title:"Nilavin Thennal",   artist:"Roshmusik", url:"/Nilavin_Thennal.mp3",     emoji:"🌙", cover:"/fake1.jpg", duration:"3:45", mood:"Chill", genre:"Lofi" },
  { id: "t2", title:"Kanne Ponmaniye",   artist:"Roshmusik", url:"/Kanne_Ponmaniye.mp3",     emoji:"✨", cover:"/fake2.jpg", duration:"4:10", mood:"Romantic", genre:"Lofi" },
  { id: "t3", title:"Nizhal Variye",     artist:"Roshmusik", url:"/Nizhal_Variye.mp3",       emoji:"👤", cover:"/fake3.jpg", duration:"2:50", mood:"Sad", genre:"Acoustic" },
  { id: "t4", title:"Poonilaa Veezhukam", artist:"Roshmusik", url:"/Poonilaa_Veezhukam.mp3", emoji:"🎵", cover:"/fake4.jpg", duration:"5:00", mood:"Dreamy", genre:"Lofi" },
  { id: "t5", title:"Wild Souls",        artist:"Roshmusik", url:"/Wild_Souls.mp3",          emoji:"🔥", cover:"/fake5.jpg", duration:"3:20", mood:"Energetic", genre:"EDM" },
  { id: "t6", title:"Clear Mind",        artist:"Roshmusik", url:"/Clear_Mind.mp3",          emoji:"🧘", cover:"/fake6.jpg", duration:"4:30", mood:"Peaceful", genre:"Ambient" },
  { id: "t7", title:"Midnight in Kochi", artist:"Roshmusik", url:"/Midnight_Kochi.mp3",      emoji:"🌃", cover:"/fake7.jpg", duration:"3:15", mood:"Night Vibes", genre:"Chillhop" },
  { id: "t8", title:"Backwater Dreams",  artist:"Roshmusik", url:"/Backwater_Dreams.mp3",    emoji:"🌊", cover:"/fake8.jpg", duration:"5:20", mood:"Dreamy", genre:"Ambient" },
  { id: "t9", title:"Theyyam Fire",      artist:"Roshmusik", url:"/Theyyam_Fire.mp3",        emoji:"🔥", cover:"/fake9.jpg", duration:"2:40", mood:"Intense", genre:"Folk Fusion" }
];

function MusicPlayer() {
  const [playing,   setPlaying]   = useState(false);
  const [songIdx,   setSongIdx]   = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [showVol,   setShowVol]   = useState(false);
  const [volume,    setVolume]    = useState(0.20);
  const audioRef = useRef(null);
  const song = SONGS[songIdx];

  // Dragging state
  const [pos, setPos] = useState({ bottom: 92, right: 16 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startRight: 16, startBottom: 92 });

  const onPointerDown = (e) => {
    // Only start drag if they didn't click a button/input
    if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'input' || e.target.closest('button')) return;
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.startRight = pos.right;
    dragRef.current.startBottom = pos.bottom;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({
      right: dragRef.current.startRight - dx,
      bottom: dragRef.current.startBottom - dy
    });
  };

  const onPointerUp = (e) => {
    if (!dragRef.current.isDragging) return;
    dragRef.current.isDragging = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Init audio once
  useEffect(() => {
    audioRef.current = new Audio(song.url);
    audioRef.current.loop   = true;
    audioRef.current.volume = volume;
    return () => { audioRef.current?.pause(); };
  }, []);

  // Change song
  useEffect(() => {
    if (!audioRef.current) return;
    const was = playing;
    audioRef.current.pause();
    audioRef.current.src = SONGS[songIdx].url;
    audioRef.current.load();
    audioRef.current.volume = volume;
    if (was) audioRef.current.play().catch(()=>{});
  }, [songIdx]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(()=>{});
      setPlaying(true);
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 3500);
    }
  };

  const nextSong = (e) => {
    e.stopPropagation();
    setSongIdx(i => (i + 1) % SONGS.length);
    setShowLabel(true);
    setTimeout(() => setShowLabel(false), 3500);
  };

  return (
    <div 
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ 
        position:"fixed", 
        bottom: pos.bottom, 
        right: pos.right, 
        zIndex:500, 
        display:"flex", 
        flexDirection:"column", 
        alignItems:"flex-end", 
        gap:10,
        touchAction: "none", // Prevent scrolling while dragging
        cursor: dragRef.current?.isDragging ? "grabbing" : "grab"
      }}
    >

      {/* Song label */}
      {showLabel && (
        <div style={{ background:"rgba(12,12,14,.9)", border:"1px solid rgba(255,255,255,.05)", backdropFilter:"blur(20px)", borderRadius:16, padding:"12px 16px", animation:"popIn .4s ease", whiteSpace:"nowrap", boxShadow:"0 10px 30px rgba(0,0,0,.5)", cursor:"default" }}>
          <div style={{ fontSize:9, color:"rgba(255,255,255,.4)", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Now Playing</div>
          <div style={{ fontSize:14, fontWeight:400, color:"#fcfcfc" }}>{song.emoji} {song.title}</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.4)", marginTop:4 }}>{song.artist}</div>
        </div>
      )}

      {/* Volume panel */}
      {showVol && (
        <div style={{ background:"rgba(12,12,14,.9)", border:"1px solid rgba(255,255,255,.05)", backdropFilter:"blur(20px)", borderRadius:16, padding:"10px 14px", display:"flex", alignItems:"center", gap:8, animation:"popIn .3s ease", cursor:"default" }}>
          <span style={{ fontSize:12, opacity: 0.6 }}>🔈</span>
          <input type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ width:80, accentColor:"#d4af37", cursor:"pointer", height: "4px" }} />
          <span style={{ fontSize:12, opacity: 0.6 }}>🔊</span>
        </div>
      )}

      {/* Button row */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>

        {/* Next track */}
        <button onClick={nextSong} title="Next song"
          style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,0.7)", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s ease", backdropFilter:"blur(12px)" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.02)"}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
        </button>

        {/* Volume toggle */}
        <button onClick={e=>{e.stopPropagation();setShowVol(v=>!v);}} title="Volume"
          style={{ width:36, height:36, borderRadius:"50%", background: showVol ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.02)", border:"1px solid rgba(255,255,255,.08)", color:"rgba(255,255,255,0.7)", fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .3s ease", backdropFilter:"blur(12px)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
        </button>

        {/* Main play/pause button */}
        <button onClick={togglePlay}
          title={playing ? "Pause music" : "Play background music"}
          style={{
            width:48, height:48, borderRadius:"50%", border: playing ? "1px solid rgba(212, 175, 55, 0.4)" : "1px solid rgba(255,255,255,.1)",
            background: playing ? "rgba(212, 175, 55, 0.1)" : "rgba(255,255,255,.03)",
            color: playing ? "#d4af37" : "rgba(255,255,255,0.8)", fontSize:20, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow: playing ? "0 0 20px rgba(212, 175, 55, 0.15)" : "0 4px 18px rgba(0,0,0,.5)",
            transition:"all .4s ease",
            backdropFilter:"blur(12px)",
          }}>
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>
      </div>
      
      {/* Tiny Drag Handle Indicator */}
      <div style={{ position:"absolute", top:-12, right:16, color:"rgba(255,255,255,0.2)", pointerEvents:"none" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
      </div>
    </div>
  );
}

// ── ROOT ROUTER ───────────────────────────────────────────────────────────────
import WaitlistScreen from "./screens/WaitlistScreen";

function Router() {
  const { activeCall, currentUser } = useApp();

  // Full-screen call takes priority
  if (activeCall?.type === "video") return <VideoCallScreen />;
  if (activeCall?.type === "audio") return <AudioCallScreen />;

  // Waitlist Interceptor
  if (currentUser?.status === "pending") {
    return (
      <Routes>
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="*" element={<WaitlistScreen />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/network/:location/:niche" element={<LandingPage />} />
      <Route path="/request-access" element={<AuthScreen />} />
      <Route path="/setup" element={<ProfileSetup />} />
      <Route path="/app/*" element={<MainApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ── APP ENTRY ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Router />
      <MusicPlayer />
      <Toast />
    </AppProvider>
  );
}
