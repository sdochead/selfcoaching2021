import React, {useCallback, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DoneIcon from '@material-ui/icons/Done';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router';
import firebase from '../firebase';
import { green } from '@material-ui/core/colors';
import GoogleButton from 'react-google-button';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  success: {
    margin: theme.spacing(1),
    backgroundColor: green
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function ForgotPassword({history}) {
  
    const classes = useStyles();
    const [email,setEmail]=useState("Enter your email");
    const [emailSent,setEmailSent]=useState(false);
    const [error,setError]=useState(false);
    const [emailStatus,setEmailStatus]=useState("");

    function emailChange(event){
        setEmail(event.target.value);
        console.log(event.target.value);
    }

    function resetClick(){

        console.log(email);

        firebase.auth().sendPasswordResetEmail(email).then(() => {
            setEmailSent(true);
            console.log("we sent you an email.");
        }).catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode,errorMessage);
            setEmailStatus(errorMessage);
            setError(true);
        });
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={emailSent ? classes.success : classes.avatar}>
          {emailSent ? <DoneIcon color="white"/> : <LockOutlinedIcon />}
        </Avatar>
        {emailSent===false
            ?
            <>
                <Box m={1}>
                    <Typography component="h1" variant="h5">
                        Password Forgotten?
                    </Typography>
                </Box>
                <Grid m={1} container spacing={2}>
                    <Grid item xs={12}>
                    <TextField
                        error={error}
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        type="email"
                        autoComplete="email"
                        onChange={emailChange}
                        helperText={emailStatus}
                    />
                    </Grid>           
                </Grid>
                <Box m={1}>
                    <Button align onClick={resetClick} variant="contained" color="primary">
                        Rest Password
                    </Button>
                </Box>
            </>
            :
            <Box>
                <Typography align="center" component="h1" variant="h5">
                    An email has been sent to you. Please check your inbox. 
                </Typography>

                <Box p={5}>
                    <Link align="center" underline="always" href="./signin">
                        <Typography align="center" component="h1" variant="h5">
                            Go Back to Sign In Page
                        </Typography>
                    </Link>
                </Box>
            </Box>     
        }
        </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(ForgotPassword);