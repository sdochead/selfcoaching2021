import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, FormControlLabel, Grid, GridList, GridListTile, GridListTileBar, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import Gallery from 'react-photo-gallery';
import { DirectionsRun, Edit, Photo, Delete, Add } from '@material-ui/icons';


export default function Textual(props){
    const {topic,user_ref}=props;
    const [desc,setDesc] =useState("");
    const [saved,setSaved]=useState(true);
  
    
  
  useEffect(() => {
    fetchDescDB();
  }, []);
  
  const fetchDescDB=async()=>{
    try {
          console.log("fetch vision started");
          user_ref.get().then((item)=>{
            var data={id:item.id,...item.data()};
            setDesc(data[topic]);
            console.log("description updated");
            /*         data.docs.forEach(item=>{
              yrs.push({value:item.id,label:''+item.id});
              items.push({id:item.id,...item.data()});
            });
            setSliderYears(yrs);
            setVisions(items); */
  //          console.log(item);          
          });
  
          
        }catch(err){
          console.log(err);
        }
  } 

  function textChangeClick(e)
  {
      setDesc(e.target.value);
      setSaved(false);
  }
  
  
  const updateDescDB = async() => {
  
    try {
      console.log("update description started");
  
      user_ref.set(
          {[topic]:desc},{ merge: true }).then(()=>{
  //            changeInTopic();
              console.log("description is saved");
              setSaved(true);
          });
  
  /*       var promises = await Promise.all(
        selectedMetrics.map((item)=>
        db.doc(selectedVision.id).collection('metrics').doc().set(
          {name:item.name,value:item.value},{ merge: true }))); 
  
      console.log("promise:", promises);*/
  
  }catch(err){
      console.log(err);
    } 
  
  };
  
      return(
        <>
          
          <TextField p={1} id="desc" 
                      value={desc}
                      fullWidth InputProps={{style: {fontSize: 14}}}  multiline rows={5}  variant="outlined" onChange={textChangeClick}/>
  
          <Button disabled={saved} color="primary" variant="contained" label="Save" onClick={()=>updateDescDB()}>
              Save Changes
          </Button> 
        </>
      )
  }