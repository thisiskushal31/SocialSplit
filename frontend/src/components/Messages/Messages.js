import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Messages.css';

import Message from '../Message/Message';

export default function Messages({ messages, name, icon }) {
  return (
    <ScrollToBottom className="messages" mode={"bottom"}>
      {messages.map((msg, i) => <div key={i}><Message message={msg} name={name} myIcon={icon}/></div>)}
    </ScrollToBottom>
  );
}
