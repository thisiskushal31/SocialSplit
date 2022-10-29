import React from 'react';
import { Route } from 'react-router-dom';

const ProtectedRoute = ({ before: Login, after: Join, user, ...rest }) => {
  return (
      <Route {...rest} render={
        props => { return user && user.username ?
          <Join nickname={user.nickname} {...rest} {...props}/> :
          <Login {...props} {...rest}/>
      }} />
  );
}

export default ProtectedRoute;
