import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./Auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser} = useContext(AuthContext);

  console.log("PrivateRoute component ");
  console.log("currentuser is:" + currentUser);

  if (!currentUser) {
    console.log("no user therefor redirect to signin");
    return <Redirect to="/signin" />;
  } 

  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/signin"} />
        )
      }
    />
  );
};


export default PrivateRoute