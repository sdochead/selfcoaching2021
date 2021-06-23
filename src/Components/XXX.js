// deprecated

import 'react-calendar/dist/Calendar.css';
import React,  { useContext, useState, useEffect} from 'react';
import { Checkbox, Container, FormControlLabel, FormGroup } from '@material-ui/core';
import firebase from '../firebase';
import { AuthContext } from "../Components/Auth.js";


export default function MyVision() {

    const { currentUser } = useContext(AuthContext);
    console.log(currentUser.uid);
    
    const vision_db = firebase.firestore().collection("users").doc(currentUser.uid).collection("vision");

    const [loading, setLoading] = useState(false);

    const [state, setState] = React.useState({
        checkedHealth: false,
        checkedMoney: false,
        checkedFamily: false,
        checkedFriends: false,
        checkedLeisure: false,
        checkedCareer: false,
        checkedHomeEnv: false,
      });




    async function read_status_db(lifeAspect)
    {
        var status = false;
        await vision_db.doc(lifeAspect).get().then((doc) => {
            if (doc.exists) {
              console.log("Document found");
              status = doc.data().active;
              console.log("db active", lifeAspect, doc.data().active);
              console.log("db staus", lifeAspect, status);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                merge_lifeaspect(lifeAspect,false);
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        console.log("db staus 2", lifeAspect, status);
        return status;
    }


      async function read_status_db_all()
      {
        setLoading(true);
        var h = await read_status_db("checkedHealth");
        setState({ ...state, checkedHealth : h });
        console.log("db h", state.checkedMoney);
        console.log("db h", h);


        var m = await read_status_db("checkedMoney");
        setState({ ...state, checkedMoney : m });
        //setState({ ...state, checkedMoney : await read_status_db("checkedMoney") });
        console.log("db m", m);
        console.log("db m", state.checkedMoney);

        setState({ ...state, checkedFamily : await read_status_db("checkedFamily") });
        setState({ ...state, checkedFriends : await read_status_db("checkedFriends") });
        setState({ ...state, checkedLeisure : await read_status_db("checkedLeisure") });
        setState({ ...state, checkedCareer : await read_status_db("checkedCareer") });
        setState({ ...state, checkedHomeEnv : await read_status_db("checkedHomeEnv") });
        setLoading(false);
      }
 
    useEffect(() => {
        read_status_db_all();
        // eslint-disable-next-line

      });
      

    function merge_lifeaspect(lifeAspect,lifeAspect_status){
        vision_db.doc(lifeAspect).set({
          active: lifeAspect_status
        }, { merge: true })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        merge_lifeaspect(event.target.name,event.target.checked);
        console.log(state);
    };

    console.log("my vis. component");

    return(

            <Container component="main" maxWidth="xs">
            {loading ? <h1>Loading...</h1> : null}
          

                <form noValidate>
                <FormGroup>
                    <FormControlLabel inline
                    control={<Checkbox checked={state.checkedHealth} onChange={handleChange} name="checkedHealth" />} 
                    label="Health"/>  

                    <FormControlLabel 
                    control={<Checkbox checked={state.checkedMoney} onChange={handleChange} name="checkedMoney" />} 
                    label="Money"/> 

                    <FormControlLabel 
                    control={<Checkbox checked={state.checkedFamily} onChange={handleChange} name="checkedFamily" />} 
                    label="Family"/> 

                    <FormControlLabel 
                    control={<Checkbox checked={state.checkedFriends} onChange={handleChange} name="checkedFriends" />} 
                    label="Friends"/> 

                    <FormControlLabel 
                    control={<Checkbox checked={state.checkedLeisure} onChange={handleChange} name="checkedLeisure" />} 
                    label="Leisure"/>

                    <FormControlLabel 
                    control={<Checkbox checked={state.checkedCareer} onChange={handleChange} name="checkedCareer" />} 
                    label="Career"/>                     

                    <FormControlLabel
                    control={<Checkbox checked={state.checkedHomeEnv} onChange={handleChange} name="checkedHomeEnv" />} 
                    label="Home Environment"/>

                 </FormGroup>
                </form>
            </Container>
        )
}