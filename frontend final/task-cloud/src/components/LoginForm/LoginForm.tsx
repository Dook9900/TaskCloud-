import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function SignIn() {
 const navigate = useNavigate();
 const [error, setError] = React.useState(false);
 const [missingInputError, setMissingInputError] = React.useState(false);

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
   event.preventDefault();
   const data = new FormData(event.currentTarget);
   const username = data.get('username');
   const password = data.get('password');

   if (!username || !password) {
     setMissingInputError(true);
     setError(false);
   } else{
    localStorage.setItem('username', username as string);
    localStorage.setItem('password', password as string);

    navigate("/dashboard", {state:{username: username}});
   }
  //else if (username === 'correct username' && password === 'correct password') {
  //    navigate("/dashboard", { state: { username: username } });
  //  } else {
  //    setError(true);
  //    setMissingInputError(false);
  //  }
 };

 const handleSignUpClick = () => {
  navigate('/signup');
 }

 const defaultTheme = createTheme();

 return (
   <ThemeProvider theme={defaultTheme}>
     <Container component="main" maxWidth="xs">
       <CssBaseline />
       <Box
         sx={{
           marginTop: 8,
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
         }}
       >
         <Typography component="h1" variant="h4" align="center">
           Stay Organized With<br />Task Cloud
         </Typography>
         <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
           <LockOutlinedIcon />
         </Avatar>
         <Typography component="h1" variant="h5" align="center">
           Sign in
         </Typography>
         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
           <TextField
             margin="normal"
             required
             fullWidth
             id="username"
             label="Username"
             name="username"
             autoComplete="username"
             autoFocus
           />
           <TextField
             margin="normal"
             required
             fullWidth
             name="password"
             label="Password"
             type="password"
             id="password"
             autoComplete="current-password"
           />

           {(error || missingInputError) && (
             <Typography variant="body2" color="error" align="center">
               {missingInputError
                 ? "Missing username or password input. Please fill in the missing area(s)."
                 : "Invalid username or password. Please try again with the correct username and password."}
             </Typography>
           )}

           <FormControlLabel
             control={<Checkbox value="remember" color="primary" />}
             label="Remember me"
           />
           <Button
             type="submit"
             fullWidth
             variant="contained"
             sx={{ mt: 3, mb: 2 }}
           >
             Sign In
           </Button>
           <Grid container>
             <Grid item xs>
               <Link href="#" variant="body2">
                 Forgot password?
               </Link>
             </Grid>
             <Grid item>
               <Link href="#" variant="body2" onClick={handleSignUpClick}>
                 {"Don't have an account? Sign Up"}
               </Link>
             </Grid>
           </Grid>
         </Box>
       </Box>
     </Container>
   </ThemeProvider>
 );
}
export default SignIn;
