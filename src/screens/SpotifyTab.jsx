export default function SpotifyTab() {
  return (
    <div style={{ padding: "16px", background: "#000", minHeight: "85vh", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24, color: "#1DB954" }}>🎵</span>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Spotify <span className="glow" style={{ color: "#1DB954" }}>Live</span></div>
      </div>
      
      <div style={{ flex: 1 }}>
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
      
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginTop: 20 }}>
        Powered by Spotify
      </p>
    </div>
  );
}
