import React, {useContext, useEffect, useState} from 'react';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect, withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from "./Auth.js";
import MyCalendar from './MyCalendar';
import HeaderSideMenu from './HeaderSideMenu';
import Vision from './Vision';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import StyledPaper from './StyledPaper';
import firebase from '../firebase';
import VisionPDF from './VisionPDF';

const Welcome = props =>
{
  const {history,maxYear} =props;
  const { currentUser } = useContext(AuthContext);
  //const [maxYear,setMaxYear]=useState(0);
  const [loading,setLoading]=useState(false);
  const [view,setView]=useState("welcome");


/* 
  useEffect(() => {
    fetchVisionMaxYear();
  }, []);

  const fetchVisionMaxYear=async()=>{
    try {

          setLoading(true);
          const user_ref = firebase.firestore().collection("Users").doc(currentUser.uid); 

          const doc = await user_ref.get();
          const max = await doc.data().maxYear;

          console.log(max,doc.data());
          setMaxYear(await doc.data().maxYear);
          setLoading(false);

        }catch(err){
          console.log(err);
          setLoading(false);
        }
  }  */

  function startClick(){
    if(maxYear===0)
        history.push({
          //pathname: "/initialize",
          pathname: "/help",
        });
    else{
            console.log("maxYear: ", maxYear );
            history.push({
              pathname: "/vision",
              state: { "maxYear": maxYear }
            });
      }
}

function exportPdf(){
    setView("pdf");
}

  return(


    <Box p={2}>
        <img src="start-vision-600.jpg"  alt='Map' style={{height:'auto',width:'100%', borderRadius:'50%'}}/>
        <Box p={2} style={{position:"relative"}}>
          {loading===true 
          ?     <CircularProgress style={{position:"absolute", left:"50%" , top:"50%"}}/>
          :
          <>
              <Box  p={1} display="flex" justifyContent="center">
                  <Button variant="contained" 
                      style={{background : orange[600], color : "white"}}
                      onClick={startClick}>
                      {maxYear===0 ? "Start New Vision" : "Open Existing Vision"}
                  </Button>
              </Box>                  
          </>
          }
        </Box>
    </Box>

  )

}

export default withRouter(Welcome);
