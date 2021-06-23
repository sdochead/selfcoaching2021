import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Select, Tab, Tabs, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Photo } from '@material-ui/icons';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';
import { AuthContext } from './Auth';
import { DataGrid, GridAddIcon, GridFilterListIcon, GRID_ROW_SELECTED } from '@material-ui/data-grid';

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
    chip: {
      margin: theme.spacing(0.5),
    },
    paper: {
      margin: theme.spacing(1),
      justify : "center",
    },
    sliderLimit: {
      margin: theme.spacing(2),
      top: theme.spacing(4),
    },
    sliderLabel: {
      left: theme.spacing(5),
    },
    save: {
      justify: 'center'
    },
    header:{
        alignItems: 'center',
        background : '#ff8a65'
    },
    headerDetails:{
      alignItems: 'center',
      background : '#ff7043'
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    content:{
        alignItems: 'center',
        margin: theme.spacing(1),
    },
  
  }));


const Setting = props => {

const classes = useStyles();


return (
    <div>

    <Profile classes={classes}/>

    <Topics classes={classes}/>

    <Metrics classes={classes}/>

    <Reset classes={classes}/>

    </div>
);
}

export default withRouter(Setting);


function Reset(props){

    const {classes} = props;
    const {currentUser} = useContext(AuthContext);

    const user_ref=firebase.firestore().collection("Users").doc(currentUser.uid); 


    const removeAllVisions=async()=>{
        try {
              console.log("reset started");
              var visions_ref= user_ref.collection("visions");
              console.log(visions_ref);
              if(visions_ref===undefined){
                  console.log("no visions collection");
                  return;
              }else{
                        const data=await visions_ref.get();
                        console.log(data);
                        data.docs.forEach(item=>{
                            console.log(item);
                            visions_ref.doc(item.id).delete().then(()=>{
                                console.log(item.id +"successfully deleted!")
                            });
                        });
            }
        }catch(err){
              console.log(err);
            }
    } 


    function handleReset(){
        console.log("reset started");
        removeAllVisions();        
    }


    return (

        <Paper  id="metrics" className={classes.paper}>
            <AppBar p={1} position="static" className={classes.header}>   
                <Typography p={1} >Reset </Typography>                  
            </AppBar>
            <Box p={2} display="flex" justifyContent="center">
                <Button  color="primary" variant="contained"
                        onClick={handleReset}>
                        Clear My Visions
                </Button>
            </Box>

        </Paper> 
         
    );


}

function Metrics(props){

    const {classes} = props;

    const metric_ref = firebase.firestore().collection("Metrics");

    const [metricProperties,setMetricProperties] = useState([
        { field: 'id', headerName: 'Name', width: 150 },
        { field: 'topic', headerName: 'Force', width: 90 },
    ]);
    const [metricDefinitions,setMetricDefinitions] = useState([]);
    const [disableEditBut, setDisableEditBut] = useState(true);

    const [openMetricDialog,setOpenMetricDialog]=useState(false);
    function cancelAddMetricDialogView()
    {
        setOpenMetricDialog(false);
    }
    function handleAdd()
    {
        setOpenMetricDialog(true);
    }
    const [topics,setTopics] = useState([]);
    const [metricName,setMetricName]=useState("");
    const [unitName,setUnitName]=useState("");

    function metricNameChangeView(event){
        setMetricName(event.target.value);
    }
    function unitNameChangeView(event){
        setUnitName(event.target.value);
    }    

    const [selectedTopic,setSelectedTopic]=useState(0);
    const [selectedGridMetric,setSelectedGridMetric]=useState(0);

    
    function selectedTopicChangeView(event){
        setSelectedTopic(event.target.value);
    }
    function okAddMetricDialogView(){
        console.log(selectedTopic);
        try{
            metric_ref.doc(metricName).set(
              {"topic":selectedTopic,"unit":unitName,"value":0}
              ,{ merge: true }); 
            console.log("metric added to vision"); 
            setOpenMetricDialog(false);
            fetchMetricNamesDB();
            setMetricName("");
            setUnitName("");
      }catch(err){
        console.log("errrror: metric not added to vision");     
        console.log(err);
      }
    }
    function removeMetric(){
        metric_ref.doc(selectedGridMetric).delete().then(() => {
            console.log(selectedGridMetric," successfully deleted!");
            fetchMetricNamesDB();
            
        }).catch((error) => {
                console.error("Error removing document: ", error);
        });
    }


    const fetchTopicsDB=async()=>{
        try {
              console.log("fetch topics started");
              const topics_ref=firebase.firestore().collection("Topics");
              const data=await topics_ref.get();
    
              const items = [];
              data.docs.forEach(item=>{
                  items.push({id:item.id,...item.data()});
                });
                setTopics(items);
    //          console.log(item);
            }catch(err){
              console.log(err);
            }
      } 


    useEffect(() => {
        fetchMetricNamesDB();
        fetchTopicsDB();
    }, []);


    const fetchMetricNamesDB=async()=>{
    try {
        console.log("fetch topics started");
        const data=await metric_ref.get();

        const items = [];
        data.docs.forEach(item=>{
            items.push({id:item.id,...item.data()});
            });
            setMetricDefinitions(items);
            console.log("Metric Defs",items);
        }catch(err){
        console.log(err);
        }
    } 

    function handleRowClick(element){
        console.log(element.id);

        if(element.rowIndex>=0){
            setDisableEditBut(false);
            setSelectedGridMetric(element.id);
        }
    }


    return (
        <>
        <Paper  id="metrics" className={classes.paper}>
        <AppBar p={1} position="static" className={classes.header}>   
            <Typography p={1} >Metrics </Typography>                  
        </AppBar>

        <Grid container xs={12} justify="center" spacing={1}>

            <Grid item xs={2} className={classes.content}>
                <Button  color="primary" variant="contained"
                    fullWidth onClick={handleAdd}>
                    <Add />
                </Button>
            </Grid>
            <Grid item xs={2} className={classes.content}>
                <Button  color="primary" variant="contained"
                    fullWidth disabled>
                    <Edit/>
                </Button>
            </Grid>
            <Grid item xs={2} className={classes.content}>
                <Button  color="primary" variant="contained"
                    fullWidth disabled={disableEditBut} onClick={removeMetric}>
                    <Delete/>
                </Button>
            </Grid>
        </Grid>

        <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={metricDefinitions} columns={metricProperties} pageSize={5} checkboxSelection={false} onRowClick={handleRowClick}/>
        </div>    
    
        </Paper> 
        
        <Dialog disableBackdropClick disableEscapeKeyDown
         open={openMetricDialog} onClose={cancelAddMetricDialogView}>
        <DialogTitle>Metric</DialogTitle>
        <DialogContent>
          <form >
            <FormControl>
              <InputLabel htmlFor="demo-dialog-native">Related Topic</InputLabel>
              <Select
                native
                onChange={selectedTopicChangeView}
              >
                <option aria-label="None" value="" />                                
                {
                    topics.map((item,index)=>
                <option id={index} value={item.id}>{item.id}</option>)
                }
              </Select>
              <TextField defaultValue={metricName} onChange={metricNameChangeView} />
              <TextField defaultValue={unitName} onChange={unitNameChangeView} />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelAddMetricDialogView} color="primary">
            Cancel
          </Button>
          <Button onClick={okAddMetricDialogView} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      </>    
    );


}

