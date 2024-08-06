import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Menu, MenuItem, IconButton, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useUser } from './UserContext';

const ProfileDropdown = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        console.log('Logged out');
        localStorage.removeItem('currentUsername');
        setUser(null);
        handleClose();
        navigate(`/`);
    };

    const handleAddAccount = () => {
        handleClose();
        navigate(`/user`);
    };

    const handleSettings = () => {
      handleClose();
      navigate(`/settings`);
    };

    useEffect(() => {
        console.log("User updated:", user);
    }, [user]);

    return (
        <React.Fragment>
            <Box
                sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
                onClick={handleClick}
            >
                {user ? (
                    <div style={{ marginLeft: '2vw' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '-1vh' }}>{user.username}</div>
                        <div style={{ fontSize: '12px' }}>{user.role}</div>
                    </div>
                ) : (
                    <Typography variant="body1">Guest</Typography>
                )}
                <Tooltip title="Account settings">
                    <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <Avatar
                            src={user?.profilePicture || ""}
                            sx={{ width: 32, height: 32 }}
                        >
                            {!user?.profilePicture ? user?.name?.charAt(0) : null}
                        </Avatar>
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar src={user?.profilePicture || ""} /> {user?.username || "Guest"}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleAddAccount}>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem onClick={handleSettings}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default ProfileDropdown;
