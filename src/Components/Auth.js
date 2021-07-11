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
    
    return <Box p={10} width="100%" justifyContent="center"><CircularProgress /></Box>
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