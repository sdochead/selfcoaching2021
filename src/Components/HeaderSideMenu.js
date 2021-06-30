//Based on Drawers https://material-ui.com/components/drawers/

import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeSharp from '@material-ui/icons/HomeSharp';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import firebase from '../firebase';
import { withRouter } from "react-router-dom";
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Delete, ExitToApp, Today, VideoLibrary } from '@material-ui/icons';
import PeopleIcon from '@material-ui/icons/People';
import SchoolIcon from '@material-ui/icons/School';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import ExploreIcon from '@material-ui/icons/Explore';
import PersonIcon from '@material-ui/icons/Person';
import { AuthContext } from './Auth';
import { Link } from 'react-router-dom'

const drawerWidth = 200;
var currentTab = "Home";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));
  

  const Header = props => {

    const { history,role,user,year} = props;
 
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const theme = useTheme();

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const openProfile = () => {
      //history.push("/profile");
      handleDrawerClose();
      currentTab="Profile";
    };
    const openDream = () => {
      console.log("start a dream.");
      history.push("/dream");
      handleDrawerClose();
      currentTab="Start a new dream";
    };

    const openVision = () => {
        console.log("my vision pushed.");
        if(year===0)
        history.push({
          //pathname: "/initialize",
          pathname: "/help",
        });
    else{
            console.log("maxYear: ", year );
            history.push({
              pathname: "/vision",
              state: { "maxYear": year }
            });
      }
        handleDrawerClose();
        currentTab="Vision Board";
      };

    const openCalendar = () => {
      console.log("my calendar pushed.");
      history.push("/mycalendar");
      handleDrawerClose();
      currentTab="Calendar";
    }

    const openContent = () => {
      console.log("content pushed.");
      //history.push("/content");
      handleDrawerClose();
      currentTab="Content";
    }

    function signOut(){
        firebase.auth().signOut().then(() => {
          console.log("user is out", "Success");
          window.location = "./signin";
        })
        .catch((err) => {
          console.error(err);
        });
    }

    function deleteMyAccount(){
      if (window.confirm("You are deleting your account. This will erase all your information permanently. Are you sure?")) {
      
        const user_doc = firebase.firestore().collection("Users").doc(user.uid);

        user_doc.collection("ExpectedMetrics").get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
              user_doc.collection("ExpectedMetrics").doc(doc.id).delete().then(() => {
                console.log("metric deleted!");                      
            }).catch((error) => {
                console.error("Error removing metric: ", error);
            });
          });
        });

        user_doc.delete().then(() => {
            console.log("User main doc deleted!");    
            signOut();           
          }).catch((error) => {
              console.error("Error removing User: ", error);
          });       
      }
    }

    return(
          <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: open,})}>
              <Toolbar>             
                <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" className={clsx(classes.menuButton, open && classes.hide)}>        
                    <MenuIcon />
                </IconButton>
                <Typography> {currentTab} </Typography>
              </Toolbar>
          </AppBar>
          <Toolbar />
          <Drawer
              className={classes.drawer}
              variant="temporary"
              anchor="left"
              open={open}
              onClose={handleDrawerClose}
              classes={{
                paper: classes.drawerPaper,
              }}
          >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
        <Divider />
        <List>
{/*             <ListItem button key="Profile" onClick={openSetting}>
              <ListItemIcon>{<PersonIcon />}</ListItemIcon>
              <ListItemText primary='Profile' />
            </ListItem> */}           
{/*             <ListItem button key="dream" onClick={openDream}>
              <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
              <ListItemText primary='Start A Dream' />
            </ListItem> */}
            <ListItem key="Vision Board" component={Link} to="/" onClick={openVision}>
              <ListItemIcon>{<InsertEmoticonIcon />}</ListItemIcon>
              <ListItemText primary='Vision Board' />
            </ListItem>
            {role==="admin"
            ?  <>
                    <ListItem button key="Plan">
                      <ListItemIcon>{<ExploreIcon />}</ListItemIcon>
                      <ListItemText primary='Plan' />
                    </ListItem>
                    <ListItem button key="Calendar" onClick={openCalendar}>
                      <ListItemIcon>{<Today />}</ListItemIcon>
                      <ListItemText primary='Calendar' />
                    </ListItem> 
               </>
            : null}           
        </List>
        <Divider />
        <List>
            <ListItem key="Learn" component={Link} to="/content" onClick={openContent}>
              <ListItemIcon>{<SchoolIcon />}</ListItemIcon>
              <ListItemText primary='Content' />
            </ListItem>
            {role==="admin"
            ?       <ListItem button key="Community">
                      <ListItemIcon>{<PeopleIcon />}</ListItemIcon>
                      <ListItemText primary='Community' />
                    </ListItem>
            : null}                      
        </List>
        <Divider />
        <List>
            {role==="admin"
              ?
                <ListItem key="Admin" component={Link} to="/admin" onClick={openProfile}>
                    <ListItemIcon>{<PersonIcon />}</ListItemIcon>
                    <ListItemText primary='Admin' />
                </ListItem> 
              :
                <ListItem key="Profile" component={Link} to="/profile" onClick={openProfile}>
                      <ListItemIcon>{<PersonIcon />}</ListItemIcon>
                      <ListItemText primary='Profile' />
                </ListItem> 
            }          
            <ListItem button key="Sign Out" onClick={signOut}>
              <ListItemIcon>{<ExitToApp />}</ListItemIcon>
              <ListItemText primary='Signout' />
            </ListItem>
{/*             <ListItem button key="delete" onClick={deleteMyAccount}>
              <ListItemIcon>{<Delete />}</ListItemIcon>
              <ListItemText primary='Delete My Account' />
            </ListItem>  */}
        </List>        
      </Drawer> 
    </div>        
    )}

    export default withRouter(Header);