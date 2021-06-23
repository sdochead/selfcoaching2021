import React, {useContext, useEffect, useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect, withRouter, useHistory} from 'react-router-dom';
import Dream from './Dream';
import Plan from './Plan';
import Rate from './Rate';
import Act from './Act';
import Health from './Health';
import Money from './Money';
import Career from './Career';
import Typography from '@material-ui/core/Typography';
import firebase from '../firebase';
import { AuthContext } from "../Components/Auth.js";
import MyCalendar from './MyCalendar';
import LifeAccordionTab from './LifeAccordionTab';
import Profile from './Profile';
import HeaderSideMenu from './HeaderSideMenu';
import ManageVision from './ManageVision';
import ContentYoutube from './ContentYoutube';
import VisionBoard from './VisionBoard';
import Vision from './Vision';
import { Box, Button, CircularProgress, Container } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import Welcome from './Welcome.js';
import Initialize from './Initialize';
import HelpVisionBoard from './HelpVisionBoard';
import PrivateRoute from './PrivateRoute';
import Content from './Content';

function Home(props) {
    
  const { currentUser } = useContext(AuthContext);

  const [loading,setLoading] = useState(false);
  const [name,setName] = useState("");
  const [role,setRole] = useState("user");
  const [maxYear,setMaxYear]=useState(0);


/*   if (!currentUser) {
    console.log("no user therefor redirect to signin");
    return <Redirect to="/signin" />;
  }  */
  useEffect(() => {
    fetchUserInfo();
}, []);

  function handleSignOut(){

      firebase.auth().signOut().then(() => {
        console.log("user is out", "Success");
        window.location = "./signin";
      })
      .catch((err) => {
        console.error(err);
      });

  }


  const fetchUserInfo=async()=>{
    try {

            setLoading(true);
            const user_ref = firebase.firestore().collection("Users").doc(currentUser.uid); 
            const doc = await user_ref.get();
            console.log(doc);

            if(!doc) 
            {
              console.log("new user");
              setName("Anonym");
              setRole("user");
              setMaxYear(0);
              setLoading(false);

            }
            else
            {
                console.log(doc);
                setName(await doc.data().name);
                setRole(await doc.data().role);
                setMaxYear(await doc.data().maxYear);
                console.log("user name ", doc.data().name);
                console.log("user role", doc.data().role);
                console.log("year", doc.data().maxYear);
                setLoading(false);
            }
        }catch(err){
            console.log(err);
            setLoading(false);

        }
  } 

 
  return (

    <Container component="main" maxWidth="xs">

          loading ? <CircularProgress />
          :
          <div>    
              <Router>
                  <HeaderSideMenu role={role} user={currentUser} year={maxYear}/>
                  <Switch>
      {/*             <Route exact path="/mycalendar"><MyCalendar /></Route>
                      <Route  path="/"><Einstein /></Route>
                      <Route exact path="/dream"><Dream /></Route> */}
                      <PrivateRoute exact path="/profile"><Profile /></PrivateRoute>
                      <PrivateRoute exact path="/content"><Content/></PrivateRoute>
                      <PrivateRoute exact path="/vision"><Vision /></PrivateRoute>
                      <PrivateRoute exact path="/"><Welcome maxYear={maxYear}/></PrivateRoute>
                      <PrivateRoute exact path="/initialize"><Initialize /></PrivateRoute>
                      <PrivateRoute exact path="/help"><HelpVisionBoard /></PrivateRoute>
                  </Switch>
              </Router>

          </div>

    </Container>


  );

}

const Start = props =>
{
  const {history,maxYear} =props;


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

  return(

    /* style={{background : orange[300]}} */
    <Box p={2}>
        <img src="xsmap.jpg" alt='Map' style={{height:'auto',width:'100%', borderRadius:'50%'}}/>
        <Box p={2} display="flex" justifyContent="center">
            <Button variant="contained" style={{background : orange[600], color : "white"}} onClick={startClick}>
                  {maxYear===0 ? "Start New Vision" : "Open Existing Vision"}
            </Button>   
        </Box>
    </Box>
  )

}


function Einstein()
{

  return(
    <div>
        <img src="einstein.gif" alt='Nature' style={{height:'auto',width:'100%'}}/>
        <Typography align='center' variant="body1">
        <p></p>
          <i >"Life is like riding a bike, move to keep your balance." ~ Einstein</i>
        </Typography>
    </div>
  )

}
export default withRouter(Home);