import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User, Code, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="navbar bg-base-100 shadow-sm min-w-screen px-4 md:px-8 lg:px-16">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-10 cursor-pointer">
          <img
            alt="Logo"
            src="/leetlab.svg"
            className="h-18  w-18 bg-primary/20 text-primary border-none px-2 py-2 rounded-full"
          />
          <div className="hidden md:flex gap-6">
            <Link to="/home" className="font-medium hover:text-primary">
              Home
            </Link>
            <Link to="/problems" className="font-medium hover:text-primary">
              Problems
            </Link>
            <Link to="/contest" className="font-medium hover:text-primary">
              Contest
            </Link>
            <Link to="/store" className="font-medium hover:text-primary">
              Store
            </Link>
          </div>
        </Link>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search user"
          className="input input-bordered w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                src={authUser?.image || "https://placeimg.com/192/192/people"}
                alt="User Avatar"
                className="object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
          >
            <li>
              <p className="text-base font-semibold">{authUser?.name}</p>
              <hr className="border-gray-200/10" />
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:bg-primary hover:text-white text-base font-semibold"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
            </li>
            {authUser?.role === "ADMIN" && (
              <li>
                <Link
                  to="/add-problem"
                  className="hover:bg-primary hover:text-white text-base font-semibold"
                >
                  <Code className="w-4 h-4 mr-1" />
                  Add Problem
                </Link>
              </li>
            )}
            <li>
              <LogoutButton className="hover:bg-primary hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;