import { Button, TextField } from '@material-ui/core';
import React,{useState,useEffect,Fragment} from 'react';
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
import {Redirect} from 'react-router';


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


export default function Rate() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const ref = firebase.firestore().collection("Rates");

  // ADD FUNCTION
  function addRate(newRate) {
    console.log("rate function started");
    ref.doc()
      //.doc() use if for some reason you want that firestore generates the id
      .set(newRate).then(() => {
        console.log("A new user has been added", "Success");
        //it is not working
        return <Redirect to="./dream" />
      })
      .catch((err) => {
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
        <div>                  
              <TextField className={classes.form} label="Which aspect?" variant="outlined" required fullWidth value={title} onChange={(e) => setTitle(e.target.value)}/>
              <TextField className={classes.form} label="Rate" variant="outlined" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <Button   type="submit"  fullWidth variant="contained" color="primary"
            className={classes.submit} onClick={() => addRate({ title, desc})}>Push</Button>
        </div>
      </div>
    </Container>
  )

}