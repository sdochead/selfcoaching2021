import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControl, Grid, GridList, GridListTile, GridListTileBar, IconButton, InputLabel, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Select, Tab, Tabs, TextField, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { Add, Delete, Edit, Photo } from '@material-ui/icons';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';
import { AuthContext } from './Auth';
import { DataGrid, GridAddIcon, GridFilterListIcon, GRID_ROW_SELECTED } from '@material-ui/data-grid';
import Textual from './Textual.js'
import Visual from './Visual.js'
import { storage } from "../firebase";


import StepWizard from "react-step-wizard";
import Calendar from 'react-calendar';
import Quantitative from './Quantitative';

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

function Dream(props) {
    const {history} = props;
    const classes = useStyles();
    const [selectedTopic,setSelectedTopic]=useState("");
    const [desc,setDesc]=useState("");
    const [file,setFile]=useState(null);
    const [date,setDate]=useState(new Date(2022,1,1));

    const { currentUser } = useContext(AuthContext);

    //db ref
  
    function finish()
    {
        console.log("this is finish from Dream");
        console.log("topic=" , selectedTopic);
        console.log("desc=" , desc);
        console.log("date=" , date.toString());
        console.log("user=" , currentUser.uid);

        storeDreamInDB();

    }

    function storeDreamInDB(){

        var year = date.getFullYear();
        console.log(year);
        var topic = selectedTopic;
        var userRef = firebase.firestore().collection("Users").doc(currentUser.uid);
        var docRef = userRef.collection("visions").doc(year.toString());

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                alert("You have other dreams on this date as well. You can integrate this dream directly to your vision board.")
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                docRef.set({[topic]:desc},{ merge: true }).then(()=>{
                    alert("Your new dream is successfully created.");
                    storeImageDB(file,currentUser.uid,year,topic);
                    history.push("/visionBoard");
                });
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    const storeImageDB = (file,userID,year,topic) => {
        console.log("image file name: " + file);
        if(file){
        const uploadTask = storage.ref(`/images/${userID}/${year}/${topic}`).put(file);
        uploadTask.on("state_changed", console.log, console.error, () => {
          storage
            .ref(`/images/${userID}/${year}`)
            .child(topic)
            .getDownloadURL()
            .then((url) => {
                console.log("image is saved" , url);
            });
        });
      }}

    return (
<>
        <StepWizard>
            <SelectTopic 
                classes={classes}
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
            />
            <NameIt  classes={classes}
                desc={desc}
                setDesc={setDesc}           
            />
            <Visualize  classes={classes} file={file} setFile={setFile}/>
            <DateIt classes={classes} date={date} setDate={setDate} finish={finish}/>
        </StepWizard>
</>
    );   

}

function SelectTopic(props){
    const wizard = props;
    const {classes,selectedTopic,setSelectedTopic} = props;
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

                if(items.length>=1)
                    if(selectedTopic==="")
                        setSelectedTopic(items[0].id);
    //          console.log(item);
            }catch(err){
              console.log(err);
            }
      } 

  function galleryClickView(event){

    setSelectedTopic(event.target.alt);
    console.log("selected topic: " + event.target.alt);
  
  }

      return (

                <StyledStep classes={classes} 
                    wizard={wizard} messageToUser={"Which life force?"}>                

                    <div id="gallery-placeholder">
                        <GridList cellHeight={160}  cols={2} className={classes.GridList} autoFocus>
                            {topics.map((topic) => (
                            <GridListTile key={topic.id} cols={1}>
                            <img src={topic.placeholder} alt={topic.id}
                            onClick={galleryClickView}
                            style={selectedTopic===topic.id ? {border: '5px solid #021a40' }: {}}
                            />
                            <GridListTileBar
                                title={topic.id}
                                titlePosition="bottom"
                                actionPosition="left"
                                className={classes.GridListTileBar}
                            />
                            </GridListTile>
                        ))}
                        </GridList>
                    </div>

                </StyledStep>

      );
}

function NameIt(props){
        const wizard = props;
        const {classes,desc,setDesc} = props;
        
       
        useEffect(() => {
            
        }, []);

        function handleChange(event){
            console.log(event);
            console.log(event.target.value);
            setDesc(event.target.value);
        }
        return (
            <StyledStep classes={classes} 
                wizard={wizard} messageToUser={"Name it"}>
                Description
                <TextField autoFocus p={1} id="desc" value={desc} fullWidth
                    multiline rows={3}  variant="outlined"
                     onChange={handleChange}/>
            </StyledStep>
        );

}

function Visualize(props){
    const wizard = props;
    const {classes,file,setFile} = props;

    useEffect(() => {
    }, []);

      return (
          <StyledStep classes={classes} wizard = {wizard}
            messageToUser={"Visualize it"}>
                <Typography>Visual</Typography>

                <div justify="center">
                    <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
                    <img src={file===null 
                        ? "https://via.placeholder.com/400x300" 
                        : URL.createObjectURL(file)}
                        alt="Uploaded Images"
                        height="200"
                        width="200"/>
                </div>

          </StyledStep>
      );

}

function DateIt(props){
    const wizard = props;
    const {classes,date,setDate} = props;

    function handleCalendarSelected(value){
        console.log(value);
        setDate(value);
    }

    useEffect(() => {
    }, []);

      return (
          <StyledStep classes={classes} wizard = {wizard}>
                <Calendar
                    defaultView="decade"
                    maxDetail="decade"
                    showWeekNumbers="true"
                    defaultValue={date}
                    onChange={handleCalendarSelected}
                />
          </StyledStep>
      );

}

function MetricIt(props){
    const wizard = props;
    const {classes} = props;



    useEffect(() => {
    }, []);

      return (
          <StyledStep classes={classes} wizard = {wizard}>
                <Quantitative />
          </StyledStep>
      );

}

function StyledStep(props) {
    const { children, classes, messageToUser, wizard } = props;
  
    return (
        <>
        <Paper  id={wizard.currentStep} className={classes.paper}>
            <AppBar p={1} position="static"  className={classes.header}>   
                <Typography p={1}>
                    Step {wizard.currentStep}/{wizard.totalSteps}
                </Typography>                  
            </AppBar>

            <Grid container item xs={12} alignItems="center" 
            spacing={1} className={classes.content}>
                <Grid item xs={2}>
                        <button disabled = {(wizard.currentStep===1)} onClick={wizard.previousStep}>Back</button>
                </Grid>
                <Grid item xs={7}>
                    {/* <Typography>{messageToUser}</Typography> */}
                </Grid>
                <Grid item xs={3}>
                    {(wizard.currentStep===wizard.totalSteps ?
                        <button  onClick={wizard.finish}>Finish</button>
                         :
                        <button  onClick={wizard.nextStep}>Next</button>
                    )}
                </Grid>
            </Grid>

            <Box p={2}>
                {children}
            </Box>
            
        </Paper>
        </>

    );
  }
  
export default withRouter(Dream);