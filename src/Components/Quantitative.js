import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, FormControlLabel, FormHelperText, Grid, GridList, GridListTile, GridListTileBar, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import Gallery from 'react-photo-gallery';
import { DirectionsRun, Edit, Photo, Delete, Add } from '@material-ui/icons';
import Textual from './Textual.js'
import Visual from '../Deprecated/Visual.js'
import { Alert } from '@material-ui/lab';


export default function Quantitative(props){
    const {topic,userID,user_ref}=props;
    const [metricDefintions,setMetricDefinitions] =useState([]);
    const [metrics,setMetrics] =useState([]);
    const [openMetricDialog,setOpenMetricDialog]=useState(false);
    const [selectedMetricNameDialog,setSelectedMetricNameDialog]=useState("");
    const [selectedMetricValueDialog,setSelectedMetricValueDialog]=useState(0);
    const [selectedMetric,setSelectMetric] = useState("");
    const [unit,setUnit] = useState("unit");
    const [url,setUrl] = useState("");
    const [metric_already_exists,set_metric_already_exists] = useState(false);
    const [addDialog,setAddDialog] = useState(false);
    const [selectedMetricID,setSelectedMetricID] = useState(0);

    const metrics_expected_ref = user_ref.collection("ExpectedMetrics"); 
  
    const metrics_definition_ref = firebase.firestore().collection("Metrics");
  
  useEffect(() => {
    fetchExpectedMetricsDB();
    fetchMetricsDefinitionDB();
  }, []);
  
  const fetchExpectedMetricsDB=async()=>{
    try {
          console.log("fetch metrics started");
          var res = await metrics_expected_ref.where("topic", "==", topic).get();
          var items = [];
          res.docs.forEach(item=>{
            var data={id:item.id,...item.data()};
            items.push(data);
            console.log(data);
          });
          setMetrics(items);
          
        }catch(err){
          console.log(err);
        }
  }
  const fetchMetricsDefinitionDB=async()=>{
    try {
          console.log("fetch topics started");
          const data=await metrics_definition_ref.where("topic", "==", topic).get();
  
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

  const addMetric2VisionDB=async(metricName,metricValue)=>
  {
    try{
          var entry = {"topic":topic,"name":metricName,"value":metricValue,"unit":unit,"url":(url===undefined ? "" : url)};
          console.log(entry);     
          metrics_expected_ref.add(entry,{ merge: true }); 
          console.log("metric added to vision");     
    }catch(err){
      console.log("errrror: metric not added to vision");     
      console.log(err);
    }
  }
  
  const editMetric2VisionDB=async(newValue)=>
  {
      metrics_expected_ref.doc(selectedMetricID).update({"value":newValue}).then(()=>{  
          console.log("metric updated");
          fetchExpectedMetricsDB();
          closeMetricDialogView();    
      }).catch((err)=>{
          console.log("errrror: metric not updated");     
          console.log(err);
      });
  }
  
  function okAddMetricDialogView(){
    console.log("selected metric name", selectedMetricNameDialog);
    console.log("selected metric value", selectedMetricValueDialog);
  
    if(selectedMetricNameDialog===""){
      console.log("metric name is empty");
    }
    else{
      addMetric2VisionDB(selectedMetricNameDialog,selectedMetricValueDialog);
      fetchExpectedMetricsDB();
      closeMetricDialogView();        
    }
  }

  function editMetricDialogView(){
      console.log("selected metric name", selectedMetricNameDialog);
      console.log("selected metric value", selectedMetricValueDialog);

      editMetric2VisionDB(selectedMetricValueDialog);
      fetchExpectedMetricsDB();
      closeMetricDialogView();
  }  


  function metricValueChangeView(event)
  {
    setSelectedMetricValueDialog(event.target.value);
  }
  function openEditMetricDialogView(id,name,value,u){
    setSelectedMetricID(id);
    setSelectedMetricNameDialog(name);
    setSelectedMetricValueDialog(value);
    setUnit(u);
    console.log(id,name,value);
    setOpenMetricDialog(true);
    setAddDialog(false);
}
  function openAddMetricDialogView(){
      setSelectedMetricNameDialog("");
      setSelectedMetricValueDialog(0);
      setOpenMetricDialog(true);
      setAddDialog(true);
  }
   function cancelAddMetricDialogView(){
      setOpenMetricDialog(false); 
  }
  function selectAddMetricDialogChangeView(event){
      setSelectedMetricNameDialog(event.target.value);
      var uu = getUnitAndUrl(metricDefintions,event.target.value);
      console.log("metric dialog" , uu);
      setUnit(uu.unit);
      setUrl(uu.url);
  }
  function getUnitAndUrl(definitions,value){
      for (let index = 0; index < definitions.length; index++) {
        const element = definitions[index];
        if(element.id===value) return {unit:element.unit,url:element.url};      
      }
  }
  function getUnitX01(definitions,value){
    for (let index = 0; index < definitions.length; index++) {
      const element = definitions[index];
      if(element.id===value) return element.unit;      
    }
}  
  const closeMetricDialogView = () => {
    setOpenMetricDialog(false);
  };

  function editMetricClick(value)
  {
  }

  function deleteMetricClick(value)
  {
    console.log(value);

    if (window.confirm("You are deleting a metric. Are you sure?")) {
      
      metrics_expected_ref.doc(value).delete().then(() => {
          console.log("metric successfully deleted!");
          fetchExpectedMetricsDB();
          
      }).catch((error) => {
          console.error("Error removing User: ", error);
      });       
  }
  }

  function metricImageClick(id){
      console.log("metric image clicked. Name = ", id);
      setSelectedMetricNameDialog(id);
      var uu = getUnitAndUrl(metricDefintions,id);
      console.log("metric dialog" , uu);
      setUnit(uu.unit);
      console.log(metrics);
      var index = metrics.findIndex(obj => obj.name===id);
      console.log("index ",index);

      if(index===-1)
          set_metric_already_exists(false);
      else
          set_metric_already_exists(true);
  }

  const MetricList = () =>(
      <GridList cellHeight={50} cols={2} autoFocus>
          {metricDefintions.map((item) => (
            <GridListTile id={item.id} cols={1} onClick={()=>metricImageClick(item.id)}
                 style={selectedMetricNameDialog===item.id ? {border: '2px solid #021a40', borderRadius: "5px", fontWeight:"bold"}: {}}
            >
              <img src={item.url} alt={item.id}/>
               <GridListTileBar
                title={item.id}
                titlePosition="bottom"
                actionPosition="right"/>
            </GridListTile>
          ))}
      </GridList>
  )

  const MetricComboBox = () =>(
        <Box m={1} display='flex' alignItems="left">
        <Box>
          <Typography>Metric Name: </Typography>
          <Select id="my-input"  variant="outlined" native onChange={selectAddMetricDialogChangeView}>
              <option aria-label="None" value="" />                                
              {
                  metricDefintions.map((item,index)=>
                      <option value={item.id}>{item.id}</option>)
              }
          </Select>
        </Box>
        <Box pl={2} pt={4}>
            <Avatar>
                <img src={url} width={50} height={50} alt={selectedMetricNameDialog} />
            </Avatar>
        </Box>
    </Box>    
  )
  
      return(
        <>  
            <List>
              {
                  (metrics===undefined ? console.log("selectedMetrics is undefined"):
                  (metrics.length===0 ? console.log("selectedMetrics has no item"):
                  metrics.map((metric,index) => {
                      return (
                                  <ListItem id={index} >
                                        <ListItemAvatar>
                                            <Avatar>
                                              {metric.url===undefined
                                                ? <Photo />
                                                : <img src={metric.url} alt={metric.name} />
                                              }
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={metric.name} secondary={metric.value+" "+metric.unit}/>
                                        <ListItemIcon>
                                            <IconButton id={metric.name} edge="false" aria-label="edit" onClick={()=>openEditMetricDialogView(metric.id,metric.name,metric.value,metric.unit)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton id={metric.name} edge="end" aria-label="delete" onClick={()=>deleteMetricClick(metric.id)}>
                                                <Delete />
                                            </IconButton>
                                        </ListItemIcon>                                        
                                    </ListItem>
                              );
                            })))
                } 
                                                            
                <ListItem>
                    <ListItemText primary="Add metric"/>
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="add" onClick={openAddMetricDialogView}>
                            <Add autoFocus/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                </List>

            <Dialog disableBackdropClick disableEscapeKeyDown open={openMetricDialog} onClose={cancelAddMetricDialogView}>
                  <DialogTitle style={{background: '#ff8a65', color : "white"}}>
                      {addDialog ? topic.toUpperCase()+" new metric" : selectedMetricNameDialog}
                      </DialogTitle>
                  <DialogContent>
                    <form >
                      {addDialog ? <MetricList /> : null}
                      {metric_already_exists 
                        ?   <Box><br /><Alert severity="info">This metric is already set.</Alert></Box>
                        :   <Box>
                              <br />
                              <Grid container 
                                style={{display:'flex',flexDirection: 'column', alignItems: 'center',
                                border:"solid 2px", borderRadius:5, paddingTop:"10px", paddingBottom:"10px",
                                minWidth:"250px" }}>
                                    <Grid item>
                                        <Typography p={2}>What is your target Value?</Typography>
                                        <TextField disabled={selectedMetricNameDialog==="" ? true : false}
                                          type="number" variant="outlined" 
                                          defaultValue={addDialog ? "0" : selectedMetricValueDialog} id="desiredValue"
                                          style={{width:"100px"}}
                                          aria-describedby="my-helper-text" onChange={metricValueChangeView} />
                                        <TextField style={{marginLeft:"10px", width:"50px"}} disabled value={unit} onChange={metricValueChangeView} />
                                        <FormHelperText id="my-helper-text">Target value shall be a number.</FormHelperText>
                                    </Grid>
                              </Grid>
                            </Box>
                      }

                      </form>
                  </DialogContent>
                  <DialogActions style={{justifyContent: 'center'}}>
                      <Button onClick={cancelAddMetricDialogView} color="primary">
                            Cancel
                      </Button>
                      {addDialog 
                          ? <Button onClick={okAddMetricDialogView} color="primary">
                                Add
                            </Button>
                          : <Button onClick={editMetricDialogView} color="primary">
                                Edit
                            </Button>
                      }
                  </DialogActions>
              </Dialog>
        </>
      )
  }