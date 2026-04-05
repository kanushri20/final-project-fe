import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0E13] text-white relative overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px_rgba(249,121,36,0.08)_1px,transparent_0)] bg-[size:40px_40px]" />

      {/* Glow Effects */}
      <div className="absolute w-96 h-96 -top-32 -left-32 bg-orange-500 opacity-10 blur-[120px] animate-pulse" />
      <div className="absolute w-96 h-96 bottom-0 right-0 bg-orange-400 opacity-10 blur-[120px] animate-pulse" />

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl flex items-center justify-center font-bold">
            📅
          </div>
          <h1 className="text-xl font-bold">EventHub</h1>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-lg bg-orange-500 hover:scale-105 transition"
        >
          Login
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20 relative z-10">

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Manage Campus Events <br />
          <span className="text-orange-500">Effortlessly</span>
        </h1>

        <p className="text-gray-400 max-w-2xl mb-8 text-lg">
          A centralized platform for students and coordinators of 
          Pimpri Chinchwad College of Engineering & Research (PCCOER) 
          to discover, register, and manage events seamlessly.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 font-semibold hover:scale-105 hover:shadow-lg transition"
        >
          Get Started →
        </button>

      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 px-8 mt-24 relative z-10">

        {[
          {
            title: "Explore Events",
            desc: "Browse upcoming events, workshops, and activities across PCCOER.",
          },
          {
            title: "Easy Registration",
            desc: "Register for events in just one click and track your participation.",
          },
          {
            title: "Manage Events",
            desc: "Coordinators can create and manage events with ease.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#12151C] border border-[#252832] p-6 rounded-2xl hover:-translate-y-2 hover:border-orange-400/40 transition"
          >
            <h3 className="text-lg font-semibold mb-2 text-orange-400">
              {item.title}
            </h3>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="mt-24 px-8 text-center max-w-3xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold mb-4">
          About PCCOER
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Pimpri Chinchwad College of Engineering & Research (PCCOER) is a premier
          institute dedicated to excellence in technical education. This platform
          is designed to streamline campus event management, making participation
          and coordination more efficient and engaging for students and faculty.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-gray-500 text-xs pb-6">
        © 2026 PCCOER EventHub • Built for campus innovation
      </div>
    </div>
  );
};

export default App;
