export interface WeatherItems {
    [key: string]: string[];
}

export const weatherItems: WeatherItems = {
    "1000": ["Sunglasses", "Sunscreen", "Hat"], // sunny
    "1003": ["Sunglasses"], // partly cloudy 
    "1006": ["Closed shoes", "Book"], // cloudy 
    "1009": ["Umbrella"], // overcast 
    "1030": ["Umbrella", "Book"], // mist
    "1063": ["Umbrella", "Book"], // patchy rain
    "1066": ["Snow boots",  "Gloves", "Hot chocolate"], // patchy snow possible
    "1069": [ "Gloves", "Hot chocolate"], // patchy sleet possible
    "1072": ["Umbrella", "Rain boots"], // patchy freezing drizzle possible
    "1087": ["Umbrella", "Rain boots"], // thundery outbreaks possible
    "1114": ["Gloves", "Hot chocolate"], // blowing snow 
    "1117": ["Gloves", "Hot chocolate"], // blizzard
    "1135": [], // fog
    "1147": [], // freezing fog
    "1150": ["Umbrella", "Rain boots"], // patchy light drizzle
    "1153": ["Umbrella", "Rain boots"], // light drizzle 
    "1168": ["Umbrella", "Rain boots"], // freezing drizzle 
    "1171": ["Umbrella", "Rain boots"], // heavy freezing drizzle 
    "1180": ["Umbrella", "Rain boots"], // patchy light rain
    "1183": ["Umbrella", "Rain boots"],  // light rain
    "1186": ["Umbrella", "Rain boots"], // moderate rain at times
    "1189": ["Umbrella", "Rain boots"], // moderate rain
    "1192": ["Umbrella", "Rain boots"], // heavy rain at times
    "1195": ["Umbrella", "Rain boots"], // heavy rain
    "1198": ["Umbrella", "Rain boots"], // light freezing rain
    "1201": ["Umbrella", "Rain boots"], // moderate or heavy freezing rain
    "1204": ["Umbrella", "Rain boots"], // light sleet
    "1207": ["Umbrella", "Rain boots"], // moderate or heavy sleet 
    "1210": ["Gloves", "Hot chocolate"], // patchy light snow
    "1213": ["Gloves", "Hot chocolate"], // light snow 
    "1216": ["Gloves", "Hot chocolate"], // patchy moderate snow
    "1219": ["Gloves", "Hot chocolate"], // moderate snow
    "1222": ["Gloves", "Hot chocolate"], // patchy heavy snow
    "1225": ["Gloves", "Hot chocolate"], /// heavy snow
    "1237": ["Gloves"], // ice pellets
    "1240": ["Umbrella", "Rain boots"], // light rain shower
    "1243": ["Umbrella", "Rain boots"], // moderate or heavy rain shower
    "1246": ["Umbrella", "Rain boots"], // torrential rain shower
    "1249": ["Umbrella", "Rain boots"], // light sleet showers
    "1252": ["Umbrella", "Rain boots"], // moderate or heavy sleet showers
    "1255": ["Snow boots",  "Gloves", "Hot chocolate"], // light snow showers
    "1258": ["Snow boots",  "Gloves", "Hot chocolate"], // moderate or heavy snow showers
    "1261": ["Snow boots",  "Gloves", "Hot chocolate"], // light showers of ice pellets
    "1264": ["Snow boots",  "Gloves", "Hot chocolate"], // moderate or heavy showers of ice pellets
    "1273": ["Umbrella", "Rain boots", "Book"], // patchy light rain with thunder
    "1276": ["Umbrella", "Rain boots", "Book"], // moderate or heavy rain with thunder
    "1279": ["Snow boots",  "Gloves", "Hot chocolate"], // patchy light snow with thunder
    "1282": ["Snow boots",  "Gloves", "Hot chocolate"] // moderate or heavy snow with thunder 
};
