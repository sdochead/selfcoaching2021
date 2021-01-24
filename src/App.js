import React from 'react';
import { Button, Typography } from '@material-ui/core';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect} from 'react-router-dom';
import Dream from './Components/Dream';
import Plan from './Components/Plan';
import Act from './Components/Act';
import Health from './Components/Health';
import Money from './Components/Money';
import Career from './Components/Career';
import SignIn from './templates/SignIn';
import SignUp from './templates/SignUp';
import Landing from './Components/Landing'
import Home from './Components/Home';
import Container from '@material-ui/core/Container';


export default function App() {
  
  return (
    <Container component="main" maxWidth="xs" style={{padding:0}}>

    <div>
        <Router>    
            <Switch>
    
                <Route exact path="/signin"><SignIn /></Route>
                <Route exact path="/signup"><SignUp /></Route>
                <Route exact path="/Home"><Home /></Route>
                <Route exact path="/"><Landing /></Route>

            </Switch>
        </Router>    
 
    </div>
    </Container>
  );
}