import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const RegisteredStudents = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          fetch(`${BASE_URL}/events/${eventId}`),
          fetch(`${BASE_URL}/registrations/event/${eventId}`),
        ]);
        setEvent(await evRes.json());
        const regs = await regRes.json();
        setStudents(regs.map((r) => ({ ...r, attended: r.attended || false })));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    if (eventId) fetchData();
  }, [eventId]);

  const filtered = students.filter((s) => {
    const u = s.user || {};
    const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const roll = (u.rollNo || "").toLowerCase();
    return name.includes(search.toLowerCase()) || roll.includes(search.toLowerCase());
  });

  const attendedCount = students.filter((s) => s.attended).length;

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-[#737B8C] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Registered Students</h1>
        </div>
        {event && (
          <p className="text-[#F97924] font-medium ml-8 mb-8">{event.title}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Registered", value: students.length, color: "text-[#F97924]" },
            { label: "Attended", value: attendedCount, color: "text-green-400" },
            { label: "Absent", value: students.length - attendedCount, color: "text-red-400" },
          ].map((s, i) => (
            <div key={i} className="bg-[#12151C] border border-[#252832] rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[#737B8C] text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-2 bg-[#1D212A] border border-[#252832] rounded-xl px-4 py-2">
          <input type="text" placeholder="Search by name or roll no..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full" />
        </div>

        {loading && <p className="text-[#737B8C] text-center py-10">Loading...</p>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-[#737B8C]">
            <p className="text-3xl mb-3">👥</p>
            <p>No students registered yet</p>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="bg-[#12151C] border border-[#252832] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#252832] text-[#737B8C] text-xs">
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Roll No</th>
                    <th className="text-left px-4 py-3">Dept / Year</th>
                    <th className="text-left px-4 py-3">Division</th>
                    <th className="text-left px-4 py-3">Phone</th>
                    <th className="text-left px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg, i) => {
                    const u = reg.user || {};
                    return (
                      <tr key={reg._id} className="border-b border-[#1D212A] hover:bg-[#1D212A]/40 transition">
                        <td className="px-4 py-3 text-[#737B8C]">{i + 1}</td>
                        <td className="px-4 py-3 font-medium">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-4 py-3 text-[#737B8C]">{u.rollNo || "-"}</td>
                        <td className="px-4 py-3 text-[#737B8C]">{u.department || "-"} • {u.year || "-"}</td>
                        <td className="px-4 py-3 text-[#737B8C]">{u.division || "-"}</td>
                        <td className="px-4 py-3 text-[#737B8C]">{u.phone || "-"}</td>
                        <td className="px-4 py-3 text-[#737B8C] text-xs">{u.email || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisteredStudents;