import { blue } from "@material-ui/core/colors";

const { AppBar, Typography, Paper, Box, makeStyles, Toolbar } = require("@material-ui/core");

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    appBar: {
      position: 'relative',
    },
    yearField: {
      left: theme.spacing(2),
      top: theme.spacing(2),
      position: 'relative',
    },
    yearLabel: {
      left: theme.spacing(2),
      top: theme.spacing(2),
      position: 'relative',
    },
    addButton: {
      bottom: theme.spacing(2),
      right: theme.spacing(0),
      position: 'absolute',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    paper: {
      margin: theme.spacing(1),
      justify : "center",
    },
    sliderLimit: {
      margin: theme.spacing(2),
      top: theme.spacing(4),
    },
    sliderLabel: {
      left: theme.spacing(5),
    },
    save: {
      justify: 'center'
      },
    plainHeader:{
        left: theme.spacing(3),
        background : '#ff8a65'
    },
    centeredHeader:{
      alignItems: 'center',
      background : '#ff7043'
  },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    goButton: {
      background : blue[800],
      color : "white"
    },
    searchIcon: {
      position:'absolute',
      right: theme.spacing(2),
      color:"white",
    },
  
  }));
  
export default function StyledPaper(props) {
    
    const classes = useStyles();

    const { children, message, actionIcon} = props;
    return (

        <Paper className={classes.paper}>
            {actionIcon
              ?
                <AppBar p={1} position="static"  className={actionIcon ? classes.plainHeader : classes.centeredHeader}>   
                    <Toolbar>
                        <Typography p={1}>
                            {message}
                        </Typography>                
                        <div className={classes.searchIcon}>
                              {actionIcon}
                        </div>  
                    </Toolbar>            
                </AppBar>
              :
                <AppBar p={1} position="static"  className={classes.centeredHeader}>   
                      <Typography p={1}>
                          {message}
                      </Typography>              
                </AppBar>
            }          
            <Box p={2} display="flex" flexDirection="column" justifyItems="center" justifyContent="center">
                {children}
            </Box>
        </Paper>
  )
}
