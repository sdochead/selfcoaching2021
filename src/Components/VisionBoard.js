import React,{useState,useEffect,useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../firebase';
import { AuthContext } from "./Auth.js";
import PropTypes from 'prop-types';
import { AppBar, Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, FormControl, FormControlLabel, Grid, GridList, GridListTile, GridListTileBar, IconButton, Input, InputLabel, List, ListItem, ListItemAvatar, ListItemIcon, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, Select, Slider, Switch, Tab, Tabs, TextField, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { storage } from "../firebase";
import Gallery from 'react-photo-gallery';
import { DirectionsRun, Edit, Photo, Delete, Add } from '@material-ui/icons';
import Textual from './Textual.js'
import Visual from './Visual.js'
import Quantitative from './Quantitative';


const visionboardDefaultPlaceholder = 'https://www.emetabolic.com/media/pcon/vision-board-mrc-socialmedia-2089.jpg';
const minYear = 2021;
const maxYear = 2050;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

}));

const VisionBoard = props => {

  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);

  //db ref
  const visions_ref=firebase.firestore().collection("Users").doc(currentUser.uid).collection("visions"); 
  const expectedMetrics_ref=firebase.firestore().collection("ExpectedMetrics");

  // which tab to show 
  const [tabValue,setTabValue]=useState(0);

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
  }, []);

