import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import firebase,{storage} from '../firebase';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import StyledPaper from './StyledPaper';
import { withRouter } from 'react-router-dom';

const HelpVisionBoard = props =>
{
    const {history,} =props;

    useEffect(() => {
        
        return () => {
            if (history.action === "POP") {
                // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
                    console.log("------ profile ------- after -----");
                    console.log("------ location -----",history.location.pathname);
                    window.location.replace("/");
                }
           }
      }); 

    function nextClick(){
        history.push("/initialize")
    }

    return(

        <StyledPaper message="Introduction">
            <YoutubeEmbed embedId="yNOpBc72DKM"/>
            <Button variant="contained"
                    color="primary" onClick={nextClick}>
                Next
            </Button>
        </StyledPaper>
        )
}
export default withRouter(HelpVisionBoard);