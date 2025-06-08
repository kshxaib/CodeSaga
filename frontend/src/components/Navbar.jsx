import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User, Code, LogOut, Bug, Bookmark } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";
import { useUserStore } from "../store/useUserStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const {user} = useUserStore()

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
    { label: "Store", path: "/store" },
    { label: "Break Zone", path: "/break-zone" },
    { label: "DevLogs", path: "/dev-log" },
    { label: "Contests", path: "/contests" },
  ];

  console.log("Navbar:w32 ",user);

  return (
<div className="navbar relative z-[9999] min-w-screen bg-gray-900/90 border-b border-purple-500/30 text-gray-100 px-4 md:px-8 lg:px-16">
      <div className="flex-1">
        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`font-medium transition-all ${
                  location.pathname.startsWith(path)
                    ? "text-purple-400 font-semibold"
                    : "text-gray-400 hover:text-purple-400 hover:scale-105"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">       
        <div ref={dropdownRef} className="relativ z-[9999]">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="btn btn-ghost btn-circle avatar transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full ring ring-purple-500 ring-offset-gray-900 ring-offset-2 overflow-hidden">
              <img
                src={user?.user?.profile?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
          </button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 bg-gray-800 border translate-x-[-20px] border-purple-500/30 rounded-xl shadow-xl z-50 space-y-2 p-3"
            >
              <div className="text-sm font-semibold text-gray-300 px-2 truncate">
                {user?.user?.profile?.name}
              </div>
              <div className="text-xs text-gray-500 px-2">
                {user?.user?.profile?.email}
              </div>
              <hr className="border-purple-500/30 my-1" />

              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-500/20 hover:text-white transition text-sm text-gray-300"
              >
                <User className="w-4 h-4 text-blue-400" />
                My Profile
              </Link>

              <Link
                to="/my-playlists"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-purple-500/20 hover:text-white transition text-sm text-gray-300"
              >
                <Bookmark className="w-4 h-4 text-purple-400" />
                My Playlists
              </Link>

              {user?.user?.profile?.role === "ADMIN" && (
                <>
                  <Link
                    to="/add-problem"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-500/20 hover:text-white transition text-sm text-gray-300"
                  >
                    <Code className="w-4 h-4 text-blue-400" />
                    Add Problem
                  </Link>
                  <Link
                    to="/reports"
                    onClick={handleLinkClick}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-500/20 hover:text-white transition text-sm text-gray-300"
                  >
                    <Bug className="w-4 h-4 text-indigo-400" />
                    All Reports
                  </Link>
                </>
              )}

              <LogoutButton
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/20 hover:text-white transition text-sm text-gray-300 w-full text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Logout
              </LogoutButton>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
