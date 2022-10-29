//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>

import React from 'react';
import './Input.css';

import { ReactComponent as SendIcon } from '../../icons/send.svg';

// to: to whom the private messages should send to
export default function Input({ message, setMessage, sendMessage, to}) {
  return (
    <form className="form">
      <input
        className="input"
        type="text"
        value={message}
        placeholder=""
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' ? sendMessage({e, to}) : null}
      />
      <SendIcon className="sendButton" onClick={(e) => sendMessage({e, to})}/>
    </form>
  );
}
