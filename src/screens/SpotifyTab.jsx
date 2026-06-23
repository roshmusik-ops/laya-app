import { useState, useRef, useEffect } from "react";
import { useApp } from "../contexts/AppContext";

const SONGS = [
  { id: "s1", title: "Nilavin Thennal", artist: "Roshmusik", url: "/Nilavin_Thennal.mp3", cover: "/girl1.png", duration: "3:45", color: "#1e3c72" },
  { id: "s2", title: "Kanne Ponmaniye", artist: "Roshmusik", url: "/Kanne_Ponmaniye.mp3", cover: "/girl2.png", duration: "4:12", color: "#2a0845" },
  { id: "s3", title: "Nizhal Variye", artist: "Roshmusik", url: "/Nizhal_Variye.mp3", cover: "/girl3.png", duration: "3:58", color: "#11998e" },
  { id: "s4", title: "Poonilaa Veezhukam", artist: "Roshmusik", url: "/Poonilaa_Veezhukam.mp3", cover: "/girl4.png", duration: "4:05", color: "#eb5757" },
];

export default function SpotifyTab() {
  const { showToast } = useApp();
  const [playing, setPlaying] = useState(false);
  const [songIdx, setSongIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [liked, setLiked] = useState([]);
  
  const audioRef = useRef(null);
  const song = SONGS[songIdx];

  useEffect(() => {
    audioRef.current = new Audio(song.url);
    audioRef.current.volume = volume;

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleEnded = () => {
      nextSong();
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [songIdx]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log(err));
      setPlaying(true);
    }
  };

  const playSong = (idx) => {
    if (songIdx === idx) {
      togglePlay();
    } else {
      setSongIdx(idx);
      setPlaying(true);
      setTimeout(() => {
        audioRef.current?.play().catch(err => console.log(err));
      }, 50);
    }
  };

  const nextSong = () => {
    setSongIdx((songIdx + 1) % SONGS.length);
    setPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(err => console.log(err));
    }, 50);
  };

  const prevSong = () => {
    setSongIdx((songIdx - 1 + SONGS.length) % SONGS.length);
    setPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(err => console.log(err));
    }, 50);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleLike = (id) => {
    if (liked.includes(id)) {
      setLiked(liked.filter(x => x !== id));
      showToast("Removed from your library");
    } else {
      setLiked([...liked, id]);
      showToast("Added to your library! 💚");
    }
  };

  return (
    <div style={{ padding: "16px", animation: "fadeIn .4s ease", background: `linear-gradient(to bottom, ${song.color}aa 0%, #000000 60%)`, minHeight: "85vh", display: "flex", flexDirection: "column" }}>
      
      {/* Spotify Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 24, color: "#1DB954" }}>🎵</span>
        <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>Roshmusik <span className="glow" style={{ color: "#1DB954" }}>Live</span></div>
        <div style={{ marginLeft: "auto", background: "#1DB954", color: "#000", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>Spotify Mode</div>
      </div>

      {/* Main Album Player */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px 0 24px" }}>
        <div style={{ width: 200, height: 200, borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.6)", position: "relative", marginBottom: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
          <img src={song.cover} alt={song.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {playing && (
            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(29, 185, 84, 0.9)", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
                <div style={{ width: 2, height: 8, background: "#000", animation: "pulse 0.8s infinite alternate" }} />
                <div style={{ width: 2, height: 12, background: "#000", animation: "pulse 0.5s infinite alternate" }} />
                <div style={{ width: 2, height: 6, background: "#000", animation: "pulse 0.7s infinite alternate" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px" }}>
          <div>
            <h3 className="serif" style={{ fontSize: 24, color: "#fff", marginBottom: 4 }}>{song.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{song.artist}</p>
          </div>
          <button onClick={() => toggleLike(song.id)} style={{ background: "none", border: "none", color: liked.includes(song.id) ? "#1DB954" : "rgba(255,255,255,0.5)", fontSize: 24, cursor: "pointer", transition: "transform 0.2s" }} onMouseDown={e=>e.currentTarget.style.transform="scale(0.8)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
            {liked.includes(song.id) ? "💚" : "🤍"}
          </button>
        </div>
      </div>

      {/* Audio Controls */}
      <div style={{ padding: "0 10px", marginBottom: 24 }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{formatTime(progress)}</span>
          <input type="range" min={0} max={duration || 100} value={progress} onChange={handleSeek}
            style={{ flex: 1, accentColor: "#1DB954", height: 4, cursor: "pointer" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24 }}>
          <button onClick={prevSong} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>⏮</button>
          
          <button onClick={togglePlay} style={{ background: "#fff", color: "#000", border: "none", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
            {playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 19 12 8 19 8 5"></polygon></svg>
            )}
          </button>
          
          <button onClick={nextSong} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>⏭</button>
        </div>

        {/* Volume controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginTop: 16, opacity: 0.6 }}>
          <span style={{ fontSize: 12 }}>🔈</span>
          <input type="range" min={0} max={1} step={0.05} value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ width: 80, accentColor: "#1DB954", height: 3, cursor: "pointer" }} />
          <span style={{ fontSize: 12 }}>🔊</span>
        </div>
      </div>

      {/* Playlist / Tracks list */}
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>TRACK LIST</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {SONGS.map((t, idx) => {
            const isCurrent = songIdx === idx;
            return (
              <div key={t.id} onClick={() => playSong(idx)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: isCurrent ? "rgba(255,255,255,0.06)" : "transparent", cursor: "pointer", transition: "background 0.2s" }}
                onMouseEnter={e => !isCurrent && (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => !isCurrent && (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 36, height: 36, borderRadius: 6, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <img src={t.cover} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: isCurrent ? "#1DB954" : "#fff" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{t.artist}</div>
                </div>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{t.duration}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
