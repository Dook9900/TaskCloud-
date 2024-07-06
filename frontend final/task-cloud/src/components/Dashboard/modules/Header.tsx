import { Avatar, Badge, IconButton, Toolbar, Typography, Popover, Box, Switch } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import SettingsDialog from './SettingsDialog/SettingsDialog';
import { Brightness4 as Brightness4Icon }  from '@mui/icons-material';

type HeaderProps = {
    userName: string;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const Header = ({ userName, darkMode, toggleDarkMode }: HeaderProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

    const handleBadgeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClick = () => {
        setSettingsOpen(true);
        handleClose();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <MuiAppBar position="absolute">
                <Toolbar sx={{ pr: '24px' }}>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Task List
                    </Typography>
                    <IconButton color="inherit" onClick={handleBadgeClick}>
                        <Badge badgeContent={4} color="secondary">
                            <Avatar>{userName?.slice(0, 2)}</Avatar>
                        </Badge>
                    </IconButton>
                    
                </Toolbar>
            </MuiAppBar>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <IconButton onClick={handleSettingsClick} sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
                    <SettingsIcon />
                    <Typography variant="body1" textAlign='center' width='100%'>Settings</Typography>
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <IconButton onClick={toggleDarkMode} aria-label="toggle dark mode" color="inherit">
                            <Brightness4Icon />
                        </IconButton>
                        <Typography variant="body1">Dark Mode</Typography>
                        <Switch checked={darkMode} onChange={toggleDarkMode} />
                </Box>
            </Popover>
            <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)}/>
        </>
    );
}

export default Header;