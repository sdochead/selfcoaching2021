import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { PDFViewer,PDFDownloadLink } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';

import { useHistory, useLocation, withRouter } from 'react-router-dom';

import { Document, Page, Text, View,Image, StyleSheet } from '@react-pdf/renderer';
import { Box, Button, Checkbox, CircularProgress, Fab, FormControlLabel, Icon, IconButton, Typography } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import {  PictureAsPdf, PictureAsPdfOutlined, PictureAsPdfRounded, PictureAsPdfSharp } from '@material-ui/icons';
import StyledPaper from './StyledPaper';

// Create styles
const stylesXX = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  sectionOdd: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    backgroundColor: '#ccff33'
  },
  sectionEven: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    backgroundColor: '#ffccff'
  },
  button:{
    textDecoration:'none'
  }
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#ffffff"
    },
    section: {
        margin: 10,
        padding: 10
    },
    sectionOdd: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#ccff33'
      },
    sectionEven: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
        backgroundColor: '#ffccff'
      },    
    header: {
        backgroundColor: "#f6f6f5",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: 5
    },
    topicContainer: {
        display: "flex",
        flexDirection: "row",
        marginLeft: 5
    },
    overviewContainer: {
        display: "flex",
        flexDirection: "row",
        //justifyContent: "center",
        marginLeft: 5
    },    
    title: {
        fontSize: 20,
        marginBottom: 10,
        fontweight: "bold"
    },
    overview: {
        fontSize: 14
    },

    image: {
        height: 200,
        width: 200
    },
    subtitle: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        width: 150,
        alignItems: "center",
        marginBottom: 12
    },
    vote: {
        display: "flex",
        flexDirection: "row"
    },
    rating: {
        height: 10,
        width: 10
    },
    vote_text: {
        fontSize: 10
    },
    vote_pop: {
        fontSize: 10,
        padding: 2,
        backgroundColor: "#61C74F",
        color: "#fff"
    },
    vote_pop_text: {
        fontSize: 10,
        marginLeft: 4
    },
    detailsFooter: {
        display: "flex",
        flexDirection: "row"
    },
    lang: {
        fontSize: 8,
        fontWeight: 700
    },
    vote_average: {
        fontSize: 8,
        marginLeft: 4,
        fontWeight: "bold"
    },
    body: {
        padding: 10
      },
    table: { 
        display: "table", 
        width: "auto", 
        borderStyle: "solid", 
        borderColor: '#bfbfbf',
        borderWidth: 1, 
        borderRightWidth: 0, 
        borderBottomWidth: 0 
      }, 
      tableRow: { 
        margin: "auto", 
        flexDirection: "row" 
      }, 
      tableColHeader: { 
        width: "25%", 
        borderStyle: "solid", 
        borderColor: '#bfbfbf',
        borderBottomColor: '#000',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0
      },   
      tableCol: { 
        width: "25%", 
        borderStyle: "solid", 
        borderColor: '#bfbfbf',
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderTopWidth: 0 
      }, 
      tableCellHeader: {
        margin: "auto", 
        margin: 5, 
        fontSize: 12,
        fontWeight: 500
      },  
      tableCell: { 
        margin: "auto", 
        margin: 5, 
        fontSize: 10 
      }
  
});



export default function VisionPDF(props)
{

const location = useLocation();  
//    const {year,topics,images,descs,metrics} = props;
const {year,vision} = location.state;

console.log("vision pdf");
console.log("year",year);
console.log("vision",vision);


const [checkBoxes,setCheckBoxes]=useState([]);

function populateCheckArray(){

  var temp=[];
  vision.forEach(element => {
    temp.push({"id":element.topic,value:true});
  });
  setCheckBoxes(temp);

}

useEffect(()=>{
  populateCheckArray();
},[])

function checkBoxClick(event){
    console.log(event.target.id);
    console.log(event.target.checked);

    var temp=[];
    checkBoxes.forEach(element => {
        if(element.id===event.target.id){
            element.value=event.target.checked;
        }
        temp.push(element);

    });

    setCheckBoxes(temp);
}

const D = () => (
    <Document>
      <Page style={styles.body}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Product</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Type</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Period</Text> 
            </View> 
            <View style={styles.tableColHeader}> 
              <Text style={styles.tableCellHeader}>Price</Text> 
            </View> 
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>React-PDF</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>3</Text> 
            </View> 
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text> 
            </View>
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>5€</Text> 
            </View> 
          </View> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Another row</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo D.
          Quijote de la Mancha</Text> 
            </View> 
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>2019-05-20 - 2020-07-19</Text> 
            </View>
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>25€</Text> 
            </View> 
          </View>        
        </View>
      </Page>
    </Document>
  );

const PicMosaic = () =>
  (
    <View style={styles.table}> 
        <View style={styles.tableRow}> 
            {vision&&
                vision.map((item,index) => {
                    return (
                            <View key={index} style={styles.tableColHeader}> 
                                <Image  style={styles.body}  source={item.image}/> 
                            </View> 
                    )
                })
            }
        </View>
    </View>

  )

const VisionAsPDF = (props) => {

  return(

            <Document>
                <Page style={styles.page}>

                    <View style={styles.header}>
                        <Text style={styles.title}> Vision Board for {year}</Text>
                    </View>

                    <PicMosaic />

                    {vision
                        ? vision.map((item, index) => {
                                return (
                                    <View style={index%2===1 ? styles.sectionOdd : styles.sectionEven}>
                                        <View key={"text"+index} style={styles.topicContainer}>
                                            <Text style={styles.title}>{(index+1)+". "+item.topic}</Text>
                                        </View>
                                        <View key={"image"+index} style={styles.overviewContainer}>
                                            <Image
                                                style={styles.image}
                                                source={item.image}
                                            /> 
                                            <View style={styles.overviewContainer}>
                                                <Text style={styles.overview}>Description: {item.desc}</Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        : null
                    }
                </Page>
            </Document>
       
/*         <Document>
            <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Section #1</Text>
            </View>
            <View style={styles.section}>
                <Text>Section #2</Text>
            </View>
            </Page>

        </Document> */
)
}

    return(

          <StyledPaper message="Customization">

          <Box m={1}>
              {
                  checkBoxes.map((item,index)=>{
                    return  <Box>
                                <FormControlLabel control={<Checkbox checked={item.value} onChange={checkBoxClick} id={item.id}/>} label={item.id} />
                            </Box>
              })}
          </Box>

             <PDFDownloadLink document={<VisionAsPDF />} style={styles.button} fileName="myvision.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? <CircularProgress /> :           
                            <Button variant="contained" color="primary"> Save As PDF </Button>
                }
            </PDFDownloadLink> 
          
          </StyledPaper>

    );
}

