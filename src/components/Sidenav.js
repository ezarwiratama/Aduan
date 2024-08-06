import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./small-components/ProfileDropdown";
import SearchAppBar from "./small-components/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "./styling/Sidenav.css";
import logo from "../img/Aduan__1_-removebg-preview.png";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Toolbar, Typography } from "@mui/material";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "white",
  color: "black",
  boxShadow: "none",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  color: "#fff",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      background: "linear-gradient(120deg, #0062ff, #da61ff)",
      color: "#fff",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      background: "linear-gradient(120deg, #0062ff, #da61ff)",
      color: "#fff",
    },
  }),
}));

function Sidenav() {
  const theme = useTheme();
  const [open, setOpen] = useState(true); // Drawer default terbuka
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { id: 1, text: "Dashboard", icon: <DashboardIcon />, link: "/dashboard" },
    {
      id: 2,
      text: "Aduan Masuk",
      icon: <MailIcon />,
      link: "/pending-messages",
    },
    {
      id: 3,
      text: "Aduan Diproses",
      icon: <HourglassEmptyIcon />,
      link: "/processing-messages",
    },
    {
      id: 4,
      text: "Aduan Selesai",
      icon: <MarkEmailReadIcon />,
      link: "/done-messages",
    },
    {
      id: 5,
      text: "Tambah Kontak",
      icon: <PersonAddIcon />,
      link: "/add-contact",
    },
    {
      id: 6,
      text: "Users Management",
      icon: <PeopleOutlineIcon />,
      link: "/user",
    },
    { id: 7, text: "Settings", icon: <SettingsIcon />, link: "/settings" },
  ];

  const getAppBarTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/message-detail/")) {
      return "Detail Aduan";
    }

    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/pending-messages":
        return "Aduan Masuk";
      case "/processing-messages":
        return "Aduan Diproses";
      case "/done-messages":
        return "Aduan Selesai";
      case "/add-contact":
        return "Tambah Kontak";
      case "/user":
        return "Users Management";
      case "/settings":
        return "Settings";
      default:
        return "Aduan";
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: {
                xs: "none",
                sm: "block",
                fontWeight: "600",
                color: "#262A41",
              },
            }}
          >
            {getAppBarTitle()}
          </Typography>
          <div style={{display:'flex'}}>
            {(currentPath === "/pending-messages" || currentPath === "/processing-messages") 
            && <SearchAppBar />}
            {/* <div style={{ marginLeft: "2vh" }}><NotificationsIcon /></div>
            <div style={{ marginLeft: "1vh" }}><SettingsIcon /></div> */}
            <ProfileDropdown />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon sx={{ color: "white" }} />
            ) : (
              <ChevronLeftIcon sx={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        {open && (
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: "13vw",
              margin: "-3vh auto",
              marginTop: "-13vh",
            }}
          />
        )}
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={item.id}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => navigate(item.link)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    location.pathname === item.link
                      ? "rgba(255, 255, 255, 0.4)"
                      : "inherit", // Highlight active page
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0, color: "white" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

export default Sidenav;
