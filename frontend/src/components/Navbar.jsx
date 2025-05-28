import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User, Code, LogOut, Bug, Bookmark } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useUserStore } from "../store/useUserStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { user } = useUserStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => setDropdownOpen(false);

  const navLinks = [
    { label: "Home", path: "/home" },
    { label: "Problems", path: "/problems" },
    { label: "Contest", path: "/contest" },
    { label: "Store", path: "/store" },
  ];

  return (
    <div className="navbar min-w-screen bg-gray-900/90 border-b border-purple-500/30 text-gray-100 px-4 md:px-8 lg:px-16 shadow-md">
      <div className="flex-1">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold">
            <img
              alt="Logo"
              src="/leetlab.svg"
              className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full border border-purple-500/30"
            />
          </Link>
          <div className="hidden md:flex gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`font-medium transition-all ${
                  location.pathname.startsWith(path)
                    ? "text-purple-400 font-semibold"
                    : "text-gray-400 hover:text-purple-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <input
          type="text"
          placeholder="Search user"
          className="input bg-gray-800 border border-purple-500/30 placeholder-gray-500 text-gray-100 w-24 md:w-48 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>🔥 Streak:</span>
          <span className="px-2 py-1 font-medium text-purple-400 bg-purple-500/10 rounded-md border border-purple-400/20 shadow-sm">
            {authUser?.currentStreak || 0} days
          </span>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 h-10 rounded-full ring ring-purple-500 ring-offset-gray-900 ring-offset-2 overflow-hidden">
              <img
                src={authUser?.image || user?.image}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-gray-800 border border-purple-500/30 rounded-xl shadow-xl z-50 space-y-2 p-3">
              <li className="text-sm font-semibold text-gray-300 px-2">
                {authUser?.name}
              </li>
              <hr className="border-purple-500/30" />

              <li>
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-500/20 hover:text-white transition text-sm text-gray-300"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/my-playlists"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-500/20 hover:text-white transition text-sm text-gray-300"
                >
                  <Bookmark className="w-4 h-4 text-purple-400" />
                  My Playlists
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <>
                  <li>
                    <Link
                      to="/add-problem"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/20 hover:text-white transition text-sm text-gray-300"
                    >
                      <Code className="w-4 h-4 text-blue-400" />
                      Add Problem
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/reports"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-500/20 hover:text-white transition text-sm text-gray-300"
                    >
                      <Bug className="w-4 h-4 text-indigo-400" />
                      All Reports
                    </Link>
                  </li>
                </>
              )}

              <li>
                <LogoutButton
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/20 hover:text-white transition text-sm text-gray-300 w-full text-left"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Logout
                </LogoutButton>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;