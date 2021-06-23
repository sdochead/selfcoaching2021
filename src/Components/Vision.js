import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, FormControlLabel, FormLabel, Grid, GridList, GridListTile, GridListTileBar, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Radio, RadioGroup, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import Gallery from 'react-photo-gallery';
import { DirectionsRun, Edit, Photo, Delete, Add, PhotoAlbum, PhotoAlbumRounded, PhotoAlbumOutlined, PhotoAlbumTwoTone, FormatUnderlined } from '@material-ui/icons';
import Textual from './Textual.js'
import Visual from './Visual.js'
import Quantitative from './Quantitative';
import { blue } from '@material-ui/core/colors';
import StyledPaper from './StyledPaper';
import Calendar from 'react-calendar';
import VisionPDF from './VisionPDF';


const visionboardDefaultPlaceholder = 'https://www.emetabolic.com/media/pcon/vision-board-mrc-socialmedia-2089.jpg';
const minYear = new Date().getFullYear();

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
    color : "white"
},  

}));

const Vision = props => {

  const history = useHistory();

  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);
  const location  = useLocation();
  const maxYear = location.state.maxYear;

  console.log("maxYear =" , maxYear);


  //db ref
   const user_ref=firebase.firestore().collection("Users").doc(currentUser.uid);

  const expectedMetrics_ref=firebase.firestore().collection("ExpectedMetrics");

  const [topics,setTopics]=useState([]);
  const [visions,setVisions]=useState([]);
//  const [visionDesc,setVisionDesc]=useState("");
//  const [uploadedFile,setUploadedFile] = useState(null);
  const [images,setImages]=useState([]);
  const [selectedTopic,setSelectedTopic]=useState("");
//  const [selectedURL,setSelectedURL]=useState("");

  const [selectedVision,setSelectedVision]=useState(null);
  const [selectedYear,setSelectedYear]=useState(0);
  const [newYear,setNewYear]=useState(minYear);
  const [sliderYears,setSliderYears]=useState([]);
  const [selectedMetrics,setSelectedMetrics]=useState([]);

//loading semaphors  
  const [loadingPix, setLoadingPix] = useState(false);
  const [loading, setLoading] = useState(false);
  
//dialog variables  
  const [openYearDialog,setOpenYearDialog]=useState(false);

  const [showC2,setShowC2]=useState(true);


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

/*   function changeInTopic(){

    resetView();

    fetchSelectedVisionDB(selectedYear);
    fetchImagesDB(selectedYear);
    fetchExpectedMetricsDB(selectedYear);

  } */
  function refreshAfterYearDeletion(){
    setSelectedYear(0)
    //fetchYearsDB()
    setSelectedTopic("");
    setImages([]);
  }
  const existSuchYear=(year)=>{

    for (let index = 0; index < visions.length; index++) {
      if(visions[index].id===year) return true;
    }
    return false;
  }

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
  const fetchExpectedMetricsDB=async(year)=>{

          console.log("fetch metrics started of year ", typeof year, year);
          expectedMetrics_ref.where("year", "==", year)
          .where("userID","==",currentUser.uid).get()
          .then((querySnapshot) => {
            var items=[];
            querySnapshot.forEach((item) => {
              items.push({id:item.id,...item.data()});
              console.log("selectedMetric successfully fetched: "+item);
            });
            setSelectedMetrics(items);
          })
          .catch((err)=>{
          console.log(err);
        });
  } 
/*   const fetchYearsDB=async()=>{
    try {
          console.log("fetch vision started");
          const data=await visions_ref.get();
//          console.log(data);
          const yrs=[];
          const items = [];
          data.docs.forEach(item=>{
              yrs.push({value:item.id,label:''+item.id});
              if(maxYear<item.id) setFinalYear(item.id);
              items.push({id:item.id,...item.data()});
            });
            setSliderYears(yrs);
            setVisions(items);
          console.log(items);
        }catch(err){
          console.log(err);
        }
  }  */
  const getPhotosDB=async(res,placeholders)=>{
    var items = placeholders;

    try {

        const promises = res.items.map((itemRef)=> getImageURLDB(itemRef));
        console.log("promises are produced. number of promises=", promises.length);

        if(promises.length===0) return placeholders;
      
        const urls = await Promise.all(promises);
        console.log("urls " + urls + urls.length);

        urls.forEach((x)=>{
          for (let index = 0; index < topics.length; index++) {
            if(topics[index].id===x.alt)
            {
              items[index]=x;
              console.log("index: "+items[index]);
            }
            console.log("item " + items[index].src);
          }
        });

    } catch (error) {
        console.log(error);
    }
    return items;
  }
  const getImageURLDB=async(itemRef)=>{

      var metadata = await itemRef.getMetadata();
      var name = await metadata.name;
      console.log(name);
          
      var photo =  {src:"",alt:name,width:1,height:1};
      photo.src = await itemRef.getDownloadURL();
      return photo;
  }
