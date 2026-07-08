export default function SpotifyTab() {
  return (
    <div style={{ padding: "16px", background: "#000", minHeight: "85vh", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
        <span style={{ fontSize: 24, color: "#1DB954" }}>🎵</span>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Laya <span className="glow" style={{ color: "#1DB954" }}>Music</span></div>
      </div>
      
      {/* Spotify Embed */}
      <div style={{ width: "100%", height: 352 }}>
        <iframe 
          style={{ borderRadius: "12px", border: "none" }} 
          src="https://open.spotify.com/embed/artist/66GvSYuJ8ks3iouoFicDo7?utm_source=generator&theme=0" 
          width="100%" 
          height="100%" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy"
          title="Spotify Player">
        </iframe>
      </div>

      {/* YouTube Video Embed */}
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
        <iframe 
          width="100%" 
          height="100%" 
          src="https://www.youtube.com/embed?listType=search&list=Roshmusik" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen>
        </iframe>
      </div>

      {/* Music Links */}
      <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
        <a href="https://music.apple.com/in/artist/roshmusik/1601243178" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #fc3c44, #d12c36)", padding: "14px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>🍎</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Listen on Apple Music</span>
            </div>
            <span>→</span>
          </div>
        </a>

        <a href="https://music.youtube.com/channel/UCO3H74p6iImsqN5n1s04JjA" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #ff0000, #cc0000)", padding: "14px 20px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>▶️</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Listen on YouTube Music</span>
            </div>
            <span>→</span>
          </div>
        </a>
      </div>
      
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginTop: 20 }}>
        Powered by Roshmusik Live Tracks
      </p>
    </div>
  );
}
