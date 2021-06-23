import React from 'react';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import TodayIcon from '@material-ui/icons/Today';
import RateReviewIcon from '@material-ui/icons/RateReview';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School';

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
                <BottomNavigationAction value="dream" label="Education" icon={<SchoolIcon />} component={Link} to="./dream" />
                <BottomNavigationAction value="plan" label="Community" icon={<PeopleIcon />}  component={Link} to="./plan"/>
                <BottomNavigationAction value="act" label="Reflection" icon={<RateReviewIcon />}  component={Link} to="./dream" />
            </BottomNavigation>

        </div>
    )
}