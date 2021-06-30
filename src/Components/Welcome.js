import React, {useContext, useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect, withRouter} from 'react-router-dom';
import Dream from './Dream';
import Plan from './Plan';
import Rate from './Rate';
import Act from './Act';
import Health from './Health';
import Money from './Money';
import Career from './Career';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from "./Auth.js";
import MyCalendar from './MyCalendar';
import LifeAccordionTab from './LifeAccordionTab';
import Setting from './Setting';
import HeaderSideMenu from './HeaderSideMenu';
import ManageVision from './ManageVision';
import ContentYoutube from './ContentYoutube';
import VisionBoard from './VisionBoard';
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
        <img src={maxYear===0 ? "start-vision-600.jpg" : "xsmap.jpg"}  alt='Map' style={{height:'auto',width:'100%', borderRadius:'50%'}}/>
        <Box p={2}>
          {loading===true 
          ?     <CircularProgress />
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
