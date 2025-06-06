import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname.startsWith("/problems")  &&
        !location.pathname.startsWith("/profile") && <Navbar />}
        {(location.pathname.startsWith("/home") || location.pathname.startsWith("/my-playlists") || location.pathname.startsWith("/store")
        || location.pathname.startsWith("/break-zone") || location.pathname.startsWith("/dev-log") || location.pathname.endsWith("/contests")
      ) && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Layout;
