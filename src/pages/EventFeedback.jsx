import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

export default function EventFeedback() {
  const { id } = useParams(); // event id
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [ratings, setRatings] = useState({ overall: 0, venue: 0 });
  const [hover, setHover] = useState({ overall: 0, venue: 0 });
  const [organization, setOrganization] = useState("");
  const [liked, setLiked] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [ideaBox, setIdeaBox] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch(console.error);
  }, [id]);

  const StarGroup = ({ type }) => {
    const current = hover[type] || ratings[type];
    return (
      <div className="flex gap-2" onMouseLeave={() => setHover({ ...hover, [type]: 0 })}>
        {[1, 2, 3, 4, 5].map((val) => (
          <span
            key={val}
            onClick={() => setRatings({ ...ratings, [type]: val })}
            onMouseEnter={() => setHover({ ...hover, [type]: val })}
            className={`text-2xl cursor-pointer transition ${val <= current ? "text-orange-500" : "text-gray-600"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const handleSubmit = async () => {
    setError("");

    if (!user._id) {
      setError("You must be logged in to submit feedback.");
      return;
    }
    if (!id) {
      setError("No event specified.");
      return;
    }
    if (ratings.overall === 0) {
      setError("Please give an overall rating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user._id,
          event: id,
          overallRating: ratings.overall,
          venueRating: ratings.venue,
          organization,
          liked,
          suggestions,
          ideaBox,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit feedback.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Feedback Submitted!</h2>
          <p className="text-[#737B8C] mb-6">Thank you for your response.</p>
          <button
            onClick={() => navigate("/completedEvents")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 font-semibold"
          >
            Back to Completed Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => window.history.back()} className="text-[#737B8C] mb-6 flex items-center gap-2 hover:text-white transition">
          ← Back
        </button>

        <div className="bg-[#12151C] border border-[#1D212A] rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-1">Submit Feedback</h1>
          <h2 className="text-orange-500 mb-6 font-medium">
            {event?.title || "Loading event..."}
          </h2>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Overall Rating */}
            <div>
              <p className="mb-2">How would you rate the overall event experience? *</p>
              <StarGroup type="overall" />
            </div>

            {/* Venue Rating */}
            <div>
              <p className="mb-2">How was the venue arrangement?</p>
              <StarGroup type="venue" />
            </div>

            {/* Organization */}
            <div>
              <p className="mb-2">Was the event well-organized?</p>
              <div className="flex flex-wrap gap-2">
                {["Excellent", "Good", "Average", "Poor"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setOrganization(opt)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      organization === opt
                        ? "border-orange-500 text-orange-500 bg-orange-500/10"
                        : "border-[#1D212A] text-[#C4CCD4] bg-[#1D212A]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* What did you like */}
            <div>
              <p className="mb-2">What did you like most?</p>
              <textarea
                value={liked}
                onChange={(e) => setLiked(e.target.value)}
                placeholder="Your answer..."
                className="w-full bg-[#1D212A] p-3 rounded resize-none outline-none focus:border focus:border-orange-500"
              />
            </div>

            {/* Suggestions */}
            <div>
              <p className="mb-2">Suggestions for improvement?</p>
              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                placeholder="Your answer..."
                className="w-full bg-[#1D212A] p-3 rounded resize-none outline-none focus:border focus:border-orange-500"
              />
            </div>

            {/* Idea Box */}
            <div>
              <p className="mb-2">💡 Suggestion Box</p>
              <textarea
                value={ideaBox}
                onChange={(e) => setIdeaBox(e.target.value)}
                placeholder="Share ideas..."
                className="w-full bg-[#1D212A] p-3 rounded min-h-[100px] outline-none focus:border focus:border-orange-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-3 rounded-lg font-semibold hover:scale-[1.01] transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}