import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion, setDoc, addDoc, serverTimestamp, orderBy, where } from "firebase/firestore";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
// Keeping mock notifications for now, but users are loaded from Firestore.
const MOCK_NOTIFICATIONS = [
  { id:"n1", text:"Welcome to Laya! 💫", time:"just now", read:false, type:"like" },
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
  const [currentUser, setCurrentUser] = useState({
    id: "demo_user",
    name: "Guest",
    age: 26,
    photos: ["/fake10.jpg"],
    premium: true,
    status: "approved"
  });

  // ── Users & matching
  const [users, setUsers]             = useState([
    { id: "u1", name: "Meera", age: 24, district: "Ernakulam", mode: "intimacy", bio: "Looking for someone with great music taste.", photos: ["/fake1.jpg"], favoriteTrack: "Nilavin Thennal" },
    { id: "u2", name: "Sneha", age: 22, district: "Thrissur", mode: "date", bio: "Coffee and long drives.", photos: ["/fake2.jpg"], favoriteTrack: "Kanne Ponmaniye" },
    { id: "u3", name: "Priya", age: 23, district: "Kozhikode", mode: "intimacy", bio: "Music is my escape.", photos: ["/fake3.jpg"], favoriteTrack: "Nizhal Variye" },
    { id: "u4", name: "Arundhati", age: 38, district: "Thiruvananthapuram", mode: "date", bio: "Elegant and classy.", photos: ["/fake4.jpg"], favoriteTrack: "Poonilaa Veezhukam" },
    { id: "u5", name: "Nandita", age: 45, district: "Ernakulam", mode: "friends", bio: "Looking for genuine connections.", photos: ["/fake5.jpg"], favoriteTrack: "Nilavin Thennal" },
    { id: "u6", name: "Shalini", age: 42, district: "Palakkad", mode: "intimacy", bio: "Let's vibe.", photos: ["/fake6.jpg"], favoriteTrack: "Kanne Ponmaniye" },
    { id: "u7", name: "Divya", age: 26, district: "Kannur", mode: "network", bio: "Adventure seeker.", photos: ["/fake7.jpg"], favoriteTrack: "Nizhal Variye" },
    { id: "u8", name: "Kavya", age: 25, district: "Kottayam", mode: "date", bio: "Simple and sweet.", photos: ["/fake8.jpg"], favoriteTrack: "Poonilaa Veezhukam" },
    { id: "u9", name: "Anjali", age: 28, district: "Malappuram", mode: "intimacy", bio: "Dog lover.", photos: ["/fake9.jpg"], favoriteTrack: "Nilavin Thennal" }
  ]);
  const [swipedIds, setSwipedIds]     = useState([]);
  const [likedIds, setLikedIds]       = useState([]);
  const [matches, setMatches]         = useState([
    { id: "u1", name: "Meera", photos: ["/fake1.jpg"], lastMessage: "Hey!" },
    { id: "u2", name: "Sneha", photos: ["/fake2.jpg"], lastMessage: "Loved your music taste" }
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
    // Mocked for demo
    // const q = query(collection(db, "users"));
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const liveUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    //   setUsers(liveUsers);
    // }, (error) => {
    //   console.error("Error fetching users:", error);
    // });
    // return () => unsubscribe();
  }, []);

  // ── Firebase Sync (Current User State) ──
  useEffect(() => {
    // Mocked for demo
    // if (!currentUser?.id) return;
    // const unsub = onSnapshot(doc(db, "users", currentUser.id), (docSnap) => {
    //    if (docSnap.exists()) {
    //       const data = docSnap.data();
    //       setSwipedIds(data.swipedIds || []);
    //       setLikedIds(data.likedIds || []);
    //       setMatches(data.matches || []);
    //    }
    // });
    // return () => unsub();
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
    
    // Check for match before updating DB
    const isMatch = (user.likedIds || []).includes(currentUser.id);
    const matchData = {
      ...user,
      matchedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      firstMessageSent: false,
    };
    
    const myMatchData = {
      ...currentUser,
      matchedAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      firstMessageSent: false,
    };

    try {
      if (isMatch) {
        // It's a match! Update both users in Firestore
        await updateDoc(doc(db, "users", currentUser.id), {
          swipedIds: arrayUnion(user.id),
          likedIds: arrayUnion(user.id),
          matches: arrayUnion(matchData)
        });
        await updateDoc(doc(db, "users", user.id), {
          matches: arrayUnion(myMatchData)
        });
        
        setMatchedUser(matchData);
        setShowMatch(true);
        setNotifications(p => [
          { id: `n${Date.now()}`, text: `You matched with ${user.name}! 🎉`, time: "just now", read: false, type: "match" },
          ...p
        ]);
      } else {
        // Just a like, record it
        await updateDoc(doc(db, "users", currentUser.id), {
          swipedIds: arrayUnion(user.id),
          likedIds: arrayUnion(user.id)
        });
        showToast(`Connect request sent to ${user.name}!`);
      }
    } catch (err) {
      console.error(err);
      showToast("Error recording swipe", "error");
    }
  };

  // ── Handle swipe left (pass)
  const handleSwipeLeft = async (user) => {
    if (!currentUser?.id) return;
    try {
      await updateDoc(doc(db, "users", currentUser.id), {
        swipedIds: arrayUnion(user.id)
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ── Send message
  const sendMessage = async (userId) => {
    if (!msgInput.trim() || !currentUser?.id) return;
    
    const text = msgInput;
    setMsgInput("");
    
    // Mark first message sent on match locally
    setMatches(p => p.map(m => m.id === userId ? { ...m, firstMessageSent: true } : m));
    
    try {
      // Create a unique chat ID based on the two users
      const chatId = [currentUser.id, userId].sort().join("_");
      
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text,
        senderId: currentUser.id,
        receiverId: userId,
        timestamp: serverTimestamp(),
      });
      
      // Update match document (firstMessageSent) if needed
      // For simplicity in v2, we are just saving the message.
    } catch (err) {
      console.error("Error sending message:", err);
      showToast("Message failed to send", "error");
    }
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
