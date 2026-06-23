import { useState } from "react";
import { useApp } from "../contexts/AppContext";

const DISTRICT_GROUPS = [
  { id:"ekm",  name:"Ernakulam",       icon:"🏙️", members:1240 },
  { id:"tsr",  name:"Thrissur",        icon:"🌺", members:980  },
  { id:"kzd",  name:"Kozhikode",       icon:"🌊", members:870  },
  { id:"tvm",  name:"Thiruvananthapuram",icon:"🏛️",members:1100 },
  { id:"plk",  name:"Palakkad",        icon:"🌾", members:620  },
  { id:"knr",  name:"Kannur",          icon:"🎭", members:540  },
  { id:"ktm",  name:"Kottayam",        icon:"📚", members:730  },
  { id:"mlpm", name:"Malappuram",      icon:"🕌", members:680  },
  { id:"wyd",  name:"Wayanad",         icon:"🌿", members:490  },
  { id:"klm",  name:"Kollam",          icon:"🐚", members:560  },
];

const MOCK_POSTS = [
  { id:"p1", user:"Priya Menon",   avatar:"👩", district:"Ernakulam",  time:"5m ago",  text:"Anyone up for a trek to Munnar this weekend? 🏔️",       likes:12, comments:4  },
  { id:"p2", user:"Arjun Nair",    avatar:"👨", district:"Thrissur",   time:"23m ago", text:"Best biriyani in Kozhikode recommendations? 🍛 Moving there next month!", likes:28, comments:11 },
  { id:"p3", user:"Lakshmi N",     avatar:"👩‍🦰",district:"Malappuram", time:"1h ago",  text:"Just discovered an amazing hidden waterfall near Wayanad! 🌊 Tag your adventure buddies!", likes:47, comments:18 },
  { id:"p4", user:"Vishnu Raj",    avatar:"👨‍🦱",district:"Palakkad",   time:"2h ago",  text:"Cycling group starting from Palakkad @ 6 AM Sunday. 20 spots available! 🚴", likes:35, comments:22 },
  { id:"p5", user:"Meera K",      avatar:"👩‍🦱",district:"Kozhikode",  time:"3h ago",  text:"Photography walk this Saturday at Kozhikode beach 📸 Beginners welcome!", likes:19, comments:7  },
];

export default function CommunityTab() {
  const { currentUser, showToast } = useApp();
  const [view, setView]         = useState("feed"); // feed|groups
  const [likedPosts, setLikedPosts] = useState([]);
  const [newPost, setNewPost]   = useState("");
  const [posts, setPosts]       = useState(MOCK_POSTS);

  const handleLike = (id) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(p => p.filter(x => x !== id));
      setPosts(p => p.map(post => post.id === id ? {...post, likes: post.likes - 1} : post));
    } else {
      setLikedPosts(p => [...p, id]);
      setPosts(p => p.map(post => post.id === id ? {...post, likes: post.likes + 1} : post));
    }
  };

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: `p${Date.now()}`,
      user: currentUser?.name || "You",
      avatar: currentUser?.photos?.[0] || "👤",
      district: currentUser?.district || "Kerala",
      time: "just now",
      text: newPost,
      likes: 0, comments: 0,
    };
    setPosts(p => [post, ...p]);
    setNewPost("");
    showToast("Post shared with the community! 🌴");
  };

  return (
    <div style={{ padding:"14px", animation:"fadeIn .4s ease" }}>
      {/* Tab */}
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["feed","groups"].map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{ flex:1, padding:"10px", borderRadius:14, border:"none", fontFamily:"Nunito,sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all .2s",
              background: view === v ? "linear-gradient(135deg,#ff6b6b,#ff4757)" : "rgba(255,255,255,.05)",
              color: view === v ? "white" : "rgba(255,255,255,.4)" }}>
            {v === "feed" ? "📰 Community Feed" : "🏘️ Districts"}
          </button>
        ))}
      </div>

      {/* ── FEED ── */}
      {view === "feed" && (
        <>
          {/* Post composer */}
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)", borderRadius:16, padding:"14px", marginBottom:16 }}>
            <div style={{ display:"flex", gap:10, marginBottom:10 }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                {currentUser?.photos?.[0] || "👤"}
              </div>
              <textarea className="input" placeholder="Share something with the community... 🌴"
                value={newPost} onChange={e => setNewPost(e.target.value)} rows={2}
                style={{ marginBottom:0, resize:"none", flex:1 }} />
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <button style={{ padding:"7px 14px", borderRadius:20, background:"rgba(255,255,255,.06)", border:"none", color:"rgba(255,255,255,.5)", fontSize:12, cursor:"pointer" }}>📷</button>
              <button className="btn-red" style={{ padding:"7px 18px", fontSize:12 }} onClick={handlePost}>Post</button>
            </div>
          </div>

          {/* Posts */}
          {posts.map(post => (
            <div key={post.id} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,107,107,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{post.avatar}</div>
                <div>
                  <div style={{ fontWeight:800, fontSize:13 }}>{post.user}</div>
                  <div style={{ color:"rgba(255,255,255,.35)", fontSize:11 }}>📍 {post.district} · {post.time}</div>
                </div>
              </div>
              <p style={{ fontSize:14, lineHeight:1.6, color:"rgba(255,255,255,.85)", marginBottom:12 }}>{post.text}</p>
              <div style={{ display:"flex", gap:16 }}>
                <button onClick={() => handleLike(post.id)}
                  style={{ background:"none", border:"none", color: likedPosts.includes(post.id) ? "#ff6b6b" : "rgba(255,255,255,.4)", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                  {likedPosts.includes(post.id) ? "❤️" : "🤍"} {post.likes}
                </button>
                <button style={{ background:"none", border:"none", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                  💬 {post.comments}
                </button>
                <button style={{ background:"none", border:"none", color:"rgba(255,255,255,.4)", cursor:"pointer", fontSize:13, fontWeight:700, marginLeft:"auto", display:"flex", alignItems:"center", gap:5 }}>
                  ↗️ Share
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── GROUPS ── */}
      {view === "groups" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {DISTRICT_GROUPS.map(g => (
            <div key={g.id} className="card" style={{ padding:"16px 14px" }} onClick={() => showToast(`Opening ${g.name} group...`)}>
              <div style={{ fontSize:28, marginBottom:8 }}>{g.icon}</div>
              <div style={{ fontWeight:800, fontSize:13, marginBottom:3 }}>{g.name}</div>
              <div style={{ color:"#ff6b6b", fontWeight:700, fontSize:12 }}>{g.members.toLocaleString()} members</div>
              <button className="btn-red" style={{ marginTop:10, padding:"6px 14px", fontSize:11, width:"100%" }}>
                Join Group
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
