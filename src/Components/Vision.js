import React,{useState,useEffect,useContext} from 'react';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import {  Box, CircularProgress, GridList, GridListTile, GridListTileBar, Icon, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Radio, RadioGroup, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import { DirectionsRun, Edit, Photo, Delete, Add, PhotoAlbum, PhotoAlbumRounded, PhotoAlbumOutlined, PhotoAlbumTwoTone, FormatUnderlined } from '@material-ui/icons';
import Textual from './Textual.js'
import Quantitative from './Quantitative';
import StyledPaper from './StyledPaper';
import PublishIcon from '@material-ui/icons/Publish';
import { PictureAsPdf } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import styles from '../Deprecated/Styles';

const Vision = props => {

const history = useHistory();

const classes = styles();

const { currentUser } = useContext(AuthContext);
const location  = useLocation();
const maxYear = location.state.maxYear;

console.log("maxYear =" , maxYear);

  //db ref
const user_ref=firebase.firestore().collection("Users").doc(currentUser.uid);
const [topics,setTopics]=useState([]);
const [images,setImages]=useState([]);
const [selectedTopic,setSelectedTopic]=useState("");
const [selectedVision,setSelectedVision]=useState(null);

//loading semaphors  
const [loadingPix, setLoadingPix] = useState(false);

useEffect(() => {
    fetchAllDB();

    return () => {
      if (history.action === "POP") {
          // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
              console.log("------ profile ------- after -----");
              console.log("------ location -----",history.location.pathname);
              window.location.replace("/");
          }
     }
  },[]);

  ////////////////View////////////////
const fetchTopicsDB = async()=>{
    try {
          console.log("fetch topics started");
          const topics_ref = firebase.firestore().collection("Topics");
          const data = await topics_ref.get();

          const items = [];
          data.docs.forEach(item=>{
              items.push({id:item.id,...item.data()});
            });
            setTopics(items);
            console.log("fetching topics success ended:", items);

            return items;
        }catch(err){
          console.log(err);
        }
} 
const fetchSelectedVisionDB=async()=>{
    
    try {
          //console.log("fetch vision started of year ", typeof year, year);

          var doc = await user_ref.get();
          if(doc===undefined) return null;
          else{
              var item = {id:doc.id,...doc.data()};
              setSelectedVision(item);
              console.log("selectedVision successfully fetched: "+doc.data().finance);
              return item;
          }
        }catch(err){
          console.log(err);
        }
}
function initiateImages(topics_quick,vision){
    var items = [];
    for (let index = 0; index < topics_quick.length; index++) {
      
        const photo = {
                          key:index,
                          alt:topics_quick[index].id,
                          src:vision[topics_quick[index].id+"-url"],
                          width:1,
                          height:1
        };
        items.push(photo);
        console.log("photo: ",photo);
    }
    console.log("placeholders added to images: ",items);

    return items;
}
const fetchAllDB = async() =>
{
    //setLoading(true);
    var vision = await fetchSelectedVisionDB();
    console.log("vision", vision);
    var tpcs = await fetchTopicsDB();
    console.log("items", tpcs);

    var photos = await initiateImages(tpcs,vision);
    setImages(photos);
    //should be changed to milestones instead of years
    //fetchYearsDB();
    //fetchSelectedVisionDB(maxYear);
    
    //fetchImagesDB(photos);
    //setLoading(false);
}
function galleryClickView(event){

    setSelectedTopic(event.target.alt);

    console.log("selected topic: " + event.target.alt);
    console.log("vision:"+selectedVision);
    console.log("vision topic desc:"+selectedVision[event.target.alt]);

    if((typeof selectedVision[event.target.alt])==='undefined')
    {
      console.log("undefined catcher");
    } else {
      console.log("yes desc exists");
    }
  
}
const  browseImage = async(event)=>{

      var topic = event.target.id;
      var file = event.target.files[0];

      if(file===null) return;

      if(window.confirm("Are you sure to change the picture?"))
      {
          setLoadingPix(true);
          var url = await storeImageDB(file,topic,currentUser.uid,maxYear);
          await updateImageURLDB(topic,url);
          var temp=images;
          var index = getIndex(temp,topic)
          temp[index].src=url;
          setImages(temp);
          setLoadingPix(false);
          console.log("temp",temp);
          console.log("index",index);
          console.log("images",images);

      }

}
function getIndex(array,name){
    for (let index = 0; index < array.length; index++) {
      if(array[index].alt===name)
      {
        return index;
      }
    }
}
const updateImageURLDB=async(topic,url)=>{
  try {
          var key = topic+"-url";
          console.log("update vision started :", key,url);
          user_ref.update({[key]:url},{merge:true}).then(()=>{
                  console.log("image url is updated", key, url);
                  return true;
              });

      }catch(err){
      console.log(err);
      }
} 
const storeImageDB = async(file,topic,userID,year) => {
    console.log("image file name: " + file);
    if(file){
    const uploadTask = await storage.ref(`/images/${userID}/${year}/${topic}`).put(file);

    var url = await storage.ref(`/images/${userID}/${year}`).child(topic).getDownloadURL();
    console.log("url", url);
    return url;}
}
const TopicsGallery = () =>(
    <div id="gallery-placeholder">
        <GridList cellHeight={150} cols={2} autoFocus>
            {images.map((image) => (
            <GridListTile key={image.key} cols={1}
                style={selectedTopic===image.alt ? {border: '2px solid #021a40', borderRadius: "5px"}: {}}>
              <img src={image.src} alt={image.alt}
              onClick={galleryClickView}
              />
              <GridListTileBar
                title={image.alt.toUpperCase()}
                titlePosition="bottom"
                actionPosition="right"
                //className={classes.titleBar}
                className={selectedTopic===image.alt ? classes.titleBarSelected : classes.titleBar}
                actionIcon={
                    <div class="image-upload">
                        <label for={image.alt}>
                          <PublishIcon className={classes.browseIcon} />
                        </label>
                        <input id={image.alt} type="file" style={{display: "none"}}
                          onChange={(e)=>browseImage(e)}/>
                    </div>
                }
              />
            </GridListTile>
          ))}
        </GridList>
    </div> 
  )

const Details = () =>(
    <div id="details">
        <br/>
        <StyledPaper  message={selectedTopic.toUpperCase() + " in words"}
            actionIcon={<Icon><img alt="" src={(images.find(item => item.alt===selectedTopic)).src} style={{width:"40px",height:"40px", marginTop:"10px", border: "0px solid white", borderRadius:'50%'}} /></Icon>}>
            <Textual  topic={selectedTopic} user_ref={user_ref}/>
        </StyledPaper>

        <StyledPaper message={selectedTopic.toUpperCase() + " in numbers"}
            actionIcon={<Icon><img alt="" src={(images.find(item => item.alt===selectedTopic)).src} style={{width:"40px",height:"40px", marginTop:"10px", border: "0px solid white", borderRadius:'50%'}} /></Icon>}>
            <Quantitative topic={selectedTopic} 
                userID={currentUser.uid} user_ref={user_ref}/>
        </StyledPaper>  
      </div>    
  )

function pdfClick() {

      history.push({
        pathname: "/export",
        state: { "year":maxYear,"vision": createVisionObject() }
      });

/*     <VisionPDF year={maxYear} vision={createVisionObject()} />
 */
}
const VisionBoard = () => (

    <StyledPaper message={"Vision Board " + maxYear}
         actionIcon={<IconButton onClick={pdfClick} style={{border: "2px solid white"}}><PictureAsPdf style={{color:"white"}}/></IconButton>}>

            {loadingPix
                  ? <CircularProgress /> 
                  : <div>
{/*                         <Box m={1}>
                            <VisionPDF year={maxYear} vision={createVisionObject()} />
                        </Box> */}
                        <TopicsGallery />

                        { selectedTopic==="" 
                            ? <Box p={1}>
{/*                                   <Typography align="center">Click on images</Typography> 
 */}
                                      <Alert severity="info">Click on images for details.</Alert>
                              </Box>
                            : <Details />
                        }
                    </div>
              }         

    </StyledPaper>

)

function createVisionObject(){
    var item = [];
    for (let index = 0; index < topics.length; index++) {
      const topic = topics[index];
      const image = selectedVision[topic.id+"-url"];
      const desc = selectedVision[topic.id];
      item.push({"topic":topic.id,"image":image,"desc":desc});
    }
    console.log("visionObject",item);
    return item;
}
return (
  <div className={classes.root}>
            <VisionBoard />
  </div>);
}
export default withRouter(Vision);