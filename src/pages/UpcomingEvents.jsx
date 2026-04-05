import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";
const filters = ["all", "technical", "cultural", "sports", "workshop", "seminar"];

const categoryImages = {
  cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
  technical: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80",
  seminar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
};

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/events`);
        const data = await res.json();
        // Only show upcoming events (date >= today)
        const today = new Date();
        const upcoming = data.filter((ev) => new Date(ev.date) >= today);
        setEvents(upcoming);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchFilter =
      activeFilter === "all" ||
      event.category?.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch =
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.category?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getSpotsPercent = (event) => {
    if (!event.spots || event.spots === 0) return 0;
    const registered = event.registeredCount || 0;
    return Math.min((registered / event.spots) * 100, 100);
  };

  const getSpotsLeft = (event) => {
    if (!event.spots) return null;
    const registered = event.registeredCount || 0;
    return Math.max(event.spots - registered, 0);
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
          <p className="text-[#737B8C]">Discover and register for exciting campus events</p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2 bg-[#1D212A] border border-[#252832] rounded-xl px-4 py-2">
            <input
              type="text"
              placeholder="Search events..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-medium capitalize ${
                  activeFilter === f
                    ? "bg-orange-500 text-black"
                    : "bg-[#1D212A] text-[#737B8C] hover:bg-[#252930] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-[#737B8C] text-center py-20">Loading events...</p>
        )}

        {/* Grid */}
        {!loading && filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              const spotsLeft = getSpotsLeft(event);
              const percent = getSpotsPercent(event);
              const isFull = spotsLeft === 0 && event.spots;
              const imgSrc = categoryImages[event.category?.toLowerCase()] || categoryImages.technical;

              return (
                <div
                  key={event._id}
                  className="bg-[#12151C]/85 border border-[#252832]/50 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 transition"
                >
                  {/* Image */}
                  <div className="relative h-44">
                    <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                    <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full border border-white/20 bg-white/10 capitalize">
                      {event.category || "General"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-[#737B8C] mb-4 flex-1">{event.description}</p>

                    {/* Price badge */}
                    <div className="mb-3">
                      {(event.isFree || !event.cost || event.cost === 0) ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/25 text-green-400 font-medium">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                          Free Entry
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-[#F97924]/10 border border-[#F97924]/25 text-[#F97924] font-semibold">
                          ₹{event.cost} Entry Fee
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#737B8C] space-y-1 mb-4">
                      <div>
                        📅{" "}
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "TBD"}
                        {event.time ? ` • ⏰ ${event.time}` : ""}
                      </div>
                      {event.location && <div>📍 {event.location}</div>}
                      {event.organizer && <div>🏫 {event.organizer}</div>}
                    </div>

                    {/* Spots progress */}
                    {event.spots && (
                      <>
                        <div className="flex justify-between text-xs text-[#737B8C] mb-1">
                          <span>{isFull ? "Event Full" : `${spotsLeft} spots left`}</span>
                          <span>{event.spots} total</span>
                        </div>
                        <div className="h-1.5 bg-[#1D212A] rounded-full mb-4">
                          <div
                            className={`h-full rounded-full ${isFull ? "bg-red-500" : "bg-gradient-to-r from-orange-500 to-orange-400"}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </>
                    )}

                    {/* Button */}
                    {isFull ? (
                      <button className="bg-[#1D212A] text-[#737B8C] py-3 rounded-lg cursor-not-allowed text-sm">
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/eventdetails/${event._id}`)}
                        className="bg-gradient-to-r from-orange-500 to-orange-400 py-3 rounded-lg font-semibold hover:shadow-lg text-sm"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 text-[#737B8C]">
              <p className="text-lg">No events found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;