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
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import MyCalendar from './MyCalendar';
import LifeAccordionTab from './LifeAccordionTab';
import Setting from './Setting';
import HeaderSideMenu from './HeaderSideMenu';
import ManageVision from './ManageVision';
import ContentYoutube from './ContentYoutube';
import VisionBoard from './VisionBoard';
import Vision from './Vision';
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import StyledPaper from './StyledPaper';
import YoutubeEmbed from './YoutubeEmbed';

function Initialize(props)
{

  const {history,} =props;
  
  const [showHelp,setShowHelp]=useState(false);
  const [period,setPeriod]=useState("5");
  const { currentUser } = useContext(AuthContext);
  const user_ref = firebase.firestore().collection("Users").doc(currentUser.uid); 
  const [topics,setTopics]=useState([]);

  useEffect(()=>{
    fetchTopicsDB();
    return () => {
      if (history.action === "POP") {
          // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
              console.log("------ profile ------- after -----");
              console.log("------ location -----",history.location.pathname);
              window.location.replace("/");
          }
     }
  },[]);

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
        }catch(err){
          console.log(err);
        }
  } 

  const storeNewYearDB = async(year)=>
  {
    try {
     var item = {}

    for (let index = 0; index < topics.length; index++) {
        item[topics[index].id] = "I would like to...";
        item[topics[index].id+"-url"] = topics[index].placeholder;
        console.log("this topic added ", topics[index]);
    } 

    item["maxYear"] = year;

    console.log("adding vision started", item);

    user_ref.set(item,{ merge: true }).then(()=>{
        console.log("vision successfully stored");
        return true;
    });

/*         visions_ref.doc(year).set(item).then(()=>{
            console.log("vision successfully stored");
            return true;
        }); */

    }catch(err){
        console.log(err);
      } 
      return false;   
  }

/*   const storeNewYearDB = async(year)=>
  {
    try {

        console.log("add vision started", year);

        visions_ref.doc(year).set({"year":year}).then((item)=>{
            console.log("max year created: " , item.id);
            return true;
        });
    }catch(err){
        console.log(err);
      }
      return false;
  }    
 */
  
 function handleRadioChange(event,value){
      console.log(value);
      setPeriod(value);
  }
  function goClick(){
    var max = (new Date().getFullYear()) + Number.parseInt(period);
    console.log("max" , max);
    if(storeNewYearDB(max))
        history.push({
          pathname: "/vision",
          state: { "maxYear": max }
        });
    else
        console.log("vision is not created");
  }

  return(
    <>
    <Typography>{showHelp}</Typography>
      { 
            (showHelp===false
              ?   <StyledPaper message="Introduction">
                      <YoutubeEmbed embedId="TUHmyEp4-7A"/>
                      <Button variant="contained" fullWidth
                                color="primary" onClick={setShowHelp(true)}>
                                    Save
                      </Button>
                  </StyledPaper>
              :   <StyledPaper message="Choose your desired period">
                      <FormControl component="fieldset">
                          <RadioGroup aria-label="period" name="period1" value={period} onChange={handleRadioChange}>
                              <FormControlLabel value="1" control={<Radio/>} label="One Year Vision" />
                              <FormControlLabel value="5" control={<Radio/>} label="Five Year Vision" />
                              <FormControlLabel value="10" control={<Radio/>} label="10 Year Vision" />
                          </RadioGroup>
                          <Button variant="contained" //className={classes.goButton}
                              onClick={goClick}>Go!
                          </Button>
                      </FormControl>
                  </StyledPaper>
          )
      }
      </>
  )
}

export default withRouter(Initialize);