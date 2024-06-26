import React, { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
import Navbar from "./Layout/Navbar";
import Sidebar from "./Layout/Sidebar";

// import { useAuthContext } from "../../hooks/useAuthContext";
//import { useGetUserQuery } from "/api";

const Layout = ({ setMode, mode }) => {
  const location = useLocation();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hideNavbarAndSidebar, setHideNavbarAndSidebar] = useState(false);
  // const userId = useSelector((state) => state.global.userId);
  // const { data } = useGetUserQuery(userId);
  useEffect(() => {
    if (location.pathname === "/login") {
      setHideNavbarAndSidebar(true);
    } else {
      setHideNavbarAndSidebar(false);
    }
  }, [location]);
  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {!hideNavbarAndSidebar && (
        <Sidebar
          // user={data || {}}
          isNonMobile={isNonMobile}
          drawerWidth="250px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}
      <Box flexGrow={1}>
        {!hideNavbarAndSidebar && (
          <Navbar
            setMode={setMode} // Pass setMode prop to Navbar
            mode={mode}
            // user={data || {}}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
