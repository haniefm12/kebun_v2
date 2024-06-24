import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));
const AuthBox = styled(Box)(({ theme }) => ({
  // display: "contents",
  alignItems: "center",
  gap: "5px",
}));

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6">Kebun</Typography>
        <Icons>
          <Tooltip title="Change dark and light mode" arrow>
            <IconButton sx={{ color: "primary.contrastText" }}>
              <DarkModeOutlinedIcon></DarkModeOutlinedIcon>
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage account" arrow>
            <IconButton sx={{ color: "primary.contrastText" }}>
              <UserBox onClick={(e) => setOpen(true)}>
                <Avatar sx={{ width: 30, height: 30 }}></Avatar>
                <AuthBox>
                  <Typography variant="body2">Muhammad Hanif</Typography>
                  <UserBox>
                    <AdminPanelSettingsOutlinedIcon fontSize="small"></AdminPanelSettingsOutlinedIcon>
                    <Typography variant="caption">Admin</Typography>
                  </UserBox>
                </AuthBox>
              </UserBox>
            </IconButton>
          </Tooltip>
        </Icons>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={(e) => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
