import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, FormControlLabel, Grid, GridList, GridListTile, GridListTileBar, IconButton, Input, InputBase, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import Gallery from 'react-photo-gallery';
import { DirectionsRun, Edit, Photo, Delete, Add, FormatAlignJustify } from '@material-ui/icons';
import Textual from './Textual.js'
import { Alert, AlertTitle } from '@material-ui/lab';


export default function Visual(props){
    const {year,topic,userID}=props;
  
    const [imageURL,setImageURL] =useState("");
  //  const [loadingPC3,setLoadingPC3] =useState(false);
  
  
    useEffect(() => {
      fetchImageDB();
    }, []);
  
    const fetchImageDB=async()=>{
  
      try{
      console.log("fetch image started");
  //    setLoadingPC3(true);
  
      // Create a reference under which you want to list
      var imageRef = storage.ref().child(`/images/${userID}/${year}/${topic}`);
      console.log("year: "+year);
      console.log(imageRef);
  
      var res = await imageRef.getDownloadURL().then((url)=>{
          console.log("C3 P url:", url);
          setImageURL(url);
  //        setLoadingPC3(false);
        });
      }catch(err)
      {console.log(err);}
  }
  
  const storeImageDB = (file) => {
    console.log("image file name: " + file);
    if(file){
    const uploadTask = storage.ref(`/images/${userID}/${year}/${topic}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref(`/images/${userID}/${year}`)
        .child(topic)
        .getDownloadURL()
        .then((url) => {
            console.log(url);
            setImageURL(url);
        });
    });
  }}
  
  
  return(
    <>
        <Alert severity="info">
            Choose an <strong> inspiring </strong> picture
        </Alert>


        <Box p={1}>
            <img id="money-image"src={((imageURL==="") 
            ? "https://via.placeholder.com/400x300": imageURL)}
            alt="" width="100%" />
         </Box>
         <Box display="flex" justifyContent="center">
            <input type="file" accept="image/*" onChange={(e)=>storeImageDB(e.target.files[0])} />
        </Box>
    </>
    )
  }