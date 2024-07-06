import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    SelectChangeEvent,
    Button,
    createTheme,
    ThemeProvider,
} from '@mui/material';

interface Time {
    hour: number;
    minute: number;
    amPM: string;
}

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

const defaultTime: Time = { hour: 8, minute: 0, amPM: 'AM' };

const theme = createTheme({
    components: {
        MuiDialog: {
            styleOverrides: {
                paper: {
                    width: '80%', // Larger dialog width
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    minWidth: '150px', // Wider form controls
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    width: '100%',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 20px', // Larger buttons
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    padding: '10px', // More padding in select dropdown
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    minHeight: '48px', // Taller menu items
                },
            },
        },
    },
    typography: {
        fontSize: 16, // Increase base font size
    },
});

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
    const [location, setLocation] = useState<string>('');
    const [time, setTime] = useState<Time>(defaultTime);

    useEffect(() => {
        const storedLocation = localStorage.getItem('userLocation');
        const storedTimeJson = localStorage.getItem('userTime');
        const storedTime = storedTimeJson ? JSON.parse(storedTimeJson) : defaultTime;

        if (storedLocation) {
            setLocation(storedLocation);
        }
        setTime(storedTime);  // Directly use the stored time or default time
    }, []);

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleTimeChange = (part: keyof Time) => (event: SelectChangeEvent<number | string>) => {
        setTime({ ...time, [part]: event.target.value });
    };

    const handleDialogClose = () => {
        onClose();
    };

    const handleSave = () => {
        const currentTime = new Date();
        const selectedTime = new Date();
        selectedTime.setHours(time.hour, time.minute, 0, 0);
    
        const timeDifference = selectedTime.getTime() - currentTime.getTime();
    
        localStorage.setItem('userLocation', location);
        localStorage.setItem('userTime', JSON.stringify(time));  // Ensure this serializes the correct object
    
        onClose();
    };
    
    
    return (
        <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={handleDialogClose}>
                <DialogTitle>Set Location and Time</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="location"
                        label="Location"
                        type="text"
                        fullWidth
                        value={location}
                        onChange={handleLocationChange}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="hour-label">Hour</InputLabel>
                                <Select
                                    labelId="hour-label"
                                    id="hour"
                                    value={time.hour}
                                    onChange={handleTimeChange('hour')}
                                >
                                    {[...Array(12)].map((_, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            {index + 1}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="minute-label">Minute</InputLabel>
                                <Select
                                    labelId="minute-label"
                                    id="minute"
                                    value={time.minute}
                                    onChange={handleTimeChange('minute')}
                                >
                                    {[...Array(12)].map((_, index) => (
                                        <MenuItem key={index} value={index * 5}>
                                            {index * 5}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel id="ampm-label">AM/PM</InputLabel>
                                <Select
                                    labelId="ampm-label"
                                    id="ampm"
                                    value={time.amPM}
                                    onChange={handleTimeChange('amPM')}
                                >
                                    {['AM', 'PM'].map((ampm) => (
                                        <MenuItem key={ampm} value={ampm}>
                                            {ampm}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default SettingsDialog;

