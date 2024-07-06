import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeatherResponse } from '../../../../constants/dtoTypes';

interface WeatherBoxProps {
    weatherData: WeatherResponse;
}

const WeatherBox: React.FC<WeatherBoxProps> = ({ weatherData }) => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Location: {weatherData.location.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
                Temperature: {weatherData.current.temp_f} °F
            </Typography>
            <Typography variant="body1" gutterBottom>
                Daytime: {weatherData.current.is_day ? 'Yes' : 'No'}
            </Typography>
            <Box display="flex" alignItems="center" component="div"> {/* Add component="div" here */}
                <img src={weatherData.current.condition.icon} alt={weatherData.current.condition.text} style={{ width: 50, marginRight: 10 }} />
                <Typography variant="body1">
                    Condition: {weatherData.current.condition.text}
                </Typography>
            </Box>
        </Box>
    );
};

export default WeatherBox;

