import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    email: true, push: true, reminder: true, dark: true,
  });

  // Load real user from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null");
    if (!stored) {
      navigate("/login");
      return;
    }
    setProfile({
      firstName: stored.firstName || "",
      lastName: stored.lastName || "",
      email: stored.email || "",
      phone: stored.phone || "",
      roll: stored.rollNo || "",
      dept: stored.department || "",
      year: stored.year || "",
      div: stored.division || "",
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    // Merge updated fields back into the stored user
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = {
      ...stored,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      rollNo: profile.roll,
      department: profile.dept,
      year: profile.year,
      division: profile.div,
    };
    localStorage.setItem("user", JSON.stringify(updated));
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 3000);
  };

  const resetProfile = () => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setProfile({
      firstName: stored.firstName || "",
      lastName: stored.lastName || "",
      email: stored.email || "",
      phone: stored.phone || "",
      roll: stored.rollNo || "",
      dept: stored.department || "",
      year: stored.year || "",
      div: stored.division || "",
    });
  };

  const changePassword = () => {
    const { current, new: nw, confirm } = passwords;
    if (!current || !nw || !confirm) { alert("All password fields are required."); return; }
    if (nw !== confirm) { alert("New passwords do not match."); return; }
    if (nw.length < 6) { alert("Password must be at least 6 characters."); return; }
    // Note: real password update would need a PUT /users/:id/password endpoint
    setPasswords({ current: "", new: "", confirm: "" });
    alert("✓ Password updated locally. Connect a /change-password endpoint to persist.");
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0B0E13] text-white flex items-center justify-center">
        <p className="text-[#737B8C]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#F97924]">Settings</h1>
          <p className="text-[#737B8C] mt-1">Manage your profile and preferences</p>
        </div>

        {/* Profile */}
        <div className="bg-[#12151C] border border-[#252832] rounded-xl p-6 mb-4">
          <h2 className="font-semibold mb-5">Edit Profile</h2>

          {showMsg && (
            <div className="mb-4 p-3 text-sm rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
              ✓ Profile saved locally. To persist, add a PUT /users/:id endpoint.
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
            <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
          </div>

          <input name="email" value={profile.email} onChange={handleChange} placeholder="Email" className="w-full mb-4 bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone" className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
            <input name="roll" value={profile.roll} onChange={handleChange} placeholder="Roll No" className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <select name="dept" value={profile.dept} onChange={handleChange} className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg">
              {["CSE", "IT", "Mech", "Civil", "ENTC"].map(d => <option key={d}>{d}</option>)}
            </select>
            <select name="year" value={profile.year} onChange={handleChange} className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg">
              {["1st year", "2nd year", "3rd year", "4th year"].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <select name="div" value={profile.div} onChange={handleChange} className="bg-[#1D212A] border border-[#252832] p-2 rounded-lg">
              {["A", "B", "C", "D", "E"].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={saveProfile} className="bg-gradient-to-r from-[#F97924] to-[#FF930F] px-4 py-2 rounded-lg font-semibold">
              Save Changes
            </button>
            <button onClick={resetProfile} className="bg-[#1D212A] px-4 py-2 rounded-lg text-[#C4CCD4]">
              Reset
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-[#12151C] border border-[#252832] rounded-xl p-6 mb-4">
          <h2 className="font-semibold mb-5">Change Password</h2>
          <div className="space-y-3">
            <input type="password" placeholder="Current Password" value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
            <input type="password" placeholder="New Password" value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
            <input type="password" placeholder="Confirm Password" value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full bg-[#1D212A] border border-[#252832] p-2 rounded-lg outline-none" />
            <button onClick={changePassword} className="bg-gradient-to-r from-[#F97924] to-[#FF930F] px-4 py-2 rounded-lg font-semibold">
              Update Password
            </button>
          </div>
        </div>

        {/* Notification Toggles */}
        <div className="bg-[#12151C] border border-[#252832] rounded-xl p-6 mb-4 space-y-4">
          <h2 className="font-semibold mb-2">Preferences</h2>
          {[
            { key: "email", label: "Email Notifications" },
            { key: "push", label: "Push Notifications" },
            { key: "reminder", label: "Event Reminders" },
            { key: "dark", label: "Dark Mode" },
          ].map((item) => (
            <div key={item.key} className="flex justify-between items-center">
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className="accent-[#F97924] w-4 h-4 cursor-pointer"
              />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold transition">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;