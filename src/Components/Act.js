import { Button, TextField } from '@material-ui/core';
import React,{useState,useEffect} from 'react';
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
import { v4 as uuidv4 } from "uuid";


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


export default function Act() {

  const classes = useStyles();
  const [aspects, setAspects] = useState([]);
  const [selectedAspect, setSelectedAspect] = useState("Money");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const ref = firebase.firestore().collection("LifeAspects");

  const handleChange = (event) => {
    setSelectedAspect(event.target.value);
  };

  // ADD FUNCTION
  function addGoal(newGoal) {
    ref.doc()
      //.doc() use if for some reason you want that firestore generates the id
      //.collection()
      .set(newGoal)
      .catch((err) => {
        console.error(err);
      });
  }

  //REALTIME GET FUNCTION
  function getAspects() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
        console.log(doc.id);
      });
      setAspects(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getAspects();
    console.log(aspects);
    // eslint-disable-next-line
  }, []);

    return(

      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        {loading ? <h1>Loading...</h1> : null}
        <form noValidate>
              <FormControl className={classes.form}>
                      <InputLabel id="select-label" >Life Aspect</InputLabel>
                      <Select labelId="select-label" id="select-aspect" onChange={handleChange} value={selectedAspect}>
                          {aspects.map(item => <MenuItem value={item.title}>{item.title}</MenuItem>)}
                      </Select>
              </FormControl>
                  
              <TextField className={classes.form} label="How to call this goal?" variant="outlined" required fullWidth value={title} onChange={(e) => setTitle(e.target.value)}/>
              <TextField className={classes.form} label="Description" variant="outlined" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <Button   type="submit"  fullWidth variant="contained" color="primary"
            className={classes.submit} onClick={() => addGoal({ title, desc, id: uuidv4() })}>Submit</Button>
        </form>
      </div>
    </Container>

)

}