import React, {useCallback} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { withRouter } from 'react-router';
import firebase from '../firebase';
import GoogleButton from 'react-google-button';
import { Paper } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Personal Map of Life
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
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUp({history}) {
  
    const classes = useStyles();

    const handleSignUp = useCallback(async event => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
              const res = await firebase.auth().createUserWithEmailAndPassword(email.value, password.value);
              console.log(res);
              console.log(res.user);
              if(res&&res.user)
                {
                    console.log("uid",res.user.uid);
                    var item = {}
                    item["name"]="anonym";
                    item["birthyear"]=2000;
                    item["maxYear"]=0;

                    const user_ref = firebase.firestore().collection("Users").doc(res.user.uid);
                    try{
                          user_ref.set(item).then((doc)=>{
                                console.log("user initiated in db",doc);
                           });
                    }catch(err)
                    {
                        console.log("error",err);
                    }
                      
                    await res.user.sendEmailVerification();
                    //await is need to do the upper insertion in db
                    await firebase.auth().signOut();
                    alert("Signup is successful. We also sent you a verification email.");
                }
              //history.push("/signin");
      } catch (error) {
            console.log(error);
            alert(error.message);
            //alert("Signup process is stopped. Please contact our staff for more info.");
      }
    }, [history]);  


    function googleLoginRedirect() {
      // [START auth_google_signin_redirect_result]
      var provider = new firebase.auth.GoogleAuthProvider();
  
      firebase.auth().signInWithRedirect(provider);
  
      firebase.auth()
        .getRedirectResult()
        .then((result) => {
          if (result.credential) {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
    
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            console.log(token);
          }
          // The signed-in user info.
          var user = result.user;
        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          console.log(error);
        });
      // [END auth_google_signin_redirect_result]
    }
   

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      
      <Paper className={classes.paper}>
        <Box p={2} className={classes.box}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
        </Box>
            <Box m={2}>          
                <GoogleButton label="Sign Up with Google Account" fullWidth onClick={googleLoginRedirect} />
            </Box>
            <Typography variant="body1">
                or
            </Typography>
            <Box p={3} className={classes.box}>
                <Typography component="h1" variant="h6">
                  Create A New Account
                </Typography>
                <form className={classes.form} onSubmit={handleSignUp} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        //autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="repeat password"
                        label="Repeat Password"
                        type="password"
                        id="repeat password"
                        //autoComplete="current-password"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign Up
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Link href={'./signin'} variant="body2">
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </form>
            </Box>
        </Paper>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(SignUp);