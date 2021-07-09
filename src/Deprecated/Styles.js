import {makeStyles} from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';


export default makeStyles((theme) => ({
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
      margin: theme.spacing(3),
      top: theme.spacing(4),
    },
    sliderLabel: {
      left: theme.spacing(5),
    },
    save: {
      justify: 'center'
      },
    header:{
        alignItems: 'center',
        background : '#ff8a65'
    },
    headerDetails:{
      alignItems: 'center',
      background : '#ff7043'
  },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    titleBarSelected: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
      fontWeight:"bold"
      
    },
    goButton: {
      background : blue[800],
      color : "white"
    },
    browseIcon:{
      color : "white",
      //background: grey[500]
      //borderStyle: "dashed",
      border:"white"
  },
  }));