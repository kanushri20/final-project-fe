import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
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

      // Prevent coordinators from logging in as students
      if (data.role === "coordinator") {
        setError("This is a student portal. Please use the Coordinator login.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate("/upcomingevents");
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0E13] relative overflow-hidden">
      {/* Background */}
      <div className="absolute w-96 h-96 -top-20 -left-20 opacity-10 rounded-full bg-[radial-gradient(circle,#F97924,transparent)] animate-pulse"></div>
      <div className="absolute w-64 h-64 bottom-10 right-10 opacity-8 rounded-full bg-[radial-gradient(circle,#FF930F,transparent)] animate-pulse"></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-400 text-white font-bold">
            📅
          </div>
          <span className="text-white font-bold text-2xl">EventHub</span>
        </div>

        <div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Your Campus.<br />
            Your Events.<br />
            <span className="text-orange-500">Your Hub.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Discover, register, and manage campus events all in one place.
          </p>
          <div className="flex gap-8">
            <div><div className="text-3xl font-bold text-orange-500">50+</div><div className="text-gray-400 text-sm">Events Monthly</div></div>
            <div><div className="text-3xl font-bold text-orange-500">6</div><div className="text-gray-400 text-sm">Active Clubs</div></div>
            <div><div className="text-3xl font-bold text-orange-500">2k+</div><div className="text-gray-400 text-sm">Students</div></div>
          </div>
        </div>

        <p className="text-gray-500 text-xs mt-10">PCCOER Campus Events Management System</p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-400 text-white font-bold">📅</div>
            <span className="text-white font-bold text-xl">EventHub</span>
          </div>

          <div className="bg-[#12151C] rounded-2xl p-8 border border-[#1D212A] shadow-[0_0_60px_rgba(249,121,36,0.15)]">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-gray-400 text-sm mb-8">Enter your student credentials to continue</p>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-white text-xs mb-2 block">Student Email</label>
                <div className="flex items-center gap-3 bg-[#1D212A] px-4 py-3 rounded-xl border border-[#25283280] focus-within:border-orange-400 transition-all">
                  <input
                    type="email"
                    placeholder="your.email@uni.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-transparent w-full text-white outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-xs">Password</label>
                  <a href="#" className="text-orange-500 text-xs hover:underline">Forgot password?</a>
                </div>
                <div className="flex items-center gap-3 bg-[#1D212A] px-4 py-3 rounded-xl border border-[#25283280] focus-within:border-orange-400 transition-all">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-transparent w-full text-white outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mt-2 bg-gradient-to-br from-orange-500 to-orange-400 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In →"}
              </button>
            </div>

            <p className="text-center text-gray-400 text-sm mt-6">
              Club Coordinator?{" "}
              <Link to="/coordinatorlogin">
                <span className="text-orange-400 hover:underline cursor-pointer">Sign In</span>
              </Link>
            </p>
          </div>

          <p className="text-center text-gray-500 text-xs mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;