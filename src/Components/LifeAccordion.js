import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function LifeAccordion() {

  const classes = useStyles();

  const [visions,setVisions]=useState([]);

  const { currentUser } = useContext(AuthContext);
  const ref=firebase.firestore().collection("Users").doc(currentUser.uid).collection("visions");

//  const ref=firebase.firestore().collection("Users");

  console.log(currentUser.uid);

  const fetchVisions=async()=>{
    try {
          console.log("fetch vision started");
          const data=await ref.get();
          console.log(data);
          data.docs.forEach(item=>{
          setVisions([...visions,item.data()])
          console.log(item);
          })
        }catch(err){
          console.log(err);
        }
  }

  useEffect(() => {
    fetchVisions();
  },[]);

  return (
    <div className={classes.root}>
    {
      visions && visions.map(vision=>{
        return(
            <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id={vision.year}>
                      <Typography className={classes.heading}>Vision of {vision.year}</Typography>
                 </AccordionSummary>
                 <AccordionDetails>
                    <Typography>
                        title = {vision.title} and mind = {vision.mind} and body = {vision.body} and env = {vision.env}
                    </Typography>
                    
                </AccordionDetails>
            </Accordion>

        )
      })
    }
    </div>

  );
}
