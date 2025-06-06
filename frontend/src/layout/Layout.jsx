import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname.startsWith("/problems") && !location.pathname.startsWith("/contests") &&
        !location.pathname.startsWith("/profile") && <Navbar />}
      <Outlet />
    </div>
  );
};

export default Layout;
