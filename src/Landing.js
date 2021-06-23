import React from 'react';
import Typography from '@material-ui/core/Typography';
import Route from 'react-router-dom/Link';
import Button from '@material-ui/core/Button';
import SignIn from './templates/SignIn';
import { Redirect } from 'react-router-dom';
import App from './App';
import ReactDOM from 'react-dom';



export default function Landing() {


    return(
        <div>
            <img src={'home-small.jpg'} alt='Nature' style={{height:'auto',width:'100%'}}/>
            <Typography align='center' variant="h4">
            <p>Welcome to Self Coach</p>
            </Typography>
            <Typography align='center' variant="body1">
        
            <Button href={"./index.html"} variant="contained" color="primary" align = 'center'>Get Started</Button>

            <p>Get your future in your hand</p>
            </Typography>
        </div>
    );


}