import 'react-calendar/dist/Calendar.css';
import React, { useEffect, useState } from 'react';
import YoutubeEmbed from './YoutubeEmbed';
import firebase,{storage} from '../firebase';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import "./square.css";

export default function ContentYoutube() {

const [loading,setLoading]=useState(false);
const [contents,setContents]=useState([]);
const db = firebase.firestore().collection("Content");



useEffect(() => {
        fetchContents();
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

        <div height="100%">
            {loading ? <h2>Loading...</h2> :
    
                contents.map((content,index) => (

                    <div class="square">
                        <div class="content">
                            <div class="table">
                                <div class="table-cell">
                        <Card>
                            <CardActionArea>
                                <CardMedia  
                                component="iframe"
                                src={`https://www.youtube.com/embed/${content.YoutubeID}`}
                                // title={content.Title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="body">
                                        {content.Title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary">
                                    Share
                                </Button>
                                <Button size="small" color="primary">
                                    Learn More
                                </Button>
                            </CardActions>
                        </Card>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
        </div>
        )
}

{/* <Grid container justify="center" spacing={2}>
{contents.map((content,index) => (
    <Grid key={index} xs={11} sm={8} md={5} item>
        <Card>
            <CardActionArea>
                <CardMedia  
                component="iframe"
                src={`https://www.youtube.com/embed/${content.YoutubeID}`}
                // title={content.Title}
                />
                <CardContent>
                    <Typography gutterBottom variant="body">
                        {content.Title}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary">
                    Share
                </Button>
                <Button size="small" color="primary">
                    Learn More
                </Button>
            </CardActions>
        </Card>
    </Grid>
))}
</Grid>
 */}