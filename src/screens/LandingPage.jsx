import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function LandingPage() {
  const navigate = useNavigate();
  const { location, niche } = useParams();

  // Basic capitalization helper
  const capitalize = (s) => {
    if (!s) return "";
    return s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const locName = capitalize(location);
  const nicheName = capitalize(niche);

  const title = `Laya | Curated Private Network for ${nicheName} in ${locName}`;
  const description = `Join Laya, the most exclusive private network for ${nicheName} in ${locName}, Kerala. Request access today.`;
  const heading = `Private Network for ${nicheName} in ${locName}`;

  // Curated demo cards to replicate the Tinder grid style in the background
  const backgroundCards = [
    { name: "Meera", age: 24, img: "/girl1.png", rotate: -12, top: "20%", left: "10%" },
    { name: "Sneha", age: 22, img: "/girl2.png", rotate: -5, top: "15%", left: "32%" },
    { name: "Rahul", age: 28, img: "/boy1.png", rotate: 8, top: "25%", left: "55%" },
    { name: "Anjali", age: 25, img: "/girl1.png", rotate: -15, top: "50%", left: "5%" },
    { name: "Riya", age: 23, img: "/girl2.png", rotate: 12, top: "45%", left: "40%" },
    { name: "Arjun", age: 26, img: "/boy1.png", rotate: -8, top: "55%", left: "75%" }
  ];

  return (
    <div className="fade-in" style={{ display:"flex", flexDirection:"column", minHeight:"100vh", position:"relative", overflow:"hidden", background: "#000", color: "#fcfcfc" }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>

      {/* Skewed Background Grid of Profiles */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.35, overflow: "hidden", pointerEvents: "none" }}>
        {backgroundCards.map((card, idx) => (
          <div key={idx} style={{
            position: "absolute",
            width: 140,
            height: 200,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            background: "rgba(10, 10, 12, 0.9)",
            transform: `translate3d(0, 0, 0) rotate(${card.rotate}deg)`,
            top: card.top,
            left: card.left,
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            transition: "all 0.5s ease"
          }}>
            <img src={card.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.9))" }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{card.name}, {card.age}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 40px", background: "transparent" }}>
        <div className="serif" style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.02em", cursor: "pointer" }} onClick={() => navigate("/")}>
          <span className="glow-gold">Laya</span>
        </div>
        
        {/* Navigation links */}
        <nav style={{ display: "flex", gap: 24, fontSize: 13, fontWeight: 500, color: "rgba(255, 255, 255, 0.7)" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Products</span>
          <span style={{ cursor: "pointer" }}>Learn</span>
          <span style={{ cursor: "pointer" }}>Safety</span>
          <span style={{ cursor: "pointer" }}>Support</span>
        </nav>

        <button onClick={() => navigate("/request-access")}
          style={{ background: "#fcfcfc", color: "#000", border: "none", borderRadius: 24, padding: "8px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease" }}>
          Log in
        </button>
      </header>

      {/* Hero Section */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", paddingBottom: "10vh" }}>
        <h1 style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 24px 0", color: "#fcfcfc", fontFamily: "'Inter', sans-serif", lineHeight: 1.2 }}>
          {heading}
        </h1>
        
        <button className="btn-premium" 
          onClick={() => navigate("/request-access")}
          style={{
            padding: "18px 48px",
            fontSize: "15px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            boxShadow: "0 8px 30px rgba(255, 78, 80, 0.4)",
            background: "linear-gradient(135deg, #ff4e50, #f9d423)",
            color: "#fff"
          }}>
          Request Access
        </button>
      </div>
    </div>
  );
}
