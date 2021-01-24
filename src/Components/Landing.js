import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from 'react-router-dom/Link';
import Button from '@material-ui/core/Button';


export default function Landing() {

    return(
        <div>
            <img src={'home-small.jpg'} alt='Nature' style={{height:'auto',width:'100%'}}/>
            <Typography align='center' variant="h4">
            <p>Welcome to Self Coach</p>
            </Typography>
            <Typography align='center' variant="body1">
        
            <Button component={Link} to={"./signin"} variant="contained" color="primary" align = 'center'>Get Started</Button>
        

            <p>Get your future in your hand</p>
            </Typography>
        </div>
    );

}