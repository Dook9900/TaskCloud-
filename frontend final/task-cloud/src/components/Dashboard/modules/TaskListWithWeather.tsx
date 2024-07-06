import React, { useState, useEffect } from 'react';
import { Task, WeatherResponse } from '../../../constants/dtoTypes';
import WeatherBox from './WeatherBox/WeatherBox';
import WeatherListBox from './WeatherListBox/WeatherListBox';
import { fetchWeather } from '../../../constants/endpoints';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography } from '@mui/material';

interface Props {
    tasks: Task[];
}
interface Props {
    tasks: Task[];
    open: boolean;
    onClose: () => void;
}

const TaskListWithWeatherDialog: React.FC<Props> = ({ tasks, open, onClose }) => {
    const [weather, setWeather] = useState<WeatherResponse | null>(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const weatherData = await fetchWeather();
            setWeather(weatherData);
        };

        fetchWeatherData();
    }, []);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Task List</DialogTitle>
            <DialogContent>
                <List>
                    {tasks.map(task => (
                        <ListItem key={task.taskName}>
                            <ListItemText primary={`Task Name: ${task.taskName}`} />
                            <ListItemText primary={`Task Location: ${task.taskLocation}`} />
                            <ListItemText primary={`Task Due Date: ${task.taskMonth} ${task.taskDate}, ${task.taskHour}:${task.taskMinute} ${task.taskAmPm}`} />
                        </ListItem>
                    ))}
                </List>

                {weather && (
                    <>
                        <Typography variant="h6">Weather</Typography>
                        <WeatherBox weatherData={weather} />
                        <WeatherListBox conditionCode={weather.current.condition.code} currentTemp={weather.current.temp_f} />
                        
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskListWithWeatherDialog;
