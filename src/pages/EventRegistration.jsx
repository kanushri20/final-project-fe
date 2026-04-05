import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const EventRegistration = () => {
  const { id } = useParams(); // event id from URL
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Pre-fill from localStorage user  
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(storedUser)
  const [form, setForm] = useState({
    firstName: storedUser.firstName || "",
    lastName: storedUser.lastName || "",
    rollNo: storedUser.rollNo || "",
    division: storedUser.division || "",
    year: storedUser.year || "",
    department: storedUser.department || "",
    phone: storedUser.phone || "",
    email: storedUser.email || "",
  });

  // Fetch event details for display
  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/events/${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    if (!storedUser._id) {
      setError("You must be logged in to register.");
      return;
    }
    if (!id) {
      setError("No event selected.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/register-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: storedUser._id,
          event: id,
          // snapshot of student details at time of registration
          firstName: form.firstName,
          lastName: form.lastName,
          rollNo: form.rollNo,
          division: form.division,
          year: form.year,
          department: form.department,
          phone: form.phone,
          email: form.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Registration Confirmed!</h2>
          <p className="text-[#737B8C]">
            You've successfully registered for{" "}
            <span className="text-[#F97924]">{event?.title}</span>.
          </p>
          <p className="text-[#737B8C] text-sm mt-2">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-[700px] mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#737B8C] text-sm mb-6 hover:text-white transition"
        >
          ← Back
        </button>

        <div className="bg-[#12151C] border border-[#252832] rounded-2xl p-7">
          <h1 className="text-2xl font-bold mb-2">Register for Event</h1>
          <h2 className="text-[#F97924] text-lg font-semibold mb-1">
            {event?.title || "Loading event..."}
          </h2>
          <p className="text-[#737B8C] text-sm mb-8">
            Your details are pre-filled from your profile. Edit if needed, then confirm.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Name */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-2 block">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-xs mb-2 block">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
            </div>

            {/* Academic */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-2 block">Roll No</label>
                <input name="rollNo" value={form.rollNo} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-xs mb-2 block">Division</label>
                <input name="division" value={form.division} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs mb-2 block">Year of Study</label>
                <input name="year" value={form.year} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-xs mb-2 block">Department</label>
                <input name="department" value={form.department} onChange={handleChange}
                  className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
              </div>
            </div>

            <div>
              <label className="text-xs mb-2 block">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
            </div>

            <div>
              <label className="text-xs mb-2 block">Email ID</label>
              <input name="email" value={form.email} onChange={handleChange}
                className="w-full bg-[#1D212A] border border-[#252832] rounded-lg px-4 py-2" />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F97924] to-[#FF930F] py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:translate-y-[-1px] transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "✔ Confirm Registration"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;