import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(storedUser);
  }, []);

  // Fetch real data once user is available
  useEffect(() => {
    if (!user?._id) return;

    const fetchAll = async () => {
      try {
        // Notifications for this student
        const notifRes = await fetch(`${BASE_URL}/notifications/${user._id}`);
        const notifData = await notifRes.json();
        setNotifications(notifData);

        // Events student registered for
        const regRes = await fetch(`${BASE_URL}/registrations/user/${user._id}`);
        const regData = await regRes.json();
        setRegistrations(regData);

        // All upcoming events count
        const evRes = await fetch(`${BASE_URL}/events`);
        const evData = await evRes.json();
        const today = new Date();
        const upcoming = evData.filter((ev) => new Date(ev.date) >= today);
        setUpcomingCount(upcoming.length);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-white flex items-center justify-center">
        <p className="text-[#737B8C]">Loading...</p>
      </div>
    );
  }

  // Completed = registered events whose date has passed
  const completedCount = registrations.filter(
    (r) => r.event && new Date(r.event.date) < new Date()
  ).length;

  const stats = [
    { label: "Registered", value: registrations.length, path: "/registered-events" },
    { label: "Completed", value: completedCount, path: "/completedEvents" },
    { label: "Upcoming", value: upcomingCount, path: "/upcomingevents" },
  ];

  const actions = [
    {
      title: "My Events",
      desc: "View registered events & mark attendance",
      path: "/registeredevents",
      color: "text-[#F97924]",
      bg: "bg-[#F97924]/10 border-[#F97924]/20",
      icon: "📋",
    },
    {
      title: "Completed Events",
      desc: "View past events & submit feedback",
      path: "/completedEvents",
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/20",
      icon: "✅",
    },
    {
      title: "Notifications",
      desc: `${notifications.length} alert${notifications.length !== 1 ? "s" : ""}`,
      path: "/notifications",
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
      icon: "🔔",
    },
    {
      title: "Settings",
      desc: "Preferences & account settings",
      path: "/settings",
      color: "text-[#F97924]",
      bg: "bg-[#F97924]/10 border-[#F97924]/20",
      icon: "⚙️",
    },
  ];

  const info = [
    { label: "Name", value: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "-" },
    { label: "Email", value: user.email || "-" },
    { label: "Phone", value: user.phone || "-" },
    { label: "Roll No", value: user.rollNo || "-" },
    { label: "Year / Division", value: `${user.year || "-"} • ${user.division || "-"}` },
    { label: "Department", value: user.department || "-" },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
        <div className="max-w-5xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#F97924] to-[#FF930F] flex items-center justify-center text-white font-bold text-xl border-2 border-[#F97924]/30">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-[#737B8C] text-sm">
                {user.department} • {user.year} • Division {user.division}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                onClick={() => navigate(s.path)}
                className="bg-[#12151C] border border-[#252832] rounded-xl p-5 text-center cursor-pointer hover:border-[#F97924]/40 transition"
              >
                <div className="text-3xl font-bold text-[#F97924]">{s.value}</div>
                <div className="text-[#737B8C] text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Notifications Preview */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#F97924] mb-3">Recent Alerts</h2>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.slice(0, 2).map((n) => (
                  <div
                    key={n._id}
                    className="flex gap-3 p-3 rounded-xl bg-[#12151C] border border-[#252832]"
                  >
                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F97924]/20 shrink-0">
                      📢
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{n.subject}</div>
                      <div className="text-xs text-[#737B8C] truncate">
                        {n.message?.slice(0, 60)}{n.message?.length > 60 ? "..." : ""}
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length > 2 && (
                  <button
                    onClick={() => navigate("/notifications")}
                    className="text-xs text-[#F97924] hover:underline"
                  >
                    View all {notifications.length} notifications →
                  </button>
                )}
              </div>
            ) : (
              <div className="text-[#737B8C] text-sm bg-[#12151C] p-4 rounded-xl border border-[#252832]">
                No notifications yet
              </div>
            )}
          </div>

          {/* Info + Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Personal Information</h2>
              <div className="space-y-3">
                {info.map((item, i) => (
                  <div key={i} className="bg-[#1D212A]/50 p-3 rounded-lg">
                    <div className="text-[#737B8C] text-xs">{item.label}</div>
                    <div className="text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
              {actions.map((a, i) => (
                <div
                  key={i}
                  onClick={() => navigate(a.path)}
                  className="flex items-center gap-4 p-4 bg-[#12151C] border border-[#252832] rounded-xl cursor-pointer hover:border-[#F97924]/40 transition"
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center border text-lg ${a.bg}`}>
                    {a.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${a.color}`}>{a.title}</div>
                    <div className="text-xs text-[#737B8C]">{a.desc}</div>
                  </div>
                  <div className="ml-auto text-[#737B8C]">›</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;