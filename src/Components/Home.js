import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect} from 'react-router-dom';
import Dream from './Dream';
import Plan from './Plan';
import Act from './Act';
import Health from './Health';
import Money from './Money';
import Career from './Career';
import Typography from '@material-ui/core/Typography';

export default function Home() {
    

  return (

    <div>    
          <Router>
    <Header />
      <Switch>
                <Route exact path="/dream"><Dream /></Route>
                <Route exact path="/plan"><Plan /></Route>
                <Route exact path="/act"><Act /></Route>
                <Route exact path="/health"><Health /></Route>
                <Route exact path="/money"><Money /></Route>
                <Route exact path="/career"><Career /></Route>
                <Route exact path="/home"><Einstein /></Route>
    </Switch>
    <Footer />
    </Router>

    </div>


  );
}

function Einstein()
{

  return(
    <div>
        <img src="einstein.gif" alt='Nature' style={{height:'auto',width:'100%'}}/>
        <Typography align='center' variant="body1">
        <p></p>
          <i >"Life is like riding a bike, move to keep balance." ~ Einstein</i>
        </Typography>
    </div>
  )

}