function Topics(props){
    const {classes} = props;
    const { currentUser } = useContext(AuthContext);
    const [topics,setTopics]=useState([]);

    
    useEffect(() => {
        fetchTopicsDB();
    }, []);

    const fetchTopicsDB=async()=>{
        try {
              console.log("fetch topics started");
              const topics_ref=firebase.firestore().collection("Topics");
              const data=await topics_ref.get();
    
              const items = [];
              data.docs.forEach(item=>{
                  items.push({id:item.id,...item.data()});
                });
                setTopics(items);
    //          console.log(item);
            }catch(err){
              console.log(err);
            }
      } 

      return (
        <div>
    <Paper  id="metrics" className={classes.paper}>
    <AppBar p={1} position="static" className={classes.header}>   
        <Typography p={1} >Life Forces</Typography>                  
    </AppBar>

        <List dense className={classes.root}>
        {topics.map((topic,index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;
            return (
            <ListItem key={topic.id}>
                <ListItemAvatar>
                <Avatar
                    alt={topic.id}
                    src={topic.placeholder}
                />
                </ListItemAvatar>
                <ListItemText id={topic.id} primary={topic.id} />
                <ListItemSecondaryAction>
                <Checkbox
                    edge="end"
                    //onChange={handleToggle(value)}
                    //checked={checked.indexOf(value) !== -1}
                    //inputProps={{ 'aria-labelledby': labelId }}
                />
                </ListItemSecondaryAction>
            </ListItem>
            );
        })}
        </List>

        </Paper>
        </div>
      )
          

}

function Profile(props){
    const {classes} = props;

    const { currentUser } = useContext(AuthContext);
    const [profileName,setProfileName]=useState();
    const [birthYear,setBirthYear]=useState();

    const user_ref=firebase.firestore().collection("Users").doc(currentUser.uid); 

    useEffect(() => {
        fetchProfileDB();
    }, []);
  

    const updateProfileDB=async()=>{
        try {
                console.log("update profile started");
                user_ref.update(
                    {"name":profileName,"birthYear":birthYear}).then(()=>{
            //            changeInTopic();
                        console.log("profile is updated", profileName);
                    });
    
            }catch(err){
            console.log(err);
            }
    } 

    const fetchProfileDB=async()=>{
    try {
            console.log("fetch profile started", user_ref);
        
            user_ref.get().then((doc)=>{
                if(doc.exists){
                    setProfileName(doc.data().name);
                    setBirthYear(doc.data().birthYear);
                    console.log(doc.data().name);         
                    console.log(doc.data().birthYear);
                }else{
                    console.log("such user doesnot exist", doc.data());
                }         

            });
        }
        catch(err){
            console.log(err);
        }
    }
  
    return(

        <Paper  id="profile" className={classes.paper}>
        <AppBar p={1} position="static" className={classes.header}>   
            <Typography p={1} >Profile </Typography>                  
        </AppBar>


        <Grid container item xs={12} alignItems="center" spacing={1}>
            <Grid item xs={1}>
                    <Box/>
            </Grid>
            <Grid item xs={4}>
                    <Typography>Username:</Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField variant="outlined" margin="normal" required fullWidth
                    value={profileName} onChange={(e)=>setProfileName(e.target.value)} autoFocus/>
            </Grid>
            <Grid item xs={1}>
                    <Box/>
            </Grid>
        </Grid>
        <Grid container item xs={12} alignItems="center" spacing={1}>
            <Grid item xs={1}>
                    <Box/>
            </Grid>
            <Grid item xs={4}>
                    <Typography>Year of Birth:</Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField variant="outlined" margin="normal" fullWidth
                    value={birthYear} onChange={(e)=>setBirthYear(e.target.value)}/>
            </Grid>
            <Grid item xs={1}>
                    <Box/>
            </Grid>
        </Grid>            
        <Grid container xs={12} justify="center" >
                <Grid item xs={3} className={classes.content}>
                    <Button variant="contained" fullWidth
                        color="primary" onClick={updateProfileDB}>
                            Save
                    </Button>
                </Grid>
        </Grid>


        </Paper>

      )
}