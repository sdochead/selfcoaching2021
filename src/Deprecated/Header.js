import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeSharp from '@material-ui/icons/HomeSharp';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { withRouter } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,    
    },
    menuButton: {
      marginRight: theme.spacing(0),
    },
    title: {
      flexGrow: 1,
    },
  }));
  

  const Header = props => {

    const { history } = props;
 
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const openVision = () => {
        console.log("my vision pushed.");
        history.push("/myvision");
        setAnchorEl(null);
    };

    const openCalendar = () => {
      console.log("my calendar pushed.");
      history.push("/mycalendar");
      setAnchorEl(null);
    }

    const handleSetting = () => {
      console.log("setting pushed.");
      history.push("/setting");
      setAnchorEl(null);
    }

    const handleClose = () => {
      setAnchorEl(null);
    };

    const homeClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    function handleSignOut(){

        firebase.auth().signOut().then(() => {
          console.log("user is out", "Success");
          window.location = "./signin";
        })
        .catch((err) => {
          console.error(err);
        });

    }

    return(
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                  <HomeSharp label = "Home" onClick={homeClick}/>
                </Typography>
                <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="setting">
                    <SettingsIcon label = "Setting" onClick={handleSetting}/>
                </IconButton>
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                      <MenuItem onClick={handleClose}>My Profile</MenuItem>
                      <MenuItem onClick={openVision}>My Vision</MenuItem>
                      <MenuItem onClick={handleClose}>My Strategy</MenuItem>
                      <MenuItem onClick={openCalendar}>My Calendar</MenuItem>
                      <MenuItem onClick={handleSignOut}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )}

    export default withRouter(Header);