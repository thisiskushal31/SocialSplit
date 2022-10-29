/*
<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
*/

import React from 'react';
import { Link } from 'react-router-dom';
import './InfoBar.css';

import { ReactComponent as OnlineIcon } from '../../icons/online.svg';
import { ReactComponent as CloseIcon } from '../../icons/cancel.svg';

// 'close' is for closing the private chat window while 'handleLeave' is for public chat window
export default function InfoBar({ room, close, handleLeave }) {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <OnlineIcon className="onlineIcon" />
        <h3>{room}</h3>
      </div>
      <div className="rightInnerContainer">
        {
          close ?  <span onClick={() => close(null)}><CloseIcon className="closeIcon"/></span>
          : <Link to={'/'} onClick={handleLeave}><CloseIcon className="closeIcon"/></Link>
        }
      </div>
    </div>
  );
}
