import { useEffect, useState } from "react";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const yearsList = ["1st year", "2nd year", "3rd year", "4th year"];
const deptList = ["CSE", "IT", "ENTC", "Mech", "Civil"];

const NotifyStudents = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [eventId, setEventId] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [sentList, setSentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch real events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/events`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  const toggleSelection = (value, list, setter) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const toggleAll = (type) => {
    if (type === "year") {
      setSelectedYears(selectedYears.length === yearsList.length ? [] : yearsList);
    } else {
      setSelectedDepts(selectedDepts.length === deptList.length ? [] : deptList);
    }
  };

  const sendNotification = async () => {
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }
    if (!selectedYears.length && !selectedDepts.length) {
      setError("Select at least one year or department.");
      return;
    }

    setLoading(true);
    try {
      // Build recipients: fetch all users and filter by year/dept
      const usersRes = await fetch(`${BASE_URL}/register`);
      const allUsers = await usersRes.json();

      // Filter students matching selected years OR depts
      const recipients = allUsers
        .filter((u) => u.role === "student")
        .filter(
          (u) =>
            selectedYears.includes(u.year) || selectedDepts.includes(u.department)
        )
        .map((u) => u._id);

      const payload = {
        title,
        message,
        event: eventId || undefined,
        recipients,
      };

      const res = await fetch(`${BASE_URL}/add-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send notification.");
        return;
      }

      const newNotif = {
        title,
        message,
        event: eventId,
        years: selectedYears,
        depts: selectedDepts,
        recipientCount: recipients.length,
        time: new Date().toLocaleString(),
      };

      setSentList((prev) => [newNotif, ...prev]);
      setSuccess(`Notification sent to ${recipients.length} student(s)!`);

      // Reset
      setTitle("");
      setMessage("");
      setEventId("");
      setSelectedYears([]);
      setSelectedDepts([]);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Notify Students</h1>
          <p className="text-[#737B8C] mt-1">
            Send targeted notifications to students by year and department.
          </p>
        </div>

        {/* Feedback */}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Compose */}
        <div className="bg-[#12151C]/85 border border-[#252832]/50 rounded-2xl p-6 mb-5 space-y-4">
          <h2 className="text-xl font-bold">Compose Notification</h2>

          <div>
            <label className="text-xs mb-2 block">Subject *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1D212A] border border-[#252832] outline-none focus:border-[#F97924]"
              placeholder="Hackathon 2026 Registration Now Open"
            />
          </div>

          <div>
            <label className="text-xs mb-2 block">Message *</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1D212A] border border-[#252832] outline-none focus:border-[#F97924]"
              placeholder="Write your notification message..."
            />
          </div>

          <div>
            <label className="text-xs mb-2 block">Related Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1D212A] border border-[#252832]"
            >
              <option value="">— No specific event —</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Year Selection */}
        <div className="bg-[#12151C]/85 border border-[#252832]/50 rounded-2xl p-6 mb-5">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Select Year</h2>
            <button onClick={() => toggleAll("year")} className="text-xs text-[#F97924]">
              {selectedYears.length === yearsList.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {yearsList.map((y) => (
              <label key={y} className="flex items-center gap-2 p-3 rounded-lg bg-[#1D212A]/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedYears.includes(y)}
                  onChange={() => toggleSelection(y, selectedYears, setSelectedYears)}
                  className="accent-[#F97924]"
                />
                <span className="text-sm">{y}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Department Selection */}
        <div className="bg-[#12151C]/85 border border-[#252832]/50 rounded-2xl p-6 mb-5">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Select Department</h2>
            <button onClick={() => toggleAll("dept")} className="text-xs text-[#F97924]">
              {selectedDepts.length === deptList.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {deptList.map((d) => (
              <label key={d} className="flex items-center gap-2 p-3 rounded-lg bg-[#1D212A]/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDepts.includes(d)}
                  onChange={() => toggleSelection(d, selectedDepts, setSelectedDepts)}
                  className="accent-[#F97924]"
                />
                <span className="text-sm">{d}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#F97924]/10 border border-[#F97924]/30 rounded-xl p-4 mb-5 text-sm text-[#737B8C]">
          Sending to {selectedYears.length} year(s) and {selectedDepts.length} department(s)
          {selectedYears.length ? `: ${selectedYears.join(", ")}` : ""}
        </div>

        {/* Send Button */}
        <button
          onClick={sendNotification}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#F97924] to-[#FF930F] hover:shadow-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>

        {/* Sent History */}
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Sent Notifications (this session)</h2>
          {sentList.length === 0 ? (
            <p className="text-[#737B8C] text-sm">No notifications sent yet.</p>
          ) : (
            <div className="space-y-3">
              {sentList.slice(0, 10).map((n, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#252832] bg-[#1D212A]/70">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold">{n.title}</span>
                    <span className="text-xs text-[#737B8C]">{n.time}</span>
                  </div>
                  <p className="text-sm text-[#737B8C] mb-2">
                    {n.message.slice(0, 100)}{n.message.length > 100 ? "…" : ""}
                  </p>
                  <p className="text-xs text-green-400 mb-2">
                    Sent to {n.recipientCount} student(s)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {n.years.map((y, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[#F97924]/15 text-[#F97924]">
                        {y} Year
                      </span>
                    ))}
                    {n.depts.map((d, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotifyStudents;