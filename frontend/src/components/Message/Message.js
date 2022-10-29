//<div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

import React from 'react';
import './Message.css';
import ReactEmoji from 'react-emoji';

import { ReactComponent as Admin} from '../../icons/admin.svg';

import { GetIcon } from '../Helpers/GetPic';

/*
  user could be other users' name while name is the current user's name.
*/
export default function Message({ message: {user, text, icon}, name, myIcon }) {
  let isSentByCurrentUser = false;
  //const trimmedName = name.trim().toLowerCase();

  if(user === name) {
    isSentByCurrentUser = true;
  }

  return (
    /* texts sent by the current user */
    isSentByCurrentUser ?
      (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{name}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
          </div>
          <span style={{'paddingLeft': '5px'}}>{GetIcon(myIcon)}</span>
        </div>
      )
      : /* texts sent by the other users */
      (
        <div className="messageContainer justifyStart">
          {user === 'Admin' ? <Admin className="admin" /> :<span style={{'paddingRight': '5px'}}>{GetIcon(icon)}</span>}
          <div className="messageBox backgroundLight">
            <p className={user === 'Admin' ? "messageText colorDark announce" : "messageText colorDark"}>{ReactEmoji.emojify(text)}</p>
          </div>
          <p className="sentText pl-10">{user}</p>
        </div>
      )
  );
}
