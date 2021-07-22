import React, { useEffect, useState } from "react";
import firebase from '../firebase';
import {Redirect} from 'react-router-dom';
import { Box, CircularProgress } from "@material-ui/core";
 
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  console.log("AuthProvider component started...");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
        console.log("user is = "+user);
        if(!!user){
            setCurrentUser(user);
            console.log("user is in");
        }else{
            console.log("no user");
        }
        setPending(false);

      }
    );
  }, []);

  if(pending){
    //return <>Waiting to authenticate...</>
    return <Box  style={{position:"relative",width:"100%", height:"400px"}}><CircularProgress style={{position:"absolute", left:"50%" , top:"50%"}}/></Box>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};