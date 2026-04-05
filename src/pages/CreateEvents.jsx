import { useState } from "react";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const CreateEvents = () => {
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "",
    location: "", category: "", spots: "", organizer: "",
    isFree: true, cost: "", driveLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isFree" && checked ? { cost: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    if (!form.title || !form.date || !form.spots) {
      setError("Title, Date, and Total Spots are required.");
      return;
    }
    const coordinator = JSON.parse(localStorage.getItem("coordinator") || "{}");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          spots: Number(form.spots),
          cost: form.isFree ? 0 : Number(form.cost) || 0,
          createdBy: coordinator._id || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create event."); return; }
      setSuccess(`Event "${data.title}" created successfully!`);
      setForm({ title: "", description: "", date: "", time: "", location: "", category: "", spots: "", organizer: "", isFree: true, cost: "", driveLink: "" });
    } catch { setError("Server error. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#EDEBE9]">
      <CoordinatorNavbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-[#0E1115] border border-[#272C35] rounded-xl shadow-md p-6">
          <h1 className="text-xl font-bold text-center mb-6">Create New Event</h1>

          {success && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{success}</div>}
          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}

          <label className="text-sm mb-2 block">Event Title *</label>
          <input name="title" value={form.title} onChange={handleChange}
            className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 mb-5 outline-none focus:border-orange-500" />

          <label className="text-sm mb-2 block">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            placeholder="Describe the event..." rows={3}
            className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 mb-5 outline-none focus:border-orange-500" />

          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="text-sm mb-2 block">Date *</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="text-sm mb-2 block">Time</label>
              <input type="time" name="time" value={form.time} onChange={handleChange}
                className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2" />
            </div>
          </div>

          <label className="text-sm mb-2 block">Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 mb-5 outline-none" />

          <div className="flex gap-4 mb-5">
            <div className="flex-1">
              <label className="text-sm mb-2 block">Category</label>
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2">
                <option value="">Select</option>
                {["technical","cultural","sports","workshop","seminar"].map(c =>
                  <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase()+c.slice(1)}</option>
                )}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm mb-2 block">Total Spots *</label>
              <input type="number" name="spots" value={form.spots} onChange={handleChange}
                className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2" />
            </div>
          </div>

          <label className="text-sm mb-2 block">Organizer</label>
          <input name="organizer" value={form.organizer} onChange={handleChange}
            className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 mb-5 outline-none" />

          {/* Cost Section */}
          <div className="bg-[#1A1D25] border border-[#272C35]/50 rounded-lg p-4 mb-5">
            <label className="text-sm font-semibold mb-3 block">Entry Fee</label>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange}
                className="accent-orange-500 w-4 h-4" />
              <span className="text-sm text-[#E7EBEF]">This is a free event</span>
            </label>
            {!form.isFree && (
              <div>
                <label className="text-xs mb-2 block text-[#737B8C]">Entry Cost (₹)</label>
                <input type="number" name="cost" value={form.cost} onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 outline-none focus:border-orange-500" />
              </div>
            )}
          </div>

          {/* Google Drive Link */}
          <label className="text-sm mb-2 block">Google Drive Photo Link</label>
          <input name="driveLink" value={form.driveLink} onChange={handleChange}
            placeholder="https://drive.google.com/drive/folders/..."
            className="w-full bg-[#21242C] border border-[#272C35]/50 rounded-lg px-3 py-2 mb-6 outline-none focus:border-orange-500" />

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 py-3 rounded-lg font-bold text-[#0E1115] hover:shadow-lg transition disabled:opacity-50">
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEvents;