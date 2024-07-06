import { SHA1 } from "crypto-js";
import { Task, TaskDTO } from "./dtoTypes";

export function sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
        // Compare months
        const monthComparison = parseInt(a.taskMonth) - parseInt(b.taskMonth);
        if (monthComparison !== 0) {
            return monthComparison;
        }

        // Compare dates
        const dateComparison = parseInt(a.taskDate) - parseInt(b.taskDate);
        if (dateComparison !== 0) {
            return dateComparison;
        }

        // Compare hours
        const hourA = parseInt(a.taskHour) + (a.taskAmPm === "PM" ? 12 : 0);
        const hourB = parseInt(b.taskHour) + (b.taskAmPm === "PM" ? 12 : 0);
        const hourComparison = hourA - hourB;
        if (hourComparison !== 0) {
            return hourComparison;
        }

        // Compare minutes
        const minuteComparison = parseInt(a.taskMinute) - parseInt(b.taskMinute);
        return minuteComparison;
    });
}

export function generateTaskId(task: Task): number {
    const { taskName, taskLocation } = task;
    // Concatenate taskName and taskLocation to form a unique string
    const combinedString = `${taskName}-${taskLocation}`;
    // Generate a SHA-1 hash of the combined string
    const hash = SHA1(combinedString).toString();
    // Convert the hexadecimal hash to an integer
    const integerValue = parseInt(hash.substring(0, 8), 16); 
    // Return the integer value
    return integerValue;
}


export function mapTaskToTaskDTO(task: Task, userId: number): TaskDTO {
    const { taskName, taskLocation, taskMonth, taskDate, taskHour, taskMinute, taskAmPm } = task;
    const due_date = `2024-${taskMonth}-${taskDate} ${taskHour}:${taskMinute}:00 ${taskAmPm}`;

    // Map fields to TaskDTO
    const taskDTO: TaskDTO = {
        id: generateTaskId(task).toString().substring(0, 8), 
        title: taskName,
        location: taskLocation, 
        due_date,
        user_id: userId,
    };

    return taskDTO;
}


export function mapTaskDTOToTask(taskDTO: TaskDTO): Task {
    const { title, location, due_date } = taskDTO;

    // Extract year, month, day, hour, minute, and AM/PM from due_date
    const [dateMonthYear, time, amPm] = due_date.split(' ');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [year, month, day] = dateMonthYear.split('-');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [hours, minutes, seconds] = time.split(':')

    const task: Task = {
        taskName: title,
        taskLocation: location,
        taskMonth: month,
        taskDate: day,
        taskHour: hours,
        taskMinute: minutes,
        taskAmPm: amPm,
    };

    return task;
}