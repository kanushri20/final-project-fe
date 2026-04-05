import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Calendar } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 text-sm transition ${
      isActive ? "text-white font-semibold" : "text-gray-400 hover:text-white"
    }`;

  return (
    <nav className="w-full bg-[#0F1218] border-b border-[#252832] sticky top-0 z-50">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Calendar className="text-orange-400" size={26} />
          <span className="text-white font-bold text-xl">EventHub</span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink> */}

          <NavLink to="/upcomingevents" className={navLinkStyle}>
            Events
          </NavLink>
          <NavLink to="/clubs" className={navLinkStyle}>Clubs</NavLink>

          {!user ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-sm font-semibold rounded-lg transition flex items-center gap-2"
            >
              <User size={16} />
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              
              {/* Profile */}
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 bg-[#1C1F26] px-3 py-1.5 rounded-lg hover:bg-[#252932] transition"
              >
                <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-black text-xs font-bold">
                  {user.firstName?.charAt(0)}
                </div>
                <span className="text-sm text-white">
                  {user.firstName}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white cursor-pointer"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="bg-[#12151C] rounded-xl p-4 flex flex-col gap-4 border border-[#252832]">
            
            <NavLink to="/" onClick={() => setMenuOpen(false)} className="text-gray-300">
              Home
            </NavLink>

            <NavLink to="/upcoming-events" onClick={() => setMenuOpen(false)} className="text-gray-300">
              Events
            </NavLink>

            {!user ? (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="bg-orange-500 text-black py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <User size={16} />
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 bg-[#1C1F26] py-2 px-3 rounded-lg text-white"
                >
                  <User size={16} />
                  {user.firstName}
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-400"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

