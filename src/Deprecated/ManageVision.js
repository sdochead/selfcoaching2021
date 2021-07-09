import React,{useState,useEffect,useContext, Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import EuroIcon from '@material-ui/icons/Euro';
import GroupIcon from '@material-ui/icons/Group';
import { AccordionActions, Button, Divider, Fab, FormControlLabel, TextField } from '@material-ui/core';
//tab//

import { withRouter } from 'react-router-dom';

import { storage } from "../firebase";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
          <Box p={2}/>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

//tab//


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  appBar: {
    position: 'relative',
  },
  yearField: {
    left: theme.spacing(2),
    top: theme.spacing(2),
    position: 'relative',
  },
  yearLabel: {
    left: theme.spacing(2),
    top: theme.spacing(2),
    position: 'relative',
  },
  cancelButton: {
    top: 'auto',
    left: theme.spacing(2),
    position: 'absolute',
  },
  addButton: {
    top: 'auto',
    left: 'auto',
    right: theme.spacing(2),
    position: 'absolute',
  },


}));

const ManageVision = props => {

  const { history,location } = props;
  //console.log(location.state);
  const { currentUser } = useContext(AuthContext);


//tab// value keeps the current tab
const [value, setValue] = React.useState(0);

const [loading, setLoading] = React.useState(false);
const [updating,setUpdating] = React.useState(false);

const [visionHealth, setVisionHealth] = React.useState("");
const [visionMoney, setVisionMoney] = React.useState("");
const [visionSocial, setVisionSocial] = React.useState("");
const [visionYear, setVisionYear] = React.useState(2020);

const [healthURL, setHealthURL] = React.useState("");
const [moneyURL, setMoneyURL] = React.useState("");
const [socialURL, setSocialURL] = React.useState("");

const [healthFile, setHealthFile] = React.useState(null);
const [moneyFile, setMoneyFile] = React.useState(null);
const [socialFile, setSocialFile] = React.useState(null);

//if it is to edit
//load the vision

useEffect(() => {
  loadVision();
},[]);

  const loadVision=async()=>{
    setLoading(true);
    if(location.state)
    {
      setUpdating(true);
      console.log(location.state.id);
      setVisionHealth(location.state.health);
      setVisionMoney(location.state.money);
      setVisionSocial(location.state.social);
      setVisionYear(location.state.id);
      await loadURL('health');
      await loadURL('money');
      await loadURL('social');
    }
    setLoading(false);  

  }

  function loadURL(filename)
  {

    storage.ref().child(`/images/${currentUser.uid}/${location.state.id}/${filename}`)
    .getDownloadURL().then(function(url) {
        console.log(url);
        switch(filename){
        case 'health':
          setHealthURL(url);
          console.log("h");
          break;
        case 'money':
          setMoneyURL(url);
          console.log("m");
          break;
        case 'social':
          setSocialURL(url);
          console.log("s");
          break;
        default: console.log('what?');
        }

      }).catch(function(error){console.log(error);});

  }
const handleChange = (event, newValue) => {
  setValue(newValue);
};

//tab//

  const classes = useStyles();

  const db=firebase.firestore().collection("Users").doc(currentUser.uid).collection("visions"); 

  const add = async()=>
  {
    try {
        console.log("add vision started");

        addImage(currentUser,visionYear,'health',healthFile);
        addImage(currentUser,visionYear,'money',moneyFile);
        addImage(currentUser,visionYear,'social',socialFile);

        db.doc(visionYear).set(
            {health:visionHealth,money:visionMoney,social:visionSocial
            });       

        close();

    }catch(err){
        console.log(err);
      }    
  }
  const close = ()=>
  {
        history.push("/myvision");   
  }


  const addImage = (user,year,filename,file) => {
    if(file){
    const uploadTask = storage.ref(`/images/${user.uid}/${year}/${filename}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref(`/images/${user.uid}/${year}`)
        .child(filename)
        .getDownloadURL()
        .then((url) => {
            console.log(url);
        });
    });
  }}

  return (
    <div className={classes.root}>
    {loading ? <h2>Loading...</h2> :
        <>    
        <Typography className={classes.yearLabel}>Which year?</Typography>
        <TextField id="year" type="number" placeholder="year has to be a number" disabled={updating} required
         className={classes.yearField} defaultValue={visionYear} onChange={(e)=>setVisionYear(e.target.value)}/>
        <Box p={1} />        

        <TabPanel value={value} index={0} className={classes.root} bottom="10" >
            <Typography>How would like your health to be?</Typography>
            <TextField id="vision_desc" defaultValue={visionHealth} fullWidth
                multiline rows={3}  variant="outlined" onChange={(e)=>setVisionHealth(e.target.value)}/>
            <Box p={1}/>
            {/* <Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Health</Button> */}

            <Typography>How do you visualize it?</Typography>
            <div>
                <input type="file" onChange={(e)=>setHealthFile(e.target.files[0])} />
                {/* <img src={healthFile ? URL.createObjectURL(healthFile) : "" } alt="" /> */}
                <img id="health-image" src={healthFile ? URL.createObjectURL(healthFile) : 
                ((healthURL==="") ? "https://via.placeholder.com/400x300": healthURL)}
                alt="Uploaded Images"
                height="200"
                width="200"/>           
            </div>

        </TabPanel>
        <TabPanel value={value} index={1} className={classes.root}>
            <Typography>How would be your desired financial situation?</Typography>
            <TextField id="money_desc" defaultValue={visionMoney} fullWidth
                multiline rows={3}  variant="outlined" onChange={(e)=>setVisionMoney(e.target.value)}/>
            <Box p={1} />
            <Typography>How do you visualize it?</Typography>
            <div>
                <input type="file" onChange={(e)=>setMoneyFile(e.target.files[0])} />
                <img id="money-image"src={moneyFile ? URL.createObjectURL(moneyFile) :
                 ((moneyURL==="") ? "https://via.placeholder.com/400x300": moneyURL)}
                alt="Uploaded Images"
                height="200"
                width="200"/>
            </div>
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.root}>
            <Typography>How would you like your social environment (e.g. friends, family, tribe etc) to be?</Typography>
            <TextField id="social_desc" defaultValue={visionSocial} fullWidth
                multiline rows={3}  variant="outlined" onChange={(e)=>setVisionSocial(e.target.value)}/>
            <Box p={1} />
            <Typography>How do you visualize it?</Typography>
            <div>
                <input type="file" onChange={(e)=>setSocialFile(e.target.files[0])} />
                <img src={socialFile ? URL.createObjectURL(socialFile) :
                ((socialURL==="") ? "https://via.placeholder.com/400x300": socialURL)}
                alt="Uploaded Images"
                height="200"
                width="200"/>            </div>
        </TabPanel>
        <AppBar position="absolute" color="secondary" className={classes.appBar}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab icon={<DirectionsRunIcon />} {...a11yProps(0)} />
                <Tab icon={<EuroIcon />} {...a11yProps(1)} />
                <Tab icon={<GroupIcon />} {...a11yProps(2)} />
            </Tabs>
        </AppBar>

        {/* <Button variant="contained" color="primary" className={classes.cancelButton} onClick={close}>Cancel</Button> */}

        <Box p={1} />
        <Button variant="contained" color="primary" className={classes.addButton} onClick={add}>Done</Button>
        <Button variant="contained" color="primary" className={classes.cancelButton} onClick={close}>Cancel</Button>
        <Box p={1} />

    </>
    }
    </div>

  );
}
export default withRouter(ManageVision);