import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User, Code, LogOut, Bug } from "lucide-react";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();
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
    <div className="navbar bg-base-100 shadow-sm min-w-screen px-4 md:px-8 lg:px-16">
      <div className="flex-1">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-2xl font-bold">
            <img
              alt="Logo"
              src="/leetlab.svg"
              className="h-12 w-12 bg-primary/10 text-primary border-none p-2 rounded-full"
            />
          </Link>
          <div className="hidden md:flex gap-6">
            {navLinks.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`font-medium transition ${
                  location.pathname.startsWith(path)
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary"
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
          className="input input-bordered w-24 md:w-48 text-sm"
        />

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={authUser?.image || "https://placeimg.com/192/192/people"}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-150 space-y-2 p-3">
              <li className="text-sm font-semibold text-gray-700 px-2">
                {authUser?.name}
              </li>
              <hr className="border-gray-200" />

              <li>
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary hover:text-white transition text-sm"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
              </li>

              {authUser?.role === "ADMIN" && (
                <>
                  <li>
                    <Link
                      to="/add-problem"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary hover:text-white transition text-sm"
                    >
                      <Code className="w-4 h-4" />
                      Add Problem
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/reports"
                      onClick={handleLinkClick}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary hover:text-white transition text-sm"
                    >
                      <Bug className="w-4 h-4" />
                      All Reports
                    </Link>
                  </li>
                </>
              )}

              <li>
                <LogoutButton
                  onClick={handleLinkClick}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary hover:text-white transition text-sm w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
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
