import React,{useState,useEffect,useContext} from 'react';
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
          <Box p={5}/>
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
  addButton: {
    bottom: theme.spacing(2),
    right: theme.spacing(0),
    position: 'absolute',
  },


}));

const NewVision = props => {

const { history } = props;

//tab// value keeps the current tab
const [value, setValue] = React.useState(0);
const [visionHealth, setVisionHealth] = React.useState("");
const [visionMoney, setVisionMoney] = React.useState("");
const [visionSocial, setVisionSocial] = React.useState("");
const [visionYear, setVisionYear] = React.useState(2100);

const [healthFile, setHealthFile] = React.useState(null);
const [moneyFile, setMoneyFile] = React.useState(null);
const [socialFile, setSocialFile] = React.useState(null);

const [healthUrl, setHealthUrl] = React.useState("");
const [moneyUrl, setMoneyUrl] = React.useState("");
const [socialUrl, setSocialUrl] = React.useState("");

const handleChange = (event, newValue) => {
  setValue(newValue);
};

//tab//

  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);
  const db=firebase.firestore().collection("Users").doc(currentUser.uid).collection("visions"); 



  const add = async()=>
  {
    try {
        console.log("add vision started");
        var filename = `/images/${currentUser.uid}/${visionYear}/health/${healthFile.name}`;
        console.log(filename);

        console.log(healthUrl);

        
        // var address = await storage.ref(filename).getDownloadURL().then((url)=>{console.log(url)}).catch((e)=>console.log(e)); 
        var address = await storage.ref(filename).getDownloadURL(); 

        console.log(address);
        setHealthUrl(address);
        console.log(healthUrl);

         if(moneyFile){
            const murl = await addImage(currentUser,visionYear,'money',moneyFile);
            setMoneyUrl(murl);
        }

        if(socialFile){
            const surl = await addImage(currentUser,visionYear,'social',socialFile);
            setSocialUrl(surl);
        } 

        db.doc(visionYear).set(
            {health:visionHealth,money:visionMoney,social:visionSocial,
             healthImage:address,moneyImage:moneyUrl,socialImage:socialUrl
            });

        console.log(healthUrl);

        console.log("addition done");
        
        close();

    }catch(err){
        console.log(err);
      }    
  }
  const close = ()=>
  {
        history.push("/myvision");   
  }


  const addImage = (user,year,subject,file) => {
    if(file){
    const uploadTask = storage.ref(`/images/${user.uid}/${year}/${subject}/${file.name}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref(`/images/${user.uid}/${year}/${subject}`)
        .child(file.name)
        .getDownloadURL()
        .then((url) => {
            console.log(url);
            return(url);
        });
    });
  }}


const addHealthImage = (user,year,subject,file) => {
    setHealthFile(file);
            if(file){
                storage.ref(`/images/${user.uid}/${year}/${subject}/${file.name}`).put(file);
            }}

  return (
    <div className={classes.root}>
        <Typography className={classes.yearLabel}>Which year?</Typography>
        <TextField id="year" required className={classes.yearField} defaultValue="20XX" onChange={(e)=>setVisionYear(e.target.value)}/>
        <Box p={1} />        

        <TabPanel value={value} index={0} className={classes.root} bottom="10" >
            <Typography>How would like your health to be?</Typography>
            <TextField id="vision_desc" defaultValue={visionHealth} fullWidth
                multiline rows={3}  variant="outlined" onChange={(e)=>setVisionHealth(e.target.value)}/>
            <Box p={1}/>
            {/* <Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Health</Button> */}

            <Typography>How do you visualize it?</Typography>
            <div>
                <input type="file" onChange={(e)=>addHealthImage(currentUser,visionYear,"health",e.target.files[0])} />
                {/* <input type="file" onChange={(e)=>setHealthFile(e.target.files[0])} /> */}
                <img src={healthFile ? URL.createObjectURL(healthFile) : "" } alt="" />
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
                <img src={moneyFile ? URL.createObjectURL(moneyFile) : "" } alt="" />
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
                <img src={socialFile ? URL.createObjectURL(socialFile) : "" } alt="" />
            </div>
        </TabPanel>
        <AppBar position="absolute" color="secondary" className={classes.appBar}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                <Tab icon={<DirectionsRunIcon />} {...a11yProps(0)} />
                <Tab icon={<EuroIcon />} {...a11yProps(1)} />
                <Tab icon={<GroupIcon />} {...a11yProps(2)} />
            </Tabs>
        </AppBar>

        {/* <Button variant="contained" color="primary" className={classes.cancelButton} onClick={close}>Cancel</Button> */}
        <Button variant="contained" color="primary" className={classes.addButton} onClick={add}>Add</Button>

    </div>

  );
}
export default withRouter(NewVision);