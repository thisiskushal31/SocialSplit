import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ handleLogin, handleNameChange, handlePwdChange }) => {

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Log in</h1>
        <div><input placeholder="Username" className="joinInput" type="text" onChange={(e) => handleNameChange(e.target.value)} /></div>
        <div><input placeholder="Password" className="joinInput mt-20" type="password" onChange={(e) => handlePwdChange(e.target.value)} /></div>
        <button className="button mt-20" type="submit" onClick={(e) => handleLogin(e)}>Sign In</button>
        <Link to='/signup'>
          <button className="button mt-10" type="submit">Sign up</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
