import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

const CoordinatorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      // Check role
      if (data.role !== "coordinator") {
        setError("Access denied. Not a coordinator account.");
        return;
      }
      // Save coordinator info to localStorage
      localStorage.setItem("coordinator", JSON.stringify(data));
      navigate("/coordinatordashboard");
    } catch (err) {
      
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] flex relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full top-[-100px] right-[-100px] bg-[radial-gradient(circle,rgba(249,121,36,0.08),transparent)]"></div>
      <div className="absolute w-[300px] h-[300px] rounded-full bottom-[-80px] left-[-80px] bg-[radial-gradient(circle,rgba(249,121,36,0.05),transparent)]"></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F97924] to-[#FF930F] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">EventHub</span>
          <span className="text-[10px] text-[#F97924] font-semibold px-2 py-0.5 rounded-full border border-[#F9792430] bg-[#F9792415]">
            COORDINATOR
          </span>
        </div>

        <div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F97924] to-[#FF930F] flex items-center justify-center shadow-[0_0_40px_rgba(249,121,36,0.3)] mb-8">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Coordinator <br /> Control{" "}
            <span className="text-[#F97924]">Panel</span>
          </h1>
          <p className="text-[#737B8C] text-lg mb-10">
            Create events, manage registrations, track budgets, analyze student engagement, and send notifications.
          </p>
          <div className="flex gap-8">
            <div><div className="text-3xl font-bold text-[#F97924]">50+</div><div className="text-sm text-[#737B8C]">Events Created</div></div>
            <div><div className="text-3xl font-bold text-[#F97924]">6</div><div className="text-sm text-[#737B8C]">Active Clubs</div></div>
            <div><div className="text-3xl font-bold text-[#F97924]">2k+</div><div className="text-sm text-[#737B8C]">Students</div></div>
          </div>
        </div>

        <p className="text-xs text-[#737B8C]">PCCOER — Coordinator Portal</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">
          <div className="bg-[#12151C] rounded-2xl p-8 border border-[#1D212A] shadow-[0_0_60px_rgba(249,121,36,0.1)]">
            <h2 className="text-2xl font-bold text-white mb-1">Coordinator Login</h2>
            <p className="text-[#737B8C] text-sm mb-8">Enter your credentials</p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs text-white mb-2 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@university.edu"
                  className="w-full bg-[#1D212A] px-4 py-3 rounded-xl border border-[#25283280] text-white outline-none focus:border-[#F97924]"
                />
              </div>

              <div>
                <label className="text-xs text-white mb-2 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1D212A] px-4 py-3 rounded-xl border border-[#25283280] text-white outline-none focus:border-[#F97924]"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold bg-gradient-to-br from-[#F97924] to-[#FF930F] hover:shadow-lg hover:shadow-orange-500/30 transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </div>

            <p className="text-center text-[#737B8C] text-sm mt-6">
              Are you a student?{" "}
              <Link to="/login"><span className="text-[#F97924] cursor-pointer">Login here</span></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorLogin;