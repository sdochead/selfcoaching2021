import React from 'react';
import {  BrowserRouter as Router,  Route,  Link,  Switch,  Redirect} from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TodayIcon from '@material-ui/icons/Today';
import RateReviewIcon from '@material-ui/icons/RateReview';
import AssessmentIcon from '@material-ui/icons/Assessment';

const useStyles = makeStyles({
    stickToBottom: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        backgroundColor: 'lightblue',
        },
  });

export default function Footer() {

const classes = useStyles();
const [value, setValue] = React.useState('dream');

const handleChange = (event, newValue) => {
  setValue(newValue);
  console.log(newValue);
};

    return(

        <div>

            <BottomNavigation className={classes.stickToBottom} value={value} onChange={handleChange}>
                <BottomNavigationAction value="dream" label="Dream" icon={<AssessmentIcon />} component={Link} to="./dream" />
                <BottomNavigationAction value="plan" label="Plan" icon={<RateReviewIcon />}  component={Link} to="./plan"/>
                <BottomNavigationAction value="act" label="Act" icon={<TodayIcon />}  component={Link} to="./act" />
            </BottomNavigation>

        </div>
    )
}