import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase,{storage} from '../firebase';
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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { withRouter } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import PhotoIcon from '@material-ui/icons/Photo';

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
          <Box p={1}/>
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
    top: 'auto',
    bottom: 0,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  add: {
    position:'absolute',
    right: theme.spacing(2),
    top: 'auto',
  },
  save: {
    position:'absolute',
    right: theme.spacing(10),
    top: 'auto',
  },
  deleteAccordion: {
    position: 'absolute',
    right: theme.spacing(10),
  },
  editAccordion: {
    position: 'absolute',
    right: theme.spacing(15),
  },
  disabledText:{
      opacity:1.0
  }
}));

const LifeAccordionTab = props => {


const { history } = props;


//tab// value keeps the current tab
const [value, setValue] = React.useState(0);

const handleChange = (event, newValue) => {
  setValue(newValue);
};

//tab//

  const classes = useStyles();

  const [visions,setVisions]=useState([]);
  const [loading, setLoading] = useState(false);


  const { currentUser } = useContext(AuthContext);
  const db=firebase.firestore().collection("Users").doc(currentUser.uid).collection("visions");

//  const ref=firebase.firestore().collection("Users");

  //console.log(currentUser.uid);

/*   const fetchVisionsOnce = () => {
    return db.get()
    .then(snap => {
        snap.docs.map(doc => {
            console.log(doc.data())
            return {
               ...doc.data(),
               id: doc.id,
               ref: doc.ref
            };
        })
    });
}

useEffect(() => {
  (async () => {
      const newVisions = await fetchVisionsOnce();
      console.log("nv",newVisions);
      setVisions(newVisions);
  })();
}, []) */


 useEffect(() => {
  fetchVisions();
},[]); 

 const fetchVisions=async()=>{
    setLoading(true);
    try {
          console.log("fetch vision started");
          const data=await db.get();
//          console.log(data);

          const items = [];
          data.docs.forEach(item=>{
              items.push({id:item.id,...item.data()});
            });
            setVisions(items);
            setLoading(false);
//          console.log(item);
        }catch(err){
          console.log(err);
        }
  } 

  const updateVisions=async()=>{
    try {
          console.log("update visions started");
          visions.forEach(item=>{
            db.doc(item.id).set(item);
          }
          );
          console.log("update done");
    
        }catch(err){
          console.log(err);
        }
  }

  const removeFromDB=(vision)=>{
    db.doc(vision.id).delete().then(() => {
      console.log(vision,"Document successfully deleted!");
      fetchVisions();
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
  }

  function loadURL(year,filename)
  {

    var output="nothing";

    storage.ref().child(`/images/${currentUser.uid}/${year}/${filename}`)
      .getDownloadURL().then(function(url) {
      console.log(url);
      output = url;
    }).catch(function(error){console.log(error)})
    console.log(output);
    return output;
  }

  const createNewVision = ()=>
  {
    history.push("/newVision");
  }

  const editVision=(vision)=>{
    history.push("/newVision",vision);
  }

  const showVisionBoard=()=>{
    history.push("/visionBoard");
  }

  return (
    <div className={classes.root}>

    {loading ? <h2>Loading...</h2> :

    visions.map((vision,index)=>(

                 <Accordion className={classes.root}>
                  {console.log(vision,index)} 
                   <AccordionSummary className={classes.root} expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>Vision of {vision.id}</Typography>
                      <FormControlLabel 
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<EditIcon color="primary"
                            className={classes.editAccordion}
                            onClick={()=>editVision(vision)}  
                          />}
                      />
                      <FormControlLabel 
                          onClick={(event) => event.stopPropagation()}
                          onFocus={(event) => event.stopPropagation()}
                          control={<DeleteIcon 
                            id={index} color="secondary"
                            className={classes.deleteAccordion}
                            onClick={()=>removeFromDB(vision)}  
                          />}
                      />
                  </AccordionSummary>
                   <AccordionDetails className={classes.root}>
                          <AppBar position="absolute" color="secondary" className={classes.appBar}>
                            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                              <Tab icon={<DirectionsRunIcon />} {...a11yProps(0)} />
                              <Tab icon={<EuroIcon />} {...a11yProps(1)} />
                              <Tab icon={<GroupIcon />} {...a11yProps(2)} />
                            </Tabs>
                          </AppBar>

       <TabPanel value={value} index={0} className={classes.root} bottom="10" >
            <Typography>
                <Box fontWeight="fontWeightMedium">
                    My health will be:
                </Box >
                <Box fullWidth border={1} p={1} borderRadius="borderRadius" >
                    {vision.health}
                </Box>
            </Typography>
            <Box p={2}/>
{/* 
            <TextField id="vision_desc" disabled className={classes.disabledText} defaultValue={vision.health} fullWidth
                multiline rows={3}  variant="outlined" onChange={(e)=>vision.health=e.target.value}/>
 */}            

            {/* <Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Health</Button> */}

{/*             <Typography>How do you visualize it?</Typography>
            <div>
              <img src={loadURL(vision.id,'health.jpg')} alt="" />
            </div> */}

        </TabPanel>
        <TabPanel value={value} index={1} className={classes.root}>
            <Typography>
                <Box fontWeight="fontWeightMedium">
                    My finance will be:
                </Box >
                <Box fullWidth border={1} p={1} borderRadius="borderRadius" >
                    {vision.money}
                </Box>
            </Typography>
            <Box p={2}/>

{/*             <Typography>How do you visualize it?</Typography>
            <div>
                <img href={vision.moneyImage} alt="" />
            </div> */}
        </TabPanel>
        <TabPanel value={value} index={2} className={classes.root}>
        <Typography>
                <Box fontWeight="fontWeightMedium">
                    My social connection will be:
                </Box >
                <Box fullWidth border={1} p={1} borderRadius="borderRadius" >
                    {vision.social}
                </Box>
            </Typography>
            <Box p={2}/>
        </TabPanel>

                <Box p={2} />
                </AccordionDetails>
                </Accordion> 
      ))
    }

    <Box p={2} />
    <Fab color="secondary" aria-label="add" className={classes.add} onClick={()=>createNewVision()}>
        <AddIcon />
    </Fab>    
    <Fab color="secondary" aria-label="show" className={classes.save}>
        <PhotoIcon onClick={()=>showVisionBoard()}/>
    </Fab>

    </div>

  );
}
export default withRouter(LifeAccordionTab);

{/* <TabPanel value={value} index={0} className={classes.root} bottom="10" >
<Typography>How would like your health to be?</Typography>
<TextField id="vision_desc" defaultValue={vision.health} fullWidth
 multiline rows={3}  variant="outlined" onChange={(e)=>vision.health=e.target.value}/>
<Box p={1} />
<Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Health</Button>
</TabPanel>
<TabPanel value={value} index={1} className={classes.root}>
<Typography>How would be your desired financial situation?</Typography>
<TextField id="money_desc" defaultValue={vision.money} fullWidth
 multiline rows={3}  variant="outlined" onChange={(e)=>vision.money=e.target.value}/>
<Box p={1} />
<Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Finance</Button>
</TabPanel>
<TabPanel value={value} index={2} className={classes.root}>
<Typography>How would you like your social environment (e.g. friends, family, tribe etc) to be?</Typography>
<TextField id="social_desc" defaultValue={vision.social} fullWidth
 multiline rows={3}  variant="outlined" onChange={(e)=>vision.social=e.target.value}/>
<Box p={1} />
<Button variant="contained" color="primary" onClick="upload_vision_img">Visualize Your Social</Button>
</TabPanel> */}