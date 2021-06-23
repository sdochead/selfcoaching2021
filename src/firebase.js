import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/auth'
import 'firebase/storage'


  const firebaseConfig = {
    apiKey: "AIzaSyBnHIZLpMJXQxtHh0433SCNVLXASaYZjwo",
    authDomain: "vitacoach.firebaseapp.com",
    projectId: "vitacoach",
    storageBucket: "vitacoach.appspot.com",
    messagingSenderId: "349656251768",
    appId: "1:349656251768:web:a8b237c8295870d3cd5c8d",
    measurementId: "G-XEBDPBZK7Q"
  };

  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage()

  export  {
    storage, firebase as default
  }