import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import firebase,{storage} from '../firebase';
import { Box, Button, Typography } from '@material-ui/core';
import StyledPaper from './StyledPaper';
import { useHistory } from 'react-router-dom';


export default function Content() {

const [loading,setLoading]=useState(false);
const [contents,setContents]=useState([]);
const db = firebase.firestore().collection("Content");

const history = useHistory();


    useEffect(() => {
        fetchContents();

        
        return () => {
            if (history.action === "POP") {
                // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
                    console.log("------ profile ------- after -----");
                    console.log("------ location -----",history.location.pathname);
                    window.location.replace("/");
                }
           }
      },[]); 
      
       const fetchContents=async()=>{
          setLoading(true);
          try {
                console.log("fetch content started");
                const data=await db.get();
      //          console.log(data);
      
                const items = [];
                data.docs.forEach(item=>{
                    items.push({id:item.id,...item.data()});
                  });
                  setContents(items);
                  setLoading(false);
      //          console.log(item);
              }catch(err){
                console.log(err);
              }
        } 
      


    console.log("content");

    return(
        <div>
            {loading ? <h2>Loading...</h2> :
            contents.map((content,index)=>(
                <div>
                    <StyledPaper message={content.Title}>
                        <YoutubeEmbed embedId={content.YoutubeID}/>
                        <Button color="primary" >
                            More
                        </Button>
                    </StyledPaper>
                </div>
                ))
            }
        </div>
        )
}