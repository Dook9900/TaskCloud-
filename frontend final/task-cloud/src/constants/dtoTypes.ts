// User DTO
export type UserDTO = {
    id: number;
    username: string;
    email: string;
    password: string;
}

// Task DTO
export type TaskDTO  = {
    id: string;
    title: string;
    location: string;
    due_date: string;
    user_id: number;
}

export type Task = {
    taskName: string,
    taskLocation: string,
    taskMonth: string,
    taskDate: string,
    taskHour: string,
    taskMinute: string,
    taskAmPm: string
}

export const emptyTask: Task = {
    taskName: '',
    taskLocation: '',
    taskMonth: '',
    taskDate: '',
    taskHour: '',
    taskMinute: '', 
    taskAmPm: ''
}

export interface UserLocationDTO {
    location_id?: number; // Optional for create operations, as it will be assigned by the database
    user_id: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
}

// Define the TaskResponse interface to match the response structure
export interface TaskResponse {
    tasks: {
        id: string;
        title: string;
        location: string;
        due_date: string;
        user_id: number;
    }[];
}

//API DTOs
export interface Location {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
}

export interface Condition {
    text: string;
    icon: string;
    code: number;
}

export interface CurrentWeather {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
}

export interface WeatherResponse {
    location: Location;
    current: CurrentWeather;
}
