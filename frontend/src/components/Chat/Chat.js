/*Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>*/
import React, { useState, useEffect } from 'react';

import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

export default function Chat({ nickname, room, icon, handleLeave, socket }) {
  const [publicMessage, setPublicMessage] = useState('');   // current public message to be sent
  const [publicMessages, setPublicMessages] = useState([]); // public messages record

  useEffect(() => {
    if(!socket) return;

    if(window.performance) {
      // rejoin the room on a page refresh or join the room on first visit
      if (performance.navigation.type === 1 || performance.navigation.type === 0) {
        socket.emit('join', {nickname, room, icon}, (error) => {
          if(error) {
            alert(error)
            window.location = '/';
          }
        });
      }
    }

  }, [socket, nickname, room]);

  useEffect(() => {
    if(!socket) return;
    socket.on('message', (message) => {
      setPublicMessages(publicMessages => [...publicMessages, message]);
    })
  }, [socket]);

  // sending public messages
  const sendPublicMessage = ({e}) => {
    e.preventDefault();

    if(publicMessage) {
      socket.emit('sendMessage', publicMessage, () => setPublicMessage(''));
    }
  }

  return (
    <React.Fragment>
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} handleLeave={handleLeave}/>
          <Messages messages={publicMessages} name={nickname} icon={icon}/>
          <Input
            message={publicMessage}
            setMessage={setPublicMessage}
            sendMessage={sendPublicMessage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
