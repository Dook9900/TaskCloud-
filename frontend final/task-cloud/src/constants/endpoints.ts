import axios from "axios";
import { Task, TaskResponse, UserLocationDTO, WeatherResponse } from "./dtoTypes";
import { mapTaskDTOToTask, mapTaskToTaskDTO } from "./utilityFunctions";


// Function to make API call
export async function createTask(task: Task, username: string): Promise<void> {
    console.log('triggered')
    try {
        const taskDTO = mapTaskToTaskDTO(task, 1);
        const finalObject = {
            username: username,
            task: {...taskDTO},
        }
        const endpoint = `http://localhost:8080/tasks?username=${username}`;
        await axios.post(endpoint, finalObject);
        console.log('Task created successfully!');
    } catch (error) {
        console.error('Error creating task:', error);
        // Handle error as needed
    }
}

export async function fetchTasks(username: string): Promise<Task[]> {
    try {
        const endpoint = `http://localhost:8080/tasks?username=${username}`;
        const response = await axios.get<TaskResponse>(endpoint);
        
        // Extract tasks array from response
        const tasksResponse = response.data.tasks;

        // Map each task in the response to a Task object
        const tasks: Task[] = tasksResponse.map(task => {
            return mapTaskDTOToTask(task);
        });

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        // Handle error as needed
        return []; // Return empty array in case of error
    }
}

export async function fetchUserLocationByUsername(username: string): Promise<UserLocationDTO> {
    try {
        // Placeholder endpoint URL with query parameter
        const endpoint = `http://placeholder-api.com/user_locations?username=${username}`;

        // Making GET request to the endpoint
        const response = await axios.get<UserLocationDTO>(endpoint);

        // Extracting data from the response
        const userLocations: UserLocationDTO = response.data;

        return userLocations;
    } catch (error) {
        console.error('Error fetching user locations:', error);
        throw error; // Re-throw the error to handle it in the component
    }
}

export async function deleteTask(username: string, taskId: string): Promise<void> {
    try {
        const endpoint = `http://localhost:8080/tasks?username=${username}&taskId=${taskId}`;
        await axios.delete(endpoint);
        console.log('Task deleted successfully!');
    } catch (error) {
        console.error('Error deleting task:', error);
        // Handle error as needed
    }
}


export async function fetchWeather(): Promise<WeatherResponse | null> {
    try {
        // Get user location from local storage
        let storedLocation = localStorage.getItem('userLocation')?.toLocaleLowerCase();

        if (!storedLocation) {
            storedLocation = 'baton rouge'
        }

        // Construct API endpoint with user location
        const endpoint = `http://api.weatherapi.com/v1/current.json?key=fa0fc68a072645d8895163113242304&q=${storedLocation}&aqi=no`;

        // Make API call to fetch weather data
        const response = await axios.get<WeatherResponse>(endpoint);

        return response.data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

export async function editTask(task: Task, username: string, oldTaskId: string): Promise<void> {
    try {
        const taskDTO = mapTaskToTaskDTO(task, 1); // Assuming 1 is the user ID
        const finalObject = {
            username: username,
            task: { ...taskDTO },
        };
        const endpoint = `http://localhost:8080/tasks?oldTaskId=${oldTaskId}`;
        await axios.put(endpoint, finalObject);
        console.log('Task edited successfully!');
    } catch (error) {
        console.error('Error editing task:', error);
        // Handle error as needed
    }
}