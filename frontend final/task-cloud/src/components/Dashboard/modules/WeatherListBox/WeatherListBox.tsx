import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { weatherItems } from '../../../../constants/weatherItems';

interface WeatherListBoxProps {
    conditionCode: number;
    currentTemp: number;
}

const WeatherListBox: React.FC<WeatherListBoxProps> = ({ conditionCode, currentTemp }) => {
    const additionalItems: string[] = ["Water Bottle", "Snacks", "Charger"]; 
    
    const itemsToRender: string[] = [
        ...(weatherItems[conditionCode.toString()] || []),
        ...additionalItems,
    ];

    const checkTempRange = (temperature: number, rangeKey: string): boolean => {
        const temperatureRanges: { [key: string]: { min: number; max: number } } = {
            "lightjacket": { min: 56, max: 65 },
            "jacket": { min: 40, max: 55 },
            "wintercoat": { min: -100, max: 39 } 
        };
    
        const range = temperatureRanges[rangeKey];
        if (!range) {
            console.error(`Temperature range for '${rangeKey}' not found.`);
            return false;
        }
        return temperature >= range.min && temperature <= range.max;
    };
    
    if (checkTempRange(currentTemp, "lightjacket")) {
        itemsToRender.push("Light Jacket");
    } else if (checkTempRange(currentTemp, "jacket")) {
        itemsToRender.push("Jacket");
    } else if (checkTempRange(currentTemp, "wintercoat")){
        itemsToRender.push("Winter Coat");
    }

    const [checkedItems, setCheckedItems] = React.useState<{ [key: string]: boolean }>(
        itemsToRender.reduce((acc, item) => ({ ...acc, [item]: false }), {})
    );

    const handleCheckboxChange = (itemName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckedItems({ ...checkedItems, [itemName]: event.target.checked });
    };

    return (
        <Box>
            {itemsToRender.map((item, index) => (
                <FormControlLabel
                    key={index}
                    control={
                        <Checkbox
                            checked={checkedItems[item]}
                            onChange={handleCheckboxChange(item)}
                            color="primary"
                        />
                    }
                    label={item}
                />
            ))}
        </Box>
    );
};

export default WeatherListBox;
