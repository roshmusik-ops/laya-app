import { useState, useEffect, useRef } from "react";
import { useApp } from "../contexts/AppContext";
import AgoraRTC from "agora-rtc-sdk-ng";

// Create the Agora client once per component mount
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export default function VideoCallScreen() {
  const { activeCall, endCall, showToast, currentUser } = useApp();
  
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [status, setStatus] = useState("connecting"); // connecting|active|ended
  
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  
  // Keep track of local tracks to control them later
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);

  useEffect(() => {
    if (!activeCall || !currentUser) return;
    
    let isMounted = true;
    let localAudio = null;
    let localVideo = null;
    
    const APP_ID = import.meta.env.VITE_AGORA_APP_ID;
    
    if (!APP_ID || APP_ID === "YOUR_AGORA_APP_ID") {
      showToast("Agora App ID is missing! Video call will not work.", "error");
      setStatus("ended");
      return;
    }

    // Generate a unique channel name using both user IDs, sorted so it's the same for both
    const channelName = [currentUser.id, activeCall.user.id].sort().join("_");

    const initAgora = async () => {
      try {
        // Handle remote users joining/publishing
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          
          if (mediaType === "video" && isMounted) {
            if (remoteRef.current) {
              user.videoTrack.play(remoteRef.current);
            }
            setStatus("active");
          }
          if (mediaType === "audio" && isMounted) {
            user.audioTrack.play();
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video" && isMounted) {
             // User turned off camera
          }
        });

        client.on("user-left", () => {
          if (isMounted) {
            showToast(`${activeCall.user.name} left the call`);
            setStatus("ended");
            setTimeout(() => endCall(), 1500);
          }
        });

        // Join channel (token is null for testing mode, uid is null so Agora assigns one)
        await client.join(APP_ID, channelName, null, null);
        
        // Create and publish local tracks
        localAudio = await AgoraRTC.createMicrophoneAudioTrack();
        localVideo = await AgoraRTC.createCameraVideoTrack();
        
        if (isMounted) {
          setLocalAudioTrack(localAudio);
          setLocalVideoTrack(localVideo);
          
          if (localRef.current) {
            localVideo.play(localRef.current);
          }
          
          await client.publish([localAudio, localVideo]);
          // If we published successfully, we consider it active (even before the other joins, though we wait for them)
          // We can leave status as "connecting" until someone publishes a video track, as handled above.
        }

      } catch (error) {
        console.error("Agora Init Error:", error);
        if (isMounted) {
          showToast("Failed to connect to video call", "error");
          setStatus("ended");
        }
      }
    };

    initAgora();

    // Cleanup function when component unmounts or call ends
    return () => {
      isMounted = false;
      client.removeAllListeners();
      
      if (localAudio) {
        localAudio.stop();
        localAudio.close();
      }
      if (localVideo) {
        localVideo.stop();
        localVideo.close();
      }
      
      client.leave().catch(console.error);
    };
  }, [activeCall, currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle call timer
  useEffect(() => {
    if (status !== "active") return;
    const id = setInterval(() => setCallTime(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Handle Mute Mic
  useEffect(() => {
    if (localAudioTrack) {
      localAudioTrack.setEnabled(!muted).catch(console.error);
    }
  }, [muted, localAudioTrack]);

  // Handle Camera Off
  useEffect(() => {
    if (localVideoTrack) {
      localVideoTrack.setEnabled(!camOff).catch(console.error);
    }
  }, [camOff, localVideoTrack]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  if (!activeCall) return null;

  return (
    <div className="call-screen" style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:100, display:"flex", flexDirection:"column", background:"#000" }}>
      {/* Remote video (full bg) */}
      <div ref={remoteRef} style={{ flex:1, background: status === "active" ? "linear-gradient(135deg,#0e1220,#141828)" : "#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>

        {status === "connecting" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:64, marginBottom:16, animation:"pulse 1.5s ease infinite" }}>
              {activeCall.user.photos?.[0] || "👤"}
            </div>
            <div className="serif" style={{ fontSize:22, marginBottom:8 }}>{activeCall.user.name}</div>
            <p style={{ color:"rgba(255,255,255,.4)", fontSize:14 }}>Connecting...</p>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginTop:12 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#ff6b6b", animation:`pulse 1.2s ease ${i*.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        
        {status === "ended" && (
          <div style={{ textAlign:"center", color:"rgba(255,255,255,.5)", fontSize:16 }}>
            <p>Call Ended</p>
          </div>
        )}

        {/* Call timer */}
        {status === "active" && (
          <div style={{ position:"absolute", top:20, left:0, right:0, textAlign:"center" }}>
            <div style={{ display:"inline-block", background:"rgba(0,0,0,.5)", borderRadius:20, padding:"5px 16px", fontSize:13, fontWeight:700 }}>
              📹 {fmt(callTime)}
            </div>
          </div>
        )}

        {/* Local video (small corner) */}
        <div 
          ref={localRef} 
          style={{ 
            position:"absolute", 
            bottom:30, 
            right:16, 
            width:100, 
            height:130, 
            borderRadius:14, 
            background:"rgba(255,107,107,.2)", 
            border:"2px solid rgba(255,107,107,.3)", 
            display: (status !== "ended" && !camOff) ? "flex" : "none", 
            alignItems:"center", 
            justifyContent:"center", 
            fontSize:28, 
            overflow:"hidden",
            zIndex: 10
          }}>
          {!localVideoTrack && "👤"}
          <div style={{ position:"absolute", bottom:4, left:0, right:0, textAlign:"center", fontSize:10, color:"white", textShadow:"0 1px 2px rgba(0,0,0,0.8)", zIndex:11 }}>You</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ background:"rgba(8,11,18,.95)", backdropFilter:"blur(20px)", padding:"16px 0 28px" }}>
        <div className="call-controls" style={{ display:"flex", gap:16, justifyContent:"center" }}>
          <button className="call-btn" onClick={() => setMuted(m => !m)}
            style={{ width:56, height:56, borderRadius:28, border:"none", fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", background: muted ? "#ef4444" : "rgba(255,255,255,.12)", color:"white" }}
            title={muted ? "Unmute" : "Mute"}>
            {muted ? "🔇" : "🎤"}
          </button>
          <button className="call-btn" onClick={() => setCamOff(c => !c)}
            style={{ width:56, height:56, borderRadius:28, border:"none", fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", background: camOff ? "#ef4444" : "rgba(255,255,255,.12)", color:"white" }}
            title={camOff ? "Camera on" : "Camera off"}>
            {camOff ? "📵" : "📹"}
          </button>
          <button className="call-btn" onClick={endCall}
            style={{ width:56, height:56, borderRadius:28, border:"none", fontSize:24, display:"flex", alignItems:"center", justifyContent:"center", background:"#ef4444", color:"white", boxShadow:"0 4px 14px rgba(239,68,68,.5)" }}
            title="End call">
            <span style={{ transform:"rotate(135deg)", display:"inline-block" }}>📞</span>
          </button>
        </div>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,.3)", fontSize:11, marginTop:12 }}>
          {status === "connecting" ? "Connecting to Agora..." : status === "ended" ? "Call Ended" : `Video call • ${fmt(callTime)}`}
        </p>
      </div>
    </div>
  );
}
