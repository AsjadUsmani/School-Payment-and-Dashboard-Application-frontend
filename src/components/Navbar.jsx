// src/components/Navbar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, Logout, Brightness4, Brightness7 } from "@mui/icons-material";
import { useNavigate, NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useColorMode } from "../context/ThemeProvider"; // your theme context

export default function Navbar() {
  const theme = useTheme();
  const colorMode = useColorMode();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    // clear cookies/localstorage if needed
    document.cookie = "token=; Max-Age=0; path=/";
    localStorage.clear();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "By School", path: "/school-transactions" },
    { label: "Status Check", path: "/check-status" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        School Payments
      </Typography>
      <Divider />
      <List>
        {navLinks.map((item) => (
          <ListItem button key={item.path} component={NavLink} to={item.path}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem button onClick={handleLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left: Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, fontWeight: "bold" }}
            >
              School Payment Dashboard
            </Typography>
          </Box>

          {/* Middle: Nav links (desktop only) */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {navLinks.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "white",
                  "&.active": {
                    fontWeight: "bold",
                    borderBottom: "2px solid white",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Right: theme toggle + logout */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { sm: "none" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
