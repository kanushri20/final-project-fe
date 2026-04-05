import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const categoryColors = {
  technical: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  cultural: "text-pink-400 bg-pink-400/10 border-pink-400/30",
  sports: "text-green-400 bg-green-400/10 border-green-400/30",
  workshop: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  seminar: "text-purple-400 bg-purple-400/10 border-purple-400/30",
};

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/events`);
      setEvents(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also remove all registrations.`)) return;
    setDeleting(id);
    try {
      await fetch(`${BASE_URL}/events/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch { alert("Failed to delete event."); }
    finally { setDeleting(null); }
  };

  const filtered = events.filter((e) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="text-[#737B8C] mt-1">Create, edit and delete your club events</p>
          </div>
          <button onClick={() => navigate("/createevents")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 font-semibold text-sm text-[#0B0E13] hover:shadow-lg transition">
            + Create Event
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-2 bg-[#1D212A] border border-[#252832] rounded-xl px-4 py-2">
          <svg className="w-4 h-4 text-[#737B8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search events..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-[#E7EBEF]" />
        </div>

        {loading && <p className="text-[#737B8C] text-center py-20">Loading events...</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg font-semibold">No events found</p>
            <p className="text-sm mt-1">Create your first event to get started</p>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => {
            const isPast = event.date && new Date(event.date) < today;
            const catColor = categoryColors[event.category?.toLowerCase()] || "text-[#737B8C] bg-[#737B8C]/10 border-[#737B8C]/30";

            return (
              <div key={event._id}
                className="bg-[#12151C] border border-[#252832] rounded-2xl p-5 flex flex-col gap-4 hover:border-orange-400/30 transition">

                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold leading-tight flex-1">{event.title}</h3>
                  <div className="flex gap-1 shrink-0">
                    {event.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${catColor}`}>
                        {event.category}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isPast ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"}`}>
                      {isPast ? "Completed" : "Upcoming"}
                    </span>
                  </div>
                </div>

                {/* Price + Spots badges */}
                <div className="flex flex-wrap gap-2">
                  {(event.isFree || !event.cost || event.cost === 0) ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Free Entry
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#F97924]/10 border border-[#F97924]/25 text-[#F97924] font-medium">
                      ₹{event.cost} Entry
                    </span>
                  )}
                  {event.spots && (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#1D212A] border border-[#252832] text-[#737B8C]">
                      👥 {event.spots} spots
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="text-xs text-[#737B8C] space-y-1.5">
                  {event.date && (
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                      {event.time && <span>• ⏰ {event.time}</span>}
                    </div>
                  )}
                  {event.location && <div className="flex items-center gap-2"><span>📍</span><span>{event.location}</span></div>}
                  {event.organizer && <div className="flex items-center gap-2"><span>🏫</span><span>{event.organizer}</span></div>}
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-xs text-[#737B8C] line-clamp-2">{event.description}</p>
                )}

                {/* Drive link */}
                {event.driveLink && (
                  <a href={event.driveLink} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                    <span>🖼</span> View Event Photos
                  </a>
                )}

                {/* Actions */}
                <div className="mt-auto pt-3 border-t border-[#252832] space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/registeredstudents/${event._id}`)}
                      className="flex-1 py-2 rounded-lg bg-[#1D212A] text-xs text-[#737B8C] hover:text-white hover:bg-[#252930] transition">
                      👥 Students
                    </button>
                    <button onClick={() => navigate(`/studentfeedback/${event._id}`)}
                      className="flex-1 py-2 rounded-lg bg-[#1D212A] text-xs text-[#737B8C] hover:text-white hover:bg-[#252930] transition">
                      ⭐ Feedback
                    </button>
                    <button
                      onClick={() => handleDelete(event._id, event.title)}
                      disabled={deleting === event._id}
                      className="py-2 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-xs disabled:opacity-50">
                      {deleting === event._id ? "..." : "🗑"}
                    </button>
                  </div>
                  <button onClick={() => navigate(`/markattendance/${event._id}`)}
                    className="w-full py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/15 transition">
                    ✓ Mark Attendance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;