/*   const deleteVisionDB=(year)=>{
    visions_ref.doc(year).delete().then(() => {
      console.log(year," successfully deleted!");
      deleteImagesDB(year);
      
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
  } */
/*   function deleteImagesDB(year){
    var ref = storage.ref(`/images/${currentUser.uid}/${year}`);
    ref.listAll()
      .then((res) => {
      res.items.forEach((itemRef) => {
        itemRef.delete().then(() => {
          console.log("File deleted successfully");
          setSelectedVision(null);
          setSelectedYear(0);
        }).catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error);
        });
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  
  } */


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

  function addImagePlaceholders2VisionXX(topics_quick,vision_quick){
    var item = vision_quick;
    for (let index = 0; index < topics_quick.length; index++) {
        var key = topics_quick[index].id+"-url";
        
        item[key] = topics_quick[index].placeholder;
        console.log("vision_quick",item[key]);
    }
    return item;

  }

  function initiateImagesByPlaceholdersX(topics_quick){
    var items = [];
    for (let index = 0; index < topics_quick.length; index++) {
      
        const photo = {
                          key:index,
                          alt:topics_quick[index].id,
                          src:topics_quick[index].placeholder,
                          width:1,
                          height:1
        };
        items.push(photo);
        console.log("photo: ",photo);
    }
    console.log("placeholders added to images: ",items);

    return items;
  }
  const fetchImagesDB=async(placeholders)=>{
  }


  const fetchImageStorage=async(placeholders)=>{

    var year = maxYear;
    console.log("fetch images started");
    setLoadingPix(true);

    // Create a reference under which you want to list
    var listRef = storage.ref().child(`/images/${currentUser.uid}/${year}`);
    console.log("year: "+year);
    console.log("about to get image list: ",listRef);

    var res = await listRef.listAll();
    console.log("res of image loading :", res);
    var items = await getPhotosDB(res,placeholders);
    await setImages(items);
    await setLoadingPix(false);
    await console.log("loading images ended. images: ", items);
  }
  const fetchAllDB = async() =>
  {
    setLoading(true);
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
    setLoading(false);
  }
/*   const storeNewYearDB = async(year)=>
  {
    try {
     var item = {}
    for (let index = 0; index < topics.length; index++) {
      item[topics[index].id] = "";
//      item[topics[index].id+"metrics"] = null;
      console.log("this topic added ", topics[index]);
    } 

        console.log("add vision started", item);

        var yearString = year+"";
        visions_ref.doc(yearString).set(item).then(()=>{
          console.log("vision created:", yearString);
        });

    }catch(err){
        console.log("storeNewYearDB failed:",err);
      }    
  } */

////////////////View////////////////


/*   function resetView(){
        //reset selected topic in gallery
        setSelectedTopic("");
//        setSelectedURL("");
    
        // reset topic info
//        setVisionDesc("");
//        setUploadedFile(null);
    
        setImages([]);
  } */
/*   const yearClickView=(data)=>{
    
      console.log(data);

      var year = data.id;
      console.log("year click started");

      afterYearChangeView(year);

      console.log("year click ended");


  }
  function afterYearChangeView(year){

    setSelectedYear(year);

    setSelectedTopic("");
      
    fetchImagesDB(year);
    fetchSelectedVisionDB(year);
    fetchExpectedMetricsDB(year);

  }

  function afterYearAddedView(year){

    setSelectedYear(year);
    //fetchYearsDB()

    setSelectedTopic("");
      
    fetchImagesDB(year);
    fetchSelectedVisionDB(year);
    fetchExpectedMetricsDB(year);

  }

  const closeYearDialogView = () => {
    setOpenYearDialog(false);
  }; */

  function galleryClickView(event){

    setSelectedTopic(event.target.alt);
 //   setSelectedURL(event.target.src);

    console.log("selected topic: " + event.target.alt);


    console.log("vision:"+selectedVision);

    console.log("vision topic desc:"+selectedVision[event.target.alt]);

    if((typeof selectedVision[event.target.alt])==='undefined')
    {
      console.log("undefined catcher");
//      setVisionDesc("");
    } else {
      console.log("yes desc exists");
//      setVisionDesc(selectedVision[event.target.alt]);
//      fetchExpectedMetrics(selectedYear);
    }
  
  }
/*   function negateChipView(){
    if(window.confirm("You are deleting the vision of " + selectedYear + ".\n Are you sure to continue?",))
    {
        deleteVisionDB(selectedYear);
        refreshAfterYearDeletion();
    }
  }
  function plusChipView()
  {
    setOpenYearDialog(true);
  } */
