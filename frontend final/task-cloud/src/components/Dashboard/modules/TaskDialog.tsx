import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { Task, emptyTask } from '../../../constants/dtoTypes';
import { createTask, editTask } from '../../../constants/endpoints';
import { generateTaskId } from '../../../constants/utilityFunctions';

type TaskDialogProps = {
    setTask: (task: Task) => void;
    dialogOpen: boolean; 
    task: Task;
    handleDialogClose: () => void;
    setTasks: (tasks: Task[]) => void
    tasks: Task[];
    userName: string;
}

const TaskDialog = ({ setTask, dialogOpen, task, handleDialogClose, setTasks, tasks, userName }: TaskDialogProps) => {

  // Local state for input fields
  const [taskName, setTaskName] = useState(task.taskName);
  const [taskLocation, setTaskLocation] = useState(task.taskLocation);
  const [taskMonth, setTaskMonth] = useState(task.taskMonth);
  const [taskDate, setTaskDate] = useState(task.taskDate);
  const [taskHour, setTaskHour] = useState(task.taskHour);
  const [taskMinute, setTaskMinute] = useState(task.taskMinute);
  const [taskAmPm, setTaskAmPm] = useState(task.taskAmPm);

  const handleFinishTask = () => {
    if (!taskName || !taskLocation || !taskMonth || !taskDate || !taskHour || !taskMinute || !taskAmPm) {
      alert('One or more of the boxes above is missing an input! Please fill in the missing boxes.');
      return;
    }

    const newTask: Task = {
      taskName,
      taskLocation,
      taskMonth,
      taskDate,
      taskHour,
      taskMinute,
      taskAmPm
    }
    
    const oldId = generateTaskId(task).toString().substring(0, 8);

    (task === emptyTask) ? createTask(newTask, userName) : editTask(newTask, userName, oldId);

    setTask(newTask);
    setTasks([...tasks, newTask]);

    handleDialogClose();

    setTask(emptyTask);
    resetTasksInputs();
  };

  const resetTasksInputs = () => {
    setTaskName(emptyTask.taskName);
    setTaskLocation(emptyTask.taskLocation)
    setTaskMonth(emptyTask.taskMonth);
    setTaskDate(emptyTask.taskDate)
    setTaskHour(emptyTask.taskHour)
    setTaskMinute(emptyTask.taskMinute)
    setTaskAmPm(emptyTask.taskAmPm)
  }

  useEffect(() => {
    setTaskName(task.taskName);
    setTaskLocation(task.taskLocation);
    setTaskMonth(task.taskMonth);
    setTaskDate(task.taskDate);
    setTaskHour(task.taskHour);
    setTaskMinute(task.taskMinute);
    setTaskAmPm(task.taskAmPm);
  }, [task]); // Run this effect whenever `task` changes

  return (
        <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="md">
            <DialogTitle>Add Task</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="taskName"
                label="Task Name"
                type="text"
                fullWidth
                value={taskName}
                onChange={(e) => {setTaskName(e.target.value)}}
              />
              <TextField
                margin="dense"
                id="taskLocation"
                label="Task Location"
                type="text"
                fullWidth
                value={taskLocation}
                onChange={(e) => setTaskLocation(e.target.value)}
              />
              {/* Task Date Select */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel htmlFor="task-month">Month</InputLabel>
                  <Select
                    value={taskMonth}
                    onChange={(e) => setTaskMonth(e.target.value)}
                    inputProps={{
                      name: 'task-month',
                      id: 'task-month',
                    }}
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                      <MenuItem key={month} value={month}>{month}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel htmlFor="task-date">Date</InputLabel>
                  <Select
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    inputProps={{
                      name: 'task-date',
                      id: 'task-date',
                    }}
                  >
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => (
                      <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {/* Task Time Select */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel htmlFor="task-hour">Hour</InputLabel>
                  <Select
                    value={taskHour}
                    onChange={(e) => setTaskHour(e.target.value)}
                    inputProps={{
                      name: 'task-hour',
                      id: 'task-hour',
                    }}
                  >
                    {Array.from({ length: 12 }, (_, index) => index + 1).map((hour) => (
                      <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel htmlFor="task-minute">Minute</InputLabel>
                  <Select
                    value={taskMinute}
                    onChange={(e) => setTaskMinute(e.target.value)}
                    inputProps={{
                      name: 'task-minute',
                      id: 'task-minute',
                    }}
                  >
                    {Array.from({ length: 60 }, (_, index) => index).map((minute) => (
                      <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="task-am-pm">AM/PM</InputLabel>
                  <Select
                    value={taskAmPm}
                    onChange={(e) => setTaskAmPm(e.target.value)}
                    inputProps={{
                      name: 'task-am-pm',
                      id: 'task-am-pm',
                    }}
                  >
                    <MenuItem value="am">AM</MenuItem>
                    <MenuItem value="pm">PM</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={() => handleFinishTask()}>Finish</Button>
            </DialogActions>
          </Dialog>
  )
}

export default TaskDialog