import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const categoryImages = {
  cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  technical: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
  seminar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
};

const CompletedEvents = () => {
  const navigate = useNavigate();
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        // Get all events student registered for
        const regRes = await fetch(`${BASE_URL}/registrations/user/${user._id}`);
        const regs = await regRes.json();
        // Filter: event date is in the past
        const today = new Date();
        const past = regs
          .filter((r) => r.event && new Date(r.event.date) < today)
          .map((r) => r.event);
        setCompletedEvents(past);
      } catch (err) {
        // Fallback: fetch all events and filter past
        try {
          const res = await fetch(`${BASE_URL}/events`);
          const data = await res.json();
          const today = new Date();
          setCompletedEvents(data.filter((ev) => new Date(ev.date) < today));
        } catch { console.error(err); }
      } finally { setLoading(false); }
    };
    fetchCompleted();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => window.history.back()} className="text-[#737B8C] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">Completed Events</h1>
            <p className="text-[#737B8C] text-sm">Events you've attended</p>
          </div>
        </div>

        {loading && <p className="text-[#737B8C] text-center py-10">Loading...</p>}

        {!loading && completedEvents.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-4xl mb-3">🎓</p>
            <p className="font-semibold">No completed events yet</p>
            <p className="text-sm mt-1">Events you register for will appear here after they conclude</p>
          </div>
        )}

        <div className="space-y-4">
          {completedEvents.map((event) => {
            const imgSrc = categoryImages[event.category?.toLowerCase()] || categoryImages.technical;
            return (
              <div key={event._id}
                className="bg-[#12151C]/85 border border-[#252832]/50 rounded-2xl overflow-hidden hover:border-orange-400/20 transition">
                <img src={imgSrc} alt={event.title}
                  className="w-full h-36 object-cover"
                  onError={(e) => (e.target.style.display = "none")} />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold">{event.title}</h3>
                    <div className="flex gap-2 shrink-0">
                      {event.category && (
                        <span className="text-xs px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 capitalize">
                          {event.category}
                        </span>
                      )}
                      <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400">
                        Completed
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#737B8C] mb-4">
                    {event.date
                      ? new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Date N/A"}
                    {event.location ? ` • ${event.location}` : ""}
                  </p>

                  <div className="flex gap-3">
                    <button onClick={() => navigate(`/eventfeedback/${event._id}`)}
                      className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-[#1D212A] rounded-lg text-sm text-[#C4CCD4] hover:bg-orange-500/10 hover:text-orange-400 transition">
                      ⭐ Rate & Feedback
                    </button>

                    {event.driveLink ? (
                      <a href={event.driveLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-[#1D212A] rounded-lg text-sm text-[#C4CCD4] hover:bg-blue-500/10 hover:text-blue-400 transition">
                        🖼 Event Media
                      </a>
                    ) : (
                      <button
                        className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-[#1D212A] rounded-lg text-sm text-[#737B8C] cursor-not-allowed"
                        disabled>
                        🖼 No Media Yet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompletedEvents;