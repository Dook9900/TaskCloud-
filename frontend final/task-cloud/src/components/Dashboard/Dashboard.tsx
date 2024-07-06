import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  IconButton,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon  } from '@mui/icons-material';
import { Task, emptyTask } from '../../constants/dtoTypes';
import Header from './modules/Header';
import TaskDialog from './modules/TaskDialog';
import { deleteTask, fetchTasks } from '../../constants/endpoints';
import { generateTaskId } from '../../constants/utilityFunctions';
import TaskListWithWeather from './modules/TaskListWithWeather';

const lightTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Dashboard: React.FC = () => {
  const location = useLocation();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [task, setTask] = useState<Task>(emptyTask);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { state } = location || {};
  const username = state ? state.username : 'User';

  const [dynamicDashboardOpen, setDynamicDashboardOpen] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const handleDeleteTask = (indexToRemove: number) => {
    const foundTask = tasks.find((task, index) => index === indexToRemove);
    if (foundTask) {
      const taskId = generateTaskId(foundTask);
      deleteTask(username, taskId.toString().substring(0, 8));
    }

    const updatedTasks = tasks.filter((_, index) => index !== indexToRemove);
    setTasks(updatedTasks);
  };

  const handleEditTask = (indexToEdit: number) => {
    const foundTask = tasks.find((task, index) => index === indexToEdit);
    console.log("Triggered: ", foundTask)
    if (foundTask) setTask(foundTask)
    setTimeout(() => {setDialogOpen(true)}, 500)
  };

  const handleOpenDescription = () => {
    if (tasks.length > 3) {
      setCurrentTasks(tasks.slice(3));
    } else {
      setCurrentTasks(tasks);
    }
    setDynamicDashboardOpen(true);
  };

  const handleCloseDescription = () => {
    setDynamicDashboardOpen(false);
  };

  const handleAddTask = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const taskToString = (task: Task) => {
    const newTask = `⭐ ${task.taskName} - Location: ${task.taskLocation} - Date: ${task.taskMonth}/${task.taskDate} at ${task.taskHour}:${task.taskMinute} ${task.taskAmPm}`;
    return newTask;
  };

  const calculateTimeToTask = (time: any) => {
    const now = new Date();
    const taskDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(time.hour), parseInt(time.minute));

    if (time.amPM === 'PM' && parseInt(time.hour) !== 12) {
        taskDate.setHours(taskDate.getHours() + 12);
    } else if (time.amPM === 'AM' && parseInt(time.hour) === 12) {
        taskDate.setHours(0);  // Handle the midnight case
    }

    const timeToTask = taskDate.getTime() - now.getTime();
    return timeToTask;
  };




  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedTasks = await fetchTasks(username);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchData();
  }, [tasks.length, username]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const defaultTime = {
      hour: 9,
      minute: 0,
      amPM: 'AM'
    };
    const storedTime = JSON.parse(localStorage.getItem('userTime') || JSON.stringify(defaultTime));
    const timeToTask = calculateTimeToTask(storedTime);

    if (timeToTask > 0) {
        setTimeout(() => {
            setDynamicDashboardOpen(true);
            // Set the interval to repeat this every 24 hours
            setInterval(() => {
                setDynamicDashboardOpen(true);
            }, 86400000);
        }, timeToTask);
    }
}, []);


  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Header userName={username} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          padding: '20px',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" align="center" gutterBottom sx={{ pt: '20px'}}>
                  {username ? `Welcome, ${username}!` : 'Welcome!'}
                </Typography>

                <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}> {/* Add styles for scrollable box */}
                  {tasks.length === 0 ? (
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">
                        No current tasks. Click the 'Add Task' button to begin creating a task.
                      </Typography>
                    </Paper>
                  ) : (
                    tasks.map((task, index) => (
                      <Paper
                        sx={{
                          p: 2,
                          mb: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                        }}
                        key={index}
                      >
                        <Typography variant="body1">
                          {taskToString(task).split(' - ').map((line, i) => (
                            <React.Fragment key={i}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </Typography>
                        <IconButton
                          color="primary" // Change color to primary
                          size="small"
                          aria-label="edit" // Change aria-label to 'edit'
                          onClick={() => handleEditTask(index)} // Call handleEditTask with the index
                          sx={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                          }}
                        >
                          <EditIcon /> {/* Use the Edit icon */}
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          aria-label="delete"
                          onClick={() => handleDeleteTask(index)}
                          sx={{
                            position: 'absolute',
                            top: '4px',
                            right: '32px', // Adjust position to make room for the edit button
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Paper>
                    ))
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>

        <IconButton
          color="primary"
          aria-label="add task"
          onClick={handleAddTask}
          sx={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <AddIcon />
          <Typography>Add Task</Typography>
        </IconButton>

        <IconButton
          color="primary"
          aria-label="open upcoming tasks"
          onClick={handleOpenDescription}
          sx={{
            position: 'fixed',
            right: 20,
            bottom: 20,
          }}
        >
          <Typography variant="body2">Open Dynamic Dashboard</Typography>
        </IconButton>

        <TaskDialog
          setTask={setTask}
          dialogOpen={dialogOpen}
          task={task}
          handleDialogClose={handleDialogClose}
          setTasks={setTasks}
          tasks={tasks}
          userName={username}
        />
        <TaskListWithWeather tasks={currentTasks} open={dynamicDashboardOpen} onClose={handleCloseDescription} />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;