/*   function changeInTopic(){

    resetView();

    fetchSelectedVisionDB(selectedYear);
    fetchImagesDB(selectedYear);
    fetchExpectedMetricsDB(selectedYear);

  } */
  function refreshAfterYearDeletion(){
    setSelectedYear(0)
    fetchYearsDB()
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
  const fetchTopicsDB=async()=>{
    try {
          console.log("fetch topics started");
          const topics_ref=firebase.firestore().collection("Topics");
          const data=await topics_ref.get();

          const items = [];
          data.docs.forEach(item=>{
              items.push({id:item.id,...item.data()});
            });
            setTopics(items);
//            console.log(item);
        }catch(err){
          console.log(err);
        }
  } 
  const fetchSelectedVisionDB=async(year)=>{
    try {
          console.log("fetch vision started of year ", typeof year, year);
          visions_ref.doc(year).get().then((item)=>{
              setSelectedVision({id:item.id,...item.data()});
              console.log("selectedVision successfully fetched: "+item);
            });
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
  const fetchYearsDB=async()=>{
    try {
          console.log("fetch vision started");
          const data=await visions_ref.get();
//          console.log(data);
          const yrs=[];
          const items = [];
          data.docs.forEach(item=>{
              yrs.push({value:item.id,label:''+item.id});
              items.push({id:item.id,...item.data()});
            });
            setSliderYears(yrs);
            setVisions(items);
//          console.log(item);
        }catch(err){
          console.log(err);
        }
  } 
  const getPhotosDB=async(res)=>{
    
    var items = [];
    for (let index = 0; index < topics.length; index++) {
      const photo = {key:index,alt:topics[index].id,src:topics[index].placeholder,width:1,height:1};
      items.push(photo);
    }

    try {

        const promises = res.items.map((itemRef)=> getImageURLDB(itemRef));

        const urls = await Promise.all(promises);
        console.log("urls " + urls);

        await urls.forEach((x)=>{
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
  const deleteVisionDB=(year)=>{
    visions_ref.doc(year).delete().then(() => {
      console.log(year," successfully deleted!");
      deleteImagesDB(year);
      
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
  }
  function deleteImagesDB(year){
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
  
  }
  const fetchImagesDB=async(year)=>{

    console.log("fetch images started");
    setLoadingPix(true);

    // Create a reference under which you want to list
    var listRef = storage.ref().child(`/images/${currentUser.uid}/${year}`);
    console.log("year: "+year);
    console.log(listRef);

    var res = await listRef.listAll();
    var items = await getPhotosDB(res);
    await setImages(items);
    await setLoadingPix(false);
    console.log("ended 1");
    console.log("ended 2");

  }
  function fetchAllDB()
  {
    setLoading(true);
    fetchTopicsDB();
    fetchYearsDB();
    fetchImagesDB(selectedYear);
    setLoading(false);
  }
  const storeNewYearDB = async()=>
  {
    try {
     var item = {}
    for (let index = 0; index < topics.length; index++) {
      item[topics[index].id] = "";
//      item[topics[index].id+"metrics"] = null;
      console.log("this topic created ", topics[index]);
    } 

        console.log("add vision started", item);
        visions_ref.doc(newYear).set(item);

    }catch(err){
        console.log(err);
      }    
  }

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
  const yearClickView=(data)=>{
    
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
    fetchYearsDB()

    setSelectedTopic("");
      
    fetchImagesDB(year);
    fetchSelectedVisionDB(year);
    fetchExpectedMetricsDB(year);

  }

  const closeYearDialogView = () => {
    setOpenYearDialog(false);
  };

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
  function negateChipView(){
    if(window.confirm("You are deleting the vision of " + selectedYear + ".\n Are you sure to continue?",))
    {
        deleteVisionDB(selectedYear);
        refreshAfterYearDeletion();
    }
  }
  function plusChipView()
  {
    setOpenYearDialog(true);
  }
  const yearDialogTextView = (event) => {
   setNewYear(event.target.value);
//   console.log(event.target.value);
  };
  function goDialogView(){
      if(existSuchYear(newYear)) 
          alert("You already started envisioning this year.");
      else {
        storeNewYearDB();
        closeYearDialogView();
        afterYearAddedView(newYear);
        //refreshAfterYearDeletion(newYear);
      }

  }
  const sliderChangeView = (event,val) => {
    console.log("event.target.value",val);
    afterYearChangeView(val+'');
    
  };
  const tabChangeView = (event, newValue) => {
    setTabValue(newValue);
  };

  const C2 = () => (
    <div id="c1">
          <Paper  className={classes.paper}>
          <AppBar p={1} position="static"  className={classes.header}>   
                <Typography p={1} >Vision Board </Typography>                  
            </AppBar>
          {   loadingPix ? <CircularProgress /> :
              (images.length===0 ? 
               <Gallery photos={[{src:visionboardDefaultPlaceholder,alt:"Click on a year above"}]}
               direction={"column"} columns={1} 
               onClick={()=>alert("Click on a year above")}/>  :
              <div>
{/*                   <Gallery photos={images} direction={"column"} columns={2} onClick={galleryClickView}/>
 */} 
               <div id="gallery-placeholder">
                <GridList cellHeight={160} className={classes.gridList} cols={2} autoFocus>
                    {images.map((image) => (
                    <GridListTile key={image.key} cols={1}>
                      <img src={image.src} alt={image.alt}
                       onClick={galleryClickView}
                       style={selectedTopic===image.alt ? {border: '5px solid #021a40' }: {}}
                      />
                      <GridListTileBar
                        title={image.alt}
                        titlePosition="bottom"
                        actionPosition="left"
                        className={classes.titleBar}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </div> 
                  {
                  selectedTopic==="" ? <Typography>Click on images for details</Typography> :
                  <div id="details"  m={1}>
<br/>

                        <AppBar  position="static" className={classes.headerDetails}>  
                        <Typography> {"<<"} {selectedTopic} in {selectedVision.id} {">>"} </Typography>                        
                        <Tabs
                              value={tabValue}
                              onChange={tabChangeView}
                              variant="fullWidth"
                              indicatorColor="secondary"
                              textColor="default"
                              aria-label="icon label tabs example"
                            >
                              <Tab icon={<Photo />}  {...a11yProps(0)} />
                              <Tab icon={<Edit />} {...a11yProps(1)} />
                              <Tab icon={<DirectionsRun />} {...a11yProps(2)} />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={tabValue} index={0}>
                            <Visual year={selectedYear} topic={selectedTopic} userID={currentUser.uid}/>
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Textual year={selectedYear} topic={selectedTopic} userID={currentUser.uid}/>

                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            <Quantitative year={selectedYear} topic={selectedTopic} userID={currentUser.uid}/>
    
                        </TabPanel>

                      <div>
                      </div>               

                  </div>}
              </div>)
          }
          </Paper>
  
    </div>
  )

  return (
    <div className={classes.root}>

        {loading ? <CircularProgress justify="center"/> :

            <Paper  id="year-paper" className={classes.paper}>
            <AppBar p={1} position="static" className={classes.header}>   
                <Typography p={1} >TimeLine </Typography>                  
            </AppBar>

              {visions.length===0 ? console.log("no vision yet",visions.length ) :
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
            {
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
            })}

              <Chip
              id ={visions.length}
              label={'+'}
              onClick={plusChipView}
              className={classes.chip}
              />

              <Dialog open={openYearDialog} onClose={closeYearDialogView} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Year</DialogTitle>
              <DialogContent>
              <TextField
                autoFocus
                onChange={(event)=>yearDialogTextView(event)}
                margin="dense"
                id="newYear"
                label="year"
                type="number"
              />
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
    
              {selectedYear===0 ? console.log("negateChip not shown") :
                <Chip
                id ={visions.length+1}
                label={'-'}
                onClick={negateChipView}
                className={classes.chip}
                color = 'secondary'
                />}
            </Paper>
        }
        { showC2 ? <C2 /> : null }

    </div>
      );
}
export default withRouter(VisionBoard);