/*   const yearDialogTextView = (value) => {
      setNewYear(value.getFullYear());
       // console.log("yearDialogTextView  ",value);
      console.log("yearDialogTextView value " , value.getFullYear());
  };
  function goDialogView(){
      if(existSuchYear(newYear))
          alert("You already started envisioning this year.");
      else {
        storeNewYearDB(newYear);
        closeYearDialogView();
        afterYearAddedView(newYear);
        //refreshAfterYearDeletion(newYear);
      }

  } */
/*   const sliderChangeView = (event,val) => {
    console.log("event.target.value",val);
    afterYearChangeView(val+'');
    
  }; */

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
    return url;
  }}

  function Timeline(){
    return(
  
      loading ? <CircularProgress justify="center"/> 
         :
            <StyledPaper message="Timeline">
  
  {/*               <YearsSlider />
  
                <YearsChips />
  
                {(fixed_milestones 
                    ?   null
                    :
                    <>
                        <AddYearChip />
                        
                        <ChooseDateDialog />
  
                        {
                            selectedYear===0 
                            ? console.log("negateChip not shown") 
                            : <RemoveYearChip />
                        }
                    </>
                )}
   */}
            </StyledPaper>
      
      );}

  const TopicsGallery = () =>
  (
    <div id="gallery-placeholder">
        <GridList cellHeight={150} className={classes.gridList} cols={2} autoFocus>
            {images.map((image) => (
            <GridListTile key={image.key} cols={1}>
              <img src={image.src} alt={image.alt}
              onClick={galleryClickView}
              style={selectedTopic===image.alt ? {border: '1px solid #021a40' }: {}}
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
                          <PhotoAlbum className={classes.browseIcon} />
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

  const Details = () =>
  (
    <div id="details">
        <br/>
{/*         <StyledPaper message={"Visual " + selectedTopic}>
              <Visual year={selectedYear} topic={selectedTopic} userID={currentUser.uid}/>
        </StyledPaper> */}
        <StyledPaper  message={selectedTopic.toUpperCase() + " in words"}>
              <Textual year={selectedYear} topic={selectedTopic} user_ref={user_ref}/>
        </StyledPaper>
        <StyledPaper message={selectedTopic.toUpperCase() + " in numbers"}>
              <Quantitative year={selectedYear} topic={selectedTopic} 
                  userID={currentUser.uid} user_ref={user_ref}/>
        </StyledPaper>
{/*         <Timeline/>
 */}    
      </div>    
  )


const VisionBoard = () => (

    <StyledPaper message={"Vision Board " + maxYear}
         actionIcon={ <VisionPDF year={maxYear} vision={createVisionObject()} />}>

            {loadingPix
                  ? <CircularProgress /> 
                  : <div>
{/*                         <Box m={1}>
                            <VisionPDF year={maxYear} vision={createVisionObject()} />
                        </Box> */}
                        <TopicsGallery />
                        { selectedTopic==="" 
                            ? <Box p={1}>
                                  <Typography align="center">Click on images</Typography> 
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
      item.push({topic:topic.id,image,desc});
    }
    console.log("visionObject",item);
    return item;
}

return (

      <div className={classes.root}>
            <VisionBoard />
      </div>
        );    

}
export default withRouter(Vision);


/*   function YearsSlider(){
  return (
    <>
        {visions.length===0 
            ? console.log("no vision yet",visions.length ) 
            :
            <div className={classes.sliderLimit}>
              <br/>
              <br/>
              <Slider className={classes.slider}
                value={selectedYear}
                //getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="on"
                step={null}
                marks={sliderYears}
                min={minYear}
                max={maxYear}
                onChange={(e,v)=>sliderChangeView(e,v)} 
              />
          </div> 
      }
  </>
  )} */

/*   const ChooseDateDialog = () =>
  (
      <Dialog open={openYearDialog} onClose={closeYearDialogView} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Year</DialogTitle>
          <DialogContent>
              <Calendar minDate={new Date(minYear+1,1,1)} maxDate={new Date(maxYear-1,1,1)} onClickYear={yearDialogTextView} view="decade"/>
          </DialogContent>
          <DialogActions>
              <Button onClick={closeYearDialogView} color="primary">
                  Cancel
              </Button>
              <Button onClick={goDialogView} color="primary">
                  Go
              </Button>
          </DialogActions>
      </Dialog>    
  )
 
  const YearsChips = () =>
  (
      visions.map((data,index) => {
      return (
          <Chip
            color = {(data.id===selectedYear ? 'primary' : 'default')}
            id ={index}
            label={data.id}
            onClick={(e)=>yearClickView(data)}
            className={classes.chip}
          />
      );
    })
  )

  /* const RemoveYearChip = () => 
  (
    <Chip
        id ={visions.length+1}
        label={'-'}
        onClick={negateChipView}
        className={classes.chip}
        color = 'secondary'
    />    
  )
 */
/*   const AddYearChip = () => 
    (<Chip
        id ={visions.length}
        label={'+'}
        onClick={plusChipView}
        className={classes.chip}
    />);
 */
