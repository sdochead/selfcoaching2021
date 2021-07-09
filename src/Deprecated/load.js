import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


const classes = useStyles();
const [aspects,setAspects] = useState([]);


function fetchLifeAspects(){

  if(!aspects.keys.length){
      const db = firebase.firestore();
      const items = [];
      db.collection("LifeAspects").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          items.push(doc.id);
//              console.log(`${doc.id} => ${doc.data()}`);
        });
    }).catch(function(error) {
      console.error("Error: ", error);
    });

      setAspects(items);

   }
}

fetchLifeAspects();
console.log("state: ", aspects);


export default function NativeSelects() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    aspect: 'Health',
  });

  const handleChange = (event) => {
    const aspect = event.target.name;
    setState({
      ...state,
      [aspect]: event.target.value,
    });
  };

  return (

    <div className="App">

    <Container component="main" maxWidth="xs">

  <form className={classes.form} noValidate>

{/*        <FormControl className={classes.formControl}>
    <InputLabel id="demo-simple-select-label">Life Aspect</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      onChange={changeHandler}
    >
    {aspects.map(item => <option value={item}>{item}</option>)}
    </Select>
  </FormControl> */}

      <TextField variant="outlined" name = "goalName" margin="normal" required
       fullWidth id="GoalTitle" label="Goal Title"/>
      <TextField variant="outlined" name = "goalDescription" margin="normal" required fullWidth
        label="Goal Description" id="GoalDescription"/>
{/*         <Button type="submit" onClick="add" variant="contained"
        color="primary" className={classes.submit}>
        ADD
      </Button>  */}

      </form>
  </Container>

  </div>
  );
}