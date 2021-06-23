import { Button, TextField } from '@material-ui/core';
import React,{useContext,useState,useEffect} from 'react';
import firebase from '../firebase';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import { AuthContext } from "./Auth.js";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function NewUser() {
  
  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser.uid);

  const db_users = firebase.firestore().collection("users");

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState(2000);

    // ADD FUNCTION
    function addUser(newUser) {
      db_users.doc(currentUser.uid)
        //.doc() use if for some reason you want that firestore generates the id
        //.collection()
        .set(newUser).then(
            console.log("new user in db")
        ).catch((err) => {
            console.error(err);
        });
    }

    return(

      <Container component="main" maxWidth="xs">
      
      <CssBaseline />
      
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {loading ? <h1>Loading...</h1> : null}
        <form noValidate>                  
              <TextField className={classes.form} label="Your Name" variant="outlined" required fullWidth value={name} onChange={(e) => setName(e.target.value)}/>
              <TextField className={classes.form} label="Your Birth Year" variant="outlined" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
              <Button   type="submit"  fullWidth variant="contained" color="primary"
            className={classes.submit} onClick={() => addUser({ name, birthYear})}>Submit</Button>
        </form>
      </div>
      
      </Container>

    )

}