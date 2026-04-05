import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map((v) => (
      <span key={v} className={v <= rating ? "text-orange-400" : "text-[#252832]"}>★</span>
    ))}
  </div>
);

const StudentFeedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, fbRes] = await Promise.all([
          fetch(`${BASE_URL}/events/${eventId}`),
          fetch(`${BASE_URL}/feedback/event/${eventId}`),
        ]);
        setEvent(await evRes.json());
        setFeedbacks(await fbRes.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (eventId) fetchData();
    else {
      // No eventId: load all feedback
      fetch(`${BASE_URL}/feedback`)
        .then(r => r.json())
        .then(data => setFeedbacks(data))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    setDeleting(id);
    try {
      await fetch(`${BASE_URL}/feedback/${id}`, { method: "DELETE" });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch { alert("Failed to delete."); }
    finally { setDeleting(null); }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + (f.overallRating || 0), 0) / feedbacks.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-[#737B8C] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Student Feedback</h1>
        </div>
        {event && <p className="text-[#F97924] font-medium ml-8 mb-8">{event.title}</p>}
        {!event && !eventId && <p className="text-[#737B8C] ml-8 mb-8">All events</p>}

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Responses", value: feedbacks.length, color: "text-[#F97924]" },
            { label: "Avg Rating", value: avgRating, color: "text-yellow-400" },
            { label: "Avg Venue Rating",
              value: feedbacks.length
                ? (feedbacks.reduce((s,f)=>s+(f.venueRating||0),0)/feedbacks.length).toFixed(1)
                : "—",
              color: "text-blue-400" },
          ].map((s, i) => (
            <div key={i} className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[#737B8C] text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading && <p className="text-[#737B8C] text-center py-10">Loading feedback...</p>}

        {!loading && feedbacks.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-3xl mb-3">💬</p>
            <p>No feedback submitted yet</p>
          </div>
        )}

        {/* Feedback Cards */}
        <div className="space-y-4">
          {feedbacks.map((fb) => {
            const u = fb.user || {};
            return (
              <div key={fb._id} className="bg-[#12151C] border border-[#252832] rounded-2xl p-5">
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-[#737B8C]">{u.department} • {u.year} • {u.email}</p>
                    {fb.event?.title && (
                      <p className="text-xs text-[#F97924] mt-0.5">📅 {fb.event.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#737B8C]">
                      {new Date(fb.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <button onClick={() => handleDelete(fb._id)} disabled={deleting === fb._id}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50 text-xs">
                      {deleting === fb._id ? "..." : "🗑"}
                    </button>
                  </div>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#1D212A] rounded-lg p-3">
                    <p className="text-xs text-[#737B8C] mb-1">Overall Rating</p>
                    <Stars rating={fb.overallRating} />
                  </div>
                  <div className="bg-[#1D212A] rounded-lg p-3">
                    <p className="text-xs text-[#737B8C] mb-1">Venue Rating</p>
                    <Stars rating={fb.venueRating} />
                  </div>
                </div>

                {fb.organization && (
                  <div className="mb-3">
                    <span className="text-xs text-[#737B8C]">Organization: </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      fb.organization === "Excellent" ? "bg-green-500/10 text-green-400" :
                      fb.organization === "Good" ? "bg-blue-500/10 text-blue-400" :
                      fb.organization === "Average" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    }`}>{fb.organization}</span>
                  </div>
                )}

                {fb.liked && (
                  <div className="mb-2">
                    <p className="text-xs text-[#737B8C] mb-1">What they liked:</p>
                    <p className="text-sm bg-[#1D212A] p-2 rounded">{fb.liked}</p>
                  </div>
                )}
                {fb.suggestions && (
                  <div className="mb-2">
                    <p className="text-xs text-[#737B8C] mb-1">Suggestions:</p>
                    <p className="text-sm bg-[#1D212A] p-2 rounded">{fb.suggestions}</p>
                  </div>
                )}
                {fb.ideaBox && (
                  <div>
                    <p className="text-xs text-[#737B8C] mb-1">💡 Ideas:</p>
                    <p className="text-sm bg-[#1D212A] p-2 rounded">{fb.ideaBox}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;