import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const MarkAttendance = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          fetch(`${BASE_URL}/events/${eventId}`),
          fetch(`${BASE_URL}/registrations/event/${eventId}`),
        ]);
        const evData = await evRes.json();
        const regData = await regRes.json();
        setEvent(evData);
        setRegistrations(regData.map((r) => ({ ...r, attended: r.attended ?? false })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (eventId) fetchData();
  }, [eventId]);

  const toggle = (regId) => {
    setRegistrations((prev) =>
      prev.map((r) => r._id === regId ? { ...r, attended: !r.attended } : r)
    );
    setSaved(false);
  };

  const markAll = (val) => {
    setRegistrations((prev) => prev.map((r) => ({ ...r, attended: val })));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      // Save each registration's attendance
      await Promise.all(
        registrations.map((r) =>
          fetch(`${BASE_URL}/registrations/${r._id}/attendance`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ attended: r.attended }),
          })
        )
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert("Failed to save attendance."); }
    finally { setSaving(false); }
  };

  const filtered = registrations.filter((r) => {
    const u = r.user || {};
    const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const roll = (u.rollNo || "").toLowerCase();
    return name.includes(search.toLowerCase()) || roll.includes(search.toLowerCase());
  });

  const presentCount = registrations.filter((r) => r.attended).length;
  const absentCount = registrations.length - presentCount;
  const attendanceRate = registrations.length
    ? Math.round((presentCount / registrations.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="text-[#737B8C] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Mark Attendance</h1>
        </div>
        {event && (
          <p className="text-[#F97924] font-medium ml-8 mb-8">{event.title}
            {event.date && (
              <span className="text-[#737B8C] font-normal ml-2">
                • {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#F97924]">{registrations.length}</div>
            <div className="text-[#737B8C] text-xs mt-1">Total Registered</div>
          </div>
          <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{presentCount}</div>
            <div className="text-[#737B8C] text-xs mt-1">Present</div>
          </div>
          <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{absentCount}</div>
            <div className="text-[#737B8C] text-xs mt-1">Absent</div>
          </div>
          <div className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{attendanceRate}%</div>
            <div className="text-[#737B8C] text-xs mt-1">Attendance Rate</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6 bg-[#12151C] border border-[#252832] rounded-xl p-4">
          <div className="flex justify-between text-xs text-[#737B8C] mb-2">
            <span>Attendance Progress</span>
            <span>{presentCount} / {registrations.length}</span>
          </div>
          <div className="h-2.5 bg-[#1D212A] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-[#1D212A] border border-[#252832] rounded-xl px-4 py-2">
            <svg className="w-4 h-4 text-[#737B8C] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name or roll no..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => markAll(true)}
              className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition">
              ✓ Mark All Present
            </button>
            <button onClick={() => markAll(false)}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition">
              ✗ Mark All Absent
            </button>
          </div>
        </div>

        {loading && <p className="text-[#737B8C] text-center py-10">Loading students...</p>}

        {!loading && registrations.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-3xl mb-3">👥</p>
            <p>No students registered for this event</p>
          </div>
        )}

        {/* Student List */}
        {!loading && filtered.length > 0 && (
          <div className="bg-[#12151C] border border-[#252832] rounded-2xl overflow-hidden mb-6">
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-[#252832] text-[#737B8C] text-xs font-medium">
              <span>#</span>
              <span>Student</span>
              <span>Roll No</span>
              <span>Dept / Year</span>
              <span>Div</span>
              <span className="text-center">Attendance</span>
            </div>

            <div className="divide-y divide-[#1D212A]">
              {filtered.map((reg, i) => {
                const u = reg.user || {};
                return (
                  <div key={reg._id}
                    className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3.5 transition cursor-pointer
                      ${reg.attended ? "bg-green-500/5 hover:bg-green-500/8" : "hover:bg-[#1D212A]/50"}`}
                    onClick={() => toggle(reg._id)}>

                    <span className="text-[#737B8C] text-xs w-5">{i + 1}</span>

                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-[#737B8C] truncate">{u.email}</p>
                    </div>

                    <span className="text-xs text-[#737B8C] font-mono">{u.rollNo || "—"}</span>
                    <span className="text-xs text-[#737B8C]">{u.department || "—"} / {u.year || "—"}</span>
                    <span className="text-xs text-[#737B8C]">{u.division || "—"}</span>

                    {/* Toggle */}
                    <div className="flex justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggle(reg._id); }}
                        className={`w-12 h-6 rounded-full transition-all duration-300 relative
                          ${reg.attended ? "bg-green-500" : "bg-[#252832]"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300
                          ${reg.attended ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Save Button */}
        {!loading && registrations.length > 0 && (
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 font-semibold text-[#0B0E13] hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2">
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving...
                </>
              ) : "💾 Save Attendance"}
            </button>

            {saved && (
              <span className="text-green-400 text-sm flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                Attendance saved!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkAttendance;