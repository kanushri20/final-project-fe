import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const categoryImages = {
  cultural: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
  technical: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
  workshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
  seminar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${BASE_URL}/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF] flex items-center justify-center">
        <p className="text-[#737B8C]">Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF] flex items-center justify-center">
        <p className="text-red-400">{error || "Event not found."}</p>
      </div>
    );
  }

  const imgSrc = categoryImages[event.category?.toLowerCase()] || categoryImages.technical;
  const registered = event.registeredCount || 0;
  const spotsLeft = event.spots ? Math.max(event.spots - registered, 0) : null;
  const percent = event.spots ? Math.min((registered / event.spots) * 100, 100) : 0;
  const isFull = spotsLeft === 0 && event.spots;

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "TBD";

  const isPast = event.date && new Date(event.date) < new Date();

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#737B8C] text-sm mb-6 hover:text-white transition"
        >
          ← Back to Events
        </button>

        {/* Hero */}
        <div className="relative h-[240px] rounded-2xl overflow-hidden mb-6">
          <img src={imgSrc} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E13]/80 to-transparent" />
          {event.category && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border border-blue-400/30 text-blue-400 bg-blue-400/20 capitalize">
              {event.category}
            </span>
          )}
          <h1 className="absolute bottom-5 left-5 text-2xl font-bold">{event.title}</h1>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          {/* Left */}
          <div>
            {/* About */}
            <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-6 mb-5">
              <h2 className="font-semibold mb-3">About this Event</h2>
              <p className="text-[#737B8C] text-sm">
                {event.description || "No description provided."}
              </p>
            </div>

            {/* Details */}
            <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Event Details</h2>
              <div className="flex flex-wrap gap-3 text-sm text-[#737B8C]">
                <span className="bg-[#1D212A] px-3 py-1 rounded-lg">📅 {formattedDate}</span>
                {event.time && (
                  <span className="bg-[#1D212A] px-3 py-1 rounded-lg">⏰ {event.time}</span>
                )}
                {event.location && (
                  <span className="bg-[#1D212A] px-3 py-1 rounded-lg">📍 {event.location}</span>
                )}
                {event.organizer && (
                  <span className="bg-[#1D212A] px-3 py-1 rounded-lg">🏫 {event.organizer}</span>
                )}
                {event.spots && (
                  <span className="bg-[#1D212A] px-3 py-1 rounded-lg">👥 {event.spots} spots</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-6">
              {event.spots && (
                <>
                  <div className="flex justify-between text-xs text-[#737B8C] mb-2">
                    <span>{isFull ? "No spots left" : `${spotsLeft} spots left`}</span>
                    <span>{event.spots} total</span>
                  </div>
                  <div className="bg-[#1D212A] h-2 rounded-full overflow-hidden mb-5">
                    <div
                      className={`h-full ${isFull ? "bg-red-500" : "bg-gradient-to-r from-[#F97924] to-[#FF930F]"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </>
              )}

              {isPast ? (
                <button className="w-full bg-[#1D212A] text-[#737B8C] py-3 rounded-xl cursor-not-allowed mb-3">
                  Event Ended
                </button>
              ) : isFull ? (
                <button className="w-full bg-[#1D212A] text-[#737B8C] py-3 rounded-xl cursor-not-allowed mb-3">
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/eventregistration/${event._id}`)}
                  className="w-full bg-gradient-to-r from-[#F97924] to-[#FF930F] py-3 rounded-xl font-semibold mb-3 hover:translate-y-[-1px] transition"
                >
                  Register Now
                </button>
              )}

              {event.date && (
                <p className="text-center text-xs text-[#737B8C]">
                  Event date: {formattedDate}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;