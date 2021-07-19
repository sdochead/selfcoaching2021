import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Select, Snackbar, Tab, Tabs, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Photo } from '@material-ui/icons';
import firebase from '../firebase';
import { useHistory, withRouter } from 'react-router-dom';
import { AuthContext } from './Auth';
import { DataGrid, GridAddIcon, GridFilterListIcon, GRID_ROW_SELECTED } from '@material-ui/data-grid';
import Alert from '@material-ui/lab/Alert';
import StyledPaper from './StyledPaper';
import { storage } from "../firebase";


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
        background : '#ff8a65',
        color: '#ffffff'
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


    const AdminDashboard = props => {


    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {

        console.log("------ action -------", history.action);

        return () => {
            if (history.action === "POP") {
                // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
                    console.log("------ location -----",history.location.pathname);
                    window.location.replace("/");
                }
        }
    },[])

    return (

        <Metrics classes={classes}/>
    
    );
}


function Metrics(props){

    const {classes} = props;

    const [file,setFile]=useState(null);
    const metric_ref = firebase.firestore().collection("Metrics");

    const [metricProperties,setMetricProperties] = useState([
        { field: 'id', headerName: 'Name',
          headerClassName: classes.header, width: 150 },
        { field: 'topic', headerName: 'Force', 
          headerClassName: classes.header, width: 90 },
        { field: 'unit', headerName: 'Unit',
          headerClassName: classes.header },
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
    const [metricName,setMetricName]=useState("name...");
    const [unitName,setUnitName]=useState("unit...");

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

    const okAddMetricDialogView = async()=>{

        console.log(selectedTopic);
        
        try{

            var url="";
            if(file!==null)
            {
                url = await storeImageMetricDB(file,metricName);
            }
            await metric_ref.doc(metricName)
                .set({"topic":selectedTopic,"unit":unitName,"value":0, "url":url},{ merge: true })
                .then(()=>
                {
                    console.log("metric added to vision"); 
                    setOpenMetricDialog(false);
                    fetchMetricNamesDB();
                    setMetricName("");
                    setUnitName("");
                    setFile(null);
                });
      }catch(err){
        console.log("errrror: metric not added");     
        console.log(err);
      }
    }

    const storeImageMetricDB = async(file,metric) => {
        console.log("image file name: " + file);
        if(file){
        const uploadTask = await storage.ref(`/images/metrics/${metric}`).put(file);
    
        var url = await storage.ref(`/images/metrics/`).child(metric).getDownloadURL();
        console.log("url", url);
        return url;
    }}    

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
        <StyledPaper message="Metrics">

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
            <DataGrid rows={metricDefinitions} columns={metricProperties}
                pageSize={5} checkboxSelection={false}
                onRowClick={handleRowClick}/>
        </div>    
    
        </StyledPaper> 
        
        <Dialog disableBackdropClick disableEscapeKeyDown
         open={openMetricDialog} onClose={cancelAddMetricDialogView}>
            <DialogTitle>Metric</DialogTitle>
            <DialogContent>
            <form >
                <FormControl>
                    <InputLabel htmlFor="demo-dialog-native">Related Topic</InputLabel>
                    <Select
                        native variant="standard"
                        onChange={selectedTopicChangeView}>
                        <option aria-label="None" value="" />                                
                        {
                            topics.map((item,index)=>
                        <option  value={item.id}>{item.id}</option>)
                        }
                    </Select>
                    <Box  m={1}>
                        <TextField value={metricName} variant="outlined" onChange={metricNameChangeView}/>
                    </Box>
                    <Box  m={1}>
                        <TextField value={unitName} variant="outlined"  onChange={unitNameChangeView}/>
                    </Box>
                    <div justify="center">
                        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
                        <img src={file===null 
                            ? "https://via.placeholder.com/400x300" 
                            : URL.createObjectURL(file)}
                            alt="Uploaded Image"
                            height="50"
                            width="50"/>
                    </div>

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

export default withRouter(AdminDashboard)