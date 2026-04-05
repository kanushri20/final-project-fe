import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const categoryColors = {
  technical: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  cultural: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  sports: "text-green-400 bg-green-400/10 border-green-400/30",
  workshop: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  seminar: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

const MyEvents = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unregistering, setUnregistering] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user._id) { navigate("/login"); return; }
    fetch(`${BASE_URL}/registrations/user/${user._id}`)
      .then(r => r.json())
      .then(data => setRegistrations(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUnregister = async (regId, title) => {
    if (!window.confirm(`Unregister from "${title}"?`)) return;
    setUnregistering(regId);
    try {
      await fetch(`${BASE_URL}/registrations/${regId}`, { method: "DELETE" });
      setRegistrations(prev => prev.filter(r => r._id !== regId));
    } catch { alert("Failed to unregister."); }
    finally { setUnregistering(null); }
  };

  const today = new Date();
  const upcoming = registrations.filter(r => r.event && new Date(r.event.date) >= today);
  const completed = registrations.filter(r => r.event && new Date(r.event.date) < today);

  const EventCard = ({ reg, isPast }) => {
    const event = reg.event;
    if (!event) return null;
    const catColor = categoryColors[event.category?.toLowerCase()] || "text-[#737B8C] bg-[#1D212A] border-[#252832]";
    const isFree = event.isFree || !event.cost || event.cost === 0;

    return (
      <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-5 hover:border-orange-400/30 transition">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-base mb-2">{event.title}</h3>
            <div className="flex flex-wrap gap-1.5">
              {event.category && (
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${catColor}`}>
                  {event.category}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full ${isPast ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"}`}>
                {isPast ? "Completed" : "Upcoming"}
              </span>
              {/* Price badge - clean pill */}
              {isFree ? (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
                  ✓ Free
                </span>
              ) : (
                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-[#F97924]/10 border border-[#F97924]/20 text-[#F97924] font-medium">
                  ₹{event.cost}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-[#737B8C] space-y-1 mb-4">
          {event.date && (
            <div>📅 {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {event.time ? ` • ⏰ ${event.time}` : ""}
            </div>
          )}
          {event.location && <div>📍 {event.location}</div>}
          {event.organizer && <div>🏫 {event.organizer}</div>}
        </div>

        <div className="flex gap-2 pt-3 border-t border-[#1D212A]">
          {isPast ? (
            <>
              <button onClick={() => navigate(`/eventfeedback/${event._id}`)}
                className="flex-1 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs hover:bg-orange-500/20 transition font-medium">
                ⭐ Give Feedback
              </button>
              {event.driveLink ? (
                <a href={event.driveLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/20 transition font-medium text-center">
                  🖼 Event Media
                </a>
              ) : (
                <span className="flex-1 py-2 rounded-lg bg-[#1D212A] text-[#737B8C] text-xs text-center cursor-not-allowed">
                  🖼 No Media
                </span>
              )}
            </>
          ) : (
            <>
              <button onClick={() => navigate(`/eventdetails/${event._id}`)}
                className="flex-1 py-2 rounded-lg bg-[#1D212A] text-[#737B8C] text-xs hover:text-white hover:bg-[#252930] transition">
                View Details
              </button>
              <button
                onClick={() => handleUnregister(reg._id, event.title)}
                disabled={unregistering === reg._id}
                className="py-2 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition disabled:opacity-50">
                {unregistering === reg._id ? "..." : "Unregister"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="text-[#737B8C] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">My Events</h1>
            <p className="text-[#737B8C] text-sm">All your registered events</p>
          </div>
        </div>

        {loading && <p className="text-[#737B8C] text-center py-20">Loading your events...</p>}

        {!loading && registrations.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold">No registrations yet</p>
            <button onClick={() => navigate("/upcomingevents")}
              className="mt-4 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 text-sm text-[#0B0E13] font-semibold">
              Browse Events
            </button>
          </div>
        )}

        {!loading && upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[#F97924] mb-4 uppercase tracking-wider">
              Upcoming ({upcoming.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.map(reg => <EventCard key={reg._id} reg={reg} isPast={false} />)}
            </div>
          </div>
        )}

        {!loading && completed.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wider">
              Completed ({completed.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {completed.map(reg => <EventCard key={reg._id} reg={reg} isPast={true} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;