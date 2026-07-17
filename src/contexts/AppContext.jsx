import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion, setDoc, addDoc, serverTimestamp, orderBy, where } from "firebase/firestore";
import { initRevenueCat } from "../services/revenuecat";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// Keeping mock notifications for now, but users are loaded from Firestore.
const MOCK_NOTIFICATIONS = [
  { id:"n1", text:"Welcome to Laya! 💫", time:"just now", read:false, type:"like" },
];

const MOCK_PROFILES = [
  { id:"m1", name:"Aiswarya", age:23, district:"Ernakulam", bio:"Coffee & Coding ☕", photos:["/girl1.png"], mode:"date", verified:true },
  { id:"m2", name:"Devika", age:25, district:"Thrissur", bio:"Wanderlust & photography 📸", photos:["/sneha.png"], mode:"friends", verified:true },
  { id:"m3", name:"Lakshmi", age:24, district:"Kozhikode", bio:"Foodie & traveler 🍜", photos:["/priya.png"], mode:"date", verified:true },
  { id:"m4", name:"Vishnu", age:27, district:"Ernakulam", bio:"Tech enthusiast 💻", photos:["/vishnu.png"], mode:"network", verified:true },
];

// ─── CONTEXT ───────────────────────────────────────────────────────────────
const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ─── PROVIDER ─────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Navigation
  const [screen, setScreen]       = useState("splash"); // splash|auth|setup|main|call
  const [activeTab, setActiveTab] = useState("discover");
  const [appMode, setAppMode]     = useState("date"); // date|friends|network

  // ── Current user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("laya_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem("laya_user", JSON.stringify(currentUser));
      } catch (err) {
        console.error("Failed to save user to localStorage, possibly due to large photos:", err);
        try {
          const fallbackUser = { ...currentUser, photos: [] };
          localStorage.setItem("laya_user", JSON.stringify(fallbackUser));
        } catch (e2) {
          console.error("Still failed to save fallback user:", e2);
        }
      }
    } else {
      localStorage.removeItem("laya_user");
    }
  }, [currentUser]);

  // ── Always sync email+uid from Firebase Auth (fixes admin check) ──
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Always patch email and uid from Firebase Auth — source of truth
        setCurrentUser(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            email: firebaseUser.email || prev.email || "",
            uid:   firebaseUser.uid,
            id:    firebaseUser.uid,
          };
        });
      }
    });
    return () => unsub();
  }, []);


  // ── Users & matching
  const [users, setUsers]             = useState([
    { id: "u1", name: "Meera Nair", age: 24, district: "Ernakulam", mode: "intimacy", bio: "Fashion designer & model. Love cafe hopping in Kochi, sunset drives, and synth-pop vibes.", photos: ["/girl1.png"], favoriteTrack: "Darshana", favoriteArtist: "Hesham Abdul Wahab", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" },
    { id: "u2", name: "Sneha Kurian", age: 22, district: "Thrissur", mode: "date", bio: "Classical dancer and absolute coffee addict. Let's talk about books over lofi music.", photos: ["/sneha.png"], favoriteTrack: "Anuragathin Velayil", favoriteArtist: "Vineeth Sreenivasan", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX4WYHi6zrncH" },
    { id: "u3", name: "Priya Pillai", age: 23, district: "Kozhikode", mode: "intimacy", bio: "Exploring culinary arts. Music is my escape. Looking for someone with genuine taste.", photos: ["/priya.png"], favoriteTrack: "Uyire", favoriteArtist: "Sid Sriram", musicLinkType: "YouTube Music", musicLink: "https://music.youtube.com/search?q=malayalam+hits" },
    { id: "u4", name: "Arundhati Sen", age: 26, district: "Thiruvananthapuram", mode: "date", bio: "Corporate architect. Classy, elegant, and looking for deep late-night conversations.", photos: ["/arundhati.png"], favoriteTrack: "Malare", favoriteArtist: "Vijay Yesudas", musicLinkType: "Apple Music", musicLink: "https://music.apple.com/in/playlist/malayalam-romance" },
    { id: "u5", name: "Nandita Raj", age: 25, district: "Ernakulam", mode: "friends", bio: "Weekend trekker and shutterbug. Let's curate a shared travel playlist and explore!", photos: ["/nandita.png"], favoriteTrack: "Neela Nilave", favoriteArtist: "Kapil Kapilan", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" },
    { id: "u8", name: "Jithin Joseph", age: 24, district: "Thrissur", mode: "friends", bio: "Football fan and amateur guitarist. Looking for football/sports buddies in Thrissur.", photos: ["/jithin.png"], favoriteTrack: "Pramadhavanam", favoriteArtist: "K.J. Yesudas", musicLinkType: "YouTube Music", musicLink: "https://music.youtube.com/search?q=malayalam+rock" },
    { id: "u10", name: "Appu Mathew", age: 23, district: "Kottayam", mode: "friends", bio: "Food blogger and off-road driving enthusiast. Let's find the best local eateries!", photos: ["/appu.png"], favoriteTrack: "Aaradhike", favoriteArtist: "Sooraj Santhosh", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" },
    { id: "u11", name: "Midhun Lal", age: 25, district: "Alappuzha", mode: "intimacy", bio: "Backwater lover & houseboater. Looking for someone to share long sunset walks.", photos: ["/midhun.png"], favoriteTrack: "Parayathe Ariyathe", favoriteArtist: "K.S. Chithra", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" },
    { id: "u13", name: "Vishnu Prasad", age: 26, district: "Thiruvananthapuram", mode: "date", bio: "Cinematographer and movie buff. Looking for my co-star.", photos: ["/vishnu.png"], favoriteTrack: "Freak Penne", favoriteArtist: "Satyajith", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" },
    { id: "u15", name: "Gopika Krishnan", age: 24, district: "Thrissur", mode: "date", bio: "Classical dancer. Deeply rooted in tradition but modern at heart.", photos: ["/gopika.png"], favoriteTrack: "Kannil Kannil", favoriteArtist: "Sithara Krishnakumar", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX4WYHi6zrncH" },
    { id: "u16", name: "Ananya Menon", age: 23, district: "Kochi", mode: "intimacy", bio: "Architect by day, artist by night. Let's paint the town red.", photos: ["/ananya.png"], favoriteTrack: "Ennile Ellinum", favoriteArtist: "Hesham Abdul Wahab", musicLinkType: "Spotify", musicLink: "https://open.spotify.com/playlist/37i9dQZF1DX10zKzsJ2jva" }
  ]);
  const [swipedIds, setSwipedIds]     = useState([]);
  const [likedIds, setLikedIds]       = useState([]);
  const [matches, setMatches]         = useState([
    { id: "u1", name: "Meera", photos: ["/girl1.png"], lastMessage: "Hey!", expiresAt: Date.now() + 86400000 },
    { id: "u2", name: "Sneha", photos: ["/sneha.png"], lastMessage: "Loved your music taste", expiresAt: Date.now() + 86400000 }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);

  // ── Messaging
  const [chatUser, setChatUser]   = useState(null);
  const [messages, setMessages]   = useState({});
  const [msgInput, setMsgInput]   = useState("");

  // ── Calls
  const [activeCall, setActiveCall] = useState(null); // { user, type:"video"|"audio" }

  // ── Notifications
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  // ── UI states
  const [toast, setToast]             = useState(null);
  const [showMatch, setShowMatch]     = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [language, setLanguage]       = useState("en"); // en|ml
  const [adminMode, setAdminMode]     = useState(false);

  // ── Firebase Sync (Users Stream) ──
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers([...MOCK_PROFILES, ...liveUsers]);
    }, (error) => {
      console.error("Error fetching users:", error);
    });
    return () => unsubscribe();
  }, []);

  // ── Firebase Sync (Current User State & Matches) ──
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsubUser = onSnapshot(doc(db, "users", currentUser.id), (docSnap) => {
       if (docSnap.exists()) {
          const data = docSnap.data();
          setSwipedIds(data.swipedIds || []);
          setLikedIds(data.likedIds || []);
          setCurrentUser(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              premium: data.premium || false,
              plan: data.plan || "Free",
              status: data.status || "approved"
            };
          });
       }
    });

    const qMatches = query(
      collection(db, "matches"),
      where("userIds", "array-contains", currentUser.id)
    );
    const unsubMatches = onSnapshot(qMatches, (snapshot) => {
      const liveMatches = snapshot.docs.map(doc => {
        const data = doc.data();
        const otherUserId = data.userIds.find(id => id !== currentUser.id);
        const otherUser = data.users[otherUserId] || {};
        return {
          id: otherUserId,
          name: otherUser.name,
          photos: [otherUser.photo],
          matchedAt: data.matchedAt?.toMillis() || Date.now(),
          firstMessageSent: data.firstMessageSent || false
        };
      });
      setMatches(liveMatches);
    });

    return () => {
      unsubUser();
      unsubMatches();
    };
  }, [currentUser?.id]);

  useEffect(() => {
    // Initialize RevenueCat for native payments
    if (currentUser?.id) {
      initRevenueCat(currentUser.id);
    }
  }, [currentUser?.id]);

  // ── Splash → auth transition now handled by React Router in App.jsx

  // ── Helper: show toast
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Handle swipe right (like)
  const handleSwipeRight = async (user) => {
    if (!currentUser?.id) return;
    
    // Optimistic local update so swiping works immediately
    setSwipedIds(prev => [...prev, user.id]);

    // Update Firestore
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, {
      swipedIds: arrayUnion(user.id),
      likedIds: arrayUnion(user.id)
    }).catch(console.error);

    // Check for match
    const isMatch = (user.likedIds || []).includes(currentUser.id);

    if (isMatch) {
      const matchData = {
        ...user,
        matchedAt: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        firstMessageSent: false,
      };
      setMatchedUser(matchData);
      setShowMatch(true);
      
      const chatId = [currentUser.id, user.id].sort().join("_");
      await setDoc(doc(db, "matches", chatId), {
        userIds: [currentUser.id, user.id],
        matchedAt: serverTimestamp(),
        users: {
          [currentUser.id]: { id: currentUser.id, name: currentUser.name || "", photo: currentUser.photos?.[0] || "" },
          [user.id]: { id: user.id, name: user.name || "", photo: user.photos?.[0] || "" }
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        firstMessageSent: false
      }).catch(console.error);

      setNotifications(p => [
        { id: `n${Date.now()}`, text: `You matched with ${user.name}! 🎉`, time: "just now", read: false, type: "match" },
        ...p
      ]);
    } else {
      showToast(`Connect request sent to ${user.name}!`);
    }
  };

  // ── Handle swipe left (pass)
  const handleSwipeLeft = async (user) => {
    if (!currentUser?.id) return;
    
    // Optimistic local update
    setSwipedIds(prev => [...prev, user.id]);

    // Update Firestore
    const userRef = doc(db, "users", currentUser.id);
    await updateDoc(userRef, {
      swipedIds: arrayUnion(user.id)
    }).catch(console.error);
  };

  // ── Send message
  const sendMessage = async (userId) => {
    if (!msgInput.trim() || !currentUser?.id) return;
    
    const text = msgInput;
    setMsgInput("");
    
    const chatId = [currentUser.id, userId].sort().join("_");
    
    // Update match firstMessageSent in Firestore
    const matchRef = doc(db, "matches", chatId);
    await updateDoc(matchRef, { firstMessageSent: true }).catch(()=>null);
    
    // Add to Firebase messages subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text,
      senderId: currentUser.id,
      timestamp: serverTimestamp()
    });
  };
  
  // ── Firebase Sync (Real-time Chat) ──
  useEffect(() => {
    if (!currentUser?.id || !chatUser?.id) return;
    
    const chatId = [currentUser.id, chatUser.id].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      const liveMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          from: data.senderId === currentUser.id ? "me" : "them",
          time: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) : "...",
        };
      });
      
      setMessages(prev => ({
        ...prev,
        [chatUser.id]: liveMessages
      }));
    });
    
    return () => unsub();
  }, [currentUser?.id, chatUser?.id]);

  // ── Start call
  const startCall = (user, type) => {
    if (!currentUser?.premium) { setShowPremium(true); return; }
    setActiveCall({ user, type });
    setScreen("call");
  };

  // ── End call
  const endCall = () => {
    setActiveCall(null);
    setScreen("main");
  };

  // ── Mark notifications read
  const markNotifRead = (id) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Filtered discover users
  const discoverUsers = users.filter(u =>
    !swipedIds.includes(u.id) &&
    (!currentUser || u.id !== currentUser.id)
  );

  const value = {
    // Nav
    screen, setScreen, activeTab, setActiveTab, appMode, setAppMode,
    // User
    currentUser, setCurrentUser,
    // Users & matching
    users, setUsers, swipedIds, likedIds, matches, setMatches,
    selectedUser, setSelectedUser, discoverUsers,
    handleSwipeRight, handleSwipeLeft,
    // Messaging
    chatUser, setChatUser, messages, msgInput, setMsgInput, sendMessage,
    // Calls
    activeCall, startCall, endCall,
    // Notifications
    notifications, markNotifRead, unreadCount,
    // UI
    toast, showToast, showMatch, setShowMatch, matchedUser,
    showPremium, setShowPremium, showConnect, setShowConnect,
    language, setLanguage, adminMode, setAdminMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
