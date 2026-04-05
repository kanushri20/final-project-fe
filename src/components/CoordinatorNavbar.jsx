import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Dashboard",  href: "/coordinatordashboard" },
  { label: "Manage Events", href: "/manageevents" },
  { label: "Notify Students", href: "/notifystudent" },
  { label: "Budget", href: "/budgetdocumentation" },
  { label: "Create Poster", href: "/createposter" },
  { label: "Students", href: "/registerdstudents" },
];

function CoordinatorNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("coordinator");
    navigate("/coordinatorlogin");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="w-full bg-[#12151C] border-b border-[#25283280] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <a href="/coordinatordashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-400 shadow-[0_0_12px_rgba(249,121,36,0.3)]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75" />
            </svg>
          </div>
          <span className="text-white font-bold text-xl">EventHub</span>
          <span className="hidden sm:inline text-[10px] text-[#F97924] font-semibold px-2 py-0.5 rounded-full border border-[#F9792430] bg-[#F9792415]">
            COORDINATOR
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm transition font-medium ${
                isActive(link.href)
                  ? "text-[#F97924] bg-[#F97924]/10"
                  : "text-[#737B8C] hover:text-white hover:bg-[#1D212A]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Logout + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#737B8C] hover:text-red-400 hover:bg-red-400/10 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#737B8C] hover:text-white transition"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#25283280] bg-[#12151C] px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm transition font-medium ${
                isActive(link.href)
                  ? "text-[#F97924] bg-[#F97924]/10"
                  : "text-[#737B8C] hover:text-white hover:bg-[#1D212A]"
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition mt-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default CoordinatorNavbar;