import React from 'react';
import {  BrowserRouter as Router,  Route,  Switch} from 'react-router-dom';
import SignIn from './templates/SignIn';
import SignUp from './templates/SignUp';
import Home from './Components/Home';
import PrivateRoute from './Components/PrivateRoute';
import Container from '@material-ui/core/Container';
import { AuthProvider } from './Components/Auth';
import Landing from './Landing';



export default function App() {
  
  document.title = "Personal Map of Life";
  console.log("App component started...");

  return (
    <Container component="main"  style={{padding:0}}>

    <div>
      <AuthProvider>
        <Router>    
            <Switch>
                <PrivateRoute exact path="/"><Home /></PrivateRoute>    
                <Route exact path="/signin"><SignIn /></Route>
                <Route exact path="/signup"><SignUp /></Route>

            </Switch>
        </Router>
      </AuthProvider>  
 
    </div>
    </Container>
  );
}