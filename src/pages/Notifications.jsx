import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?._id) { setLoading(false); return; }

    fetch(`${BASE_URL}/notifications/${user._id}`)
      .then(r => r.json())
      .then(data => setNotifications(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await fetch(`${BASE_URL}/notifications/${id}`, { method: "DELETE" });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { alert("Failed to delete notification."); }
    finally { setDeleting(null); }
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F97924]">Alerts</h1>
            <p className="text-[#737B8C] mt-1">Notifications from your coordinators</p>
          </div>
          {notifications.length > 0 && (
            <span className="text-xs bg-[#F97924]/10 text-[#F97924] border border-[#F97924]/30 px-3 py-1 rounded-full">
              {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading && <p className="text-[#737B8C] text-center py-10">Loading...</p>}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-20 text-[#737B8C] bg-[#12151C] rounded-2xl border border-[#252832]">
            <p className="text-4xl mb-3">🔔</p>
            <p className="font-semibold">No notifications yet</p>
            <p className="text-sm mt-1">Your coordinators haven't sent any alerts</p>
          </div>
        )}

        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n._id}
              className="flex gap-3 p-4 rounded-xl border border-[#252832]/50 bg-[#12151C]/85 border-l-[3px] border-l-[#F97924] group">
              <div className="w-11 h-11 flex items-center justify-center rounded-xl border border-[#F97924]/20 bg-[#F97924]/15 text-lg shrink-0">
                📢
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <span className="font-semibold text-sm">{n.subject}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[#737B8C] text-xs">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                    <button onClick={() => handleDelete(n._id)} disabled={deleting === n._id}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs disabled:opacity-50">
                      {deleting === n._id ? "…" : "🗑"}
                    </button>
                  </div>
                </div>

                <p className="text-[#737B8C] text-sm">{n.message}</p>

                {n.event?.title && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-[#F97924]/15 text-[#F97924]">
                    📅 {n.event.title}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;