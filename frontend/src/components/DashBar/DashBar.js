import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import { Navbar, NavItem, DropdownMenu } from '../Navbar/Navbar';
import { FriendsList } from '../FriendList/FriendList';

import { ReactComponent as BellIcon } from '../../icons/bell.svg';
import { ReactComponent as CaretIcon } from '../../icons/caret.svg';
import { GetIcon } from '../Helpers/GetPic';
import { GetLocalStore } from '../Helpers/LocalStorage';

import './DashBar.css';

const { innerWidth: width, innerHeight: height } = window;

/* private messages record format
  {
    user1: {
      messages: [msg1,..],
      notification: some nums,
    },
    user2: {
      messages: [msg1,..],
      notification: some nums,
    },
    ...
    totalNoti: #total notification of all private unread messages
  }
*/

let open; // keep track of private chat window status

const DashBar = ({ username, nickname, icon, cur_room, socket }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState(null);
  const [people, setPeople] = useState([]);         // users in the current room
  const [privateChat, setPrivateChat] = useState(null);       // private chat
  const [privateMessage, setPrivateMessage] = useState('');   // current private message to be sent
  const [privateMessages, setPrivateMessages] = useState({totalNoti:0});

  // fetch the friends list
  useEffect(() => {
    //const token = localStorage.getItem('token');
    const token = GetLocalStore('token');
    if(!token) return;

    socket.emit('getFriends', {nickname: nickname, username: username, token: token}, (data) => {
      setFriends(data.friends);
      setRequests(data.requests);
      setAdds(data.adds);
      setPrivateMessages(prevState => ({
          ...prevState,
          totalNoti: prevState['totalNoti'] + data.requests.length,
      }));
    });

  }, [nickname, username]);


  // update the friends list when other users reconnect
  useEffect(() => {
    //const token = localStorage.getItem('token');
    const token = GetLocalStore('token');
    if(!token) return;

    socket.on("update", () => {
      socket.emit('getFriends', {nickname: nickname, username: username, token: token}, (data) => {
        setFriends(data.friends);
        setRequests(data.requests);
        setAdds(data.adds);
        updateChat(data.friends);
      });
    });

    // listener for friend request from others
    socket.on('friendReuqest', (user) => {
      console.log("got a friend request from " + user.nickname);
      setRequests(requests => [...requests, user]);
      setPrivateMessages(prevState => ({
          ...prevState,
          totalNoti: prevState['totalNoti'] + 1,
      }));
    })

    // listener for accepted request from others
    socket.on('requestAccepted', (user) => {
      console.log("friend request accepted by " + user.nickname);
      setFriends(friends => [...friends, user]);
      // let the user know his/her request is accepted
      setPrivateMessages(prevState => ({
          ...prevState,
          [user.nickname]: {
            messages: [],
            notification: 1,
          },
          totalNoti: prevState['totalNoti'] + 1,
      }));
    })
  }, []);

  // update name, room and set up listener on friend request
  useEffect(() => {
    setName(nickname);
    setRoom(cur_room);

    if(!cur_room) {
      setPeople([]);
      setPrivateChat(null);
      return;
    }

    socket.on('roomData', ({room, users}) => {
      setPeople(users);
    })
  }, [nickname, cur_room, socket]);


  useEffect(() => {
    // receive private messages and store it into memory
    socket.on('getPrivateMessage', (message) => {
      const user = message.user;
      setNewPrivateMessages(message, user);
    })
  }, [socket])

  useEffect(() => {
    open = privateChat;
  }, [privateChat])

  // the private chat window could be opening while the friend list is updated, so the private chat should be updated as well
  const updateChat = (data, isOpen = open) => {
    if(isOpen) {
      const current_chat = data.find(friend => friend && friend.nickname === isOpen.nickname);
      setPrivateChat(current_chat);
    }
  }

  // using default parameter here because isOpen will be reassigned at each call, and thus we always get updated value.
  const setNewPrivateMessages = (message, user, isOpen = open) => {
    setPrivateMessages(prevState => ({
        ...prevState,
        [user]: {
          messages:[...prevState[user]? prevState[user]['messages'] :[], message],
          notification: prevState[user]?  (isOpen ? 0 : prevState[user]['notification'] + 1) : 1,
        },
        totalNoti: isOpen ? prevState['totalNoti'] : prevState['totalNoti'] + 1,
    }));
  }

  const openPrivateChat = (usr) => {
    const user = usr.nickname;
    setPrivateMessages(prevState => ({
      ...prevState,
      [user]: {
        messages: prevState[user]? prevState[user]['messages'] : [],
        notification: 0,
      },
      totalNoti: prevState['totalNoti'] > 0 ? prevState['totalNoti'] - prevState[user]['notification'] : 0,
    }));
    setPrivateChat(usr);
  }

  // sending private messages and also append it in memory
  const sendPrivateMessage = ({e, to}) => {
    e.preventDefault();

    if(privateMessage) {
      const msg = {user: name, text: privateMessage, icon: icon};
      const user = to.nickname;

      setPrivateMessages(prevState => ({
        ...prevState,
        [user]: {
          messages: [...prevState[user]? prevState[user]['messages'] :[], msg],
          notification: 0,
        },
        ...prevState['totalNoti'],
      }));

      socket.emit('sendPrivateMessage', {soid: to.soid, message: privateMessage}, () => setPrivateMessage(''));
    }
  }

  /* helper function for converting {user1: {messages: [msg1, ...] , notification: 0}, ...} to {user1: notification, user2: notification, ... }*/
  const getNotificatioin = () => {
      const notification = {};
      Object.entries(privateMessages).map(key => key[0] !== 'totalNoti' ? notification[key[0]] = key[1].notification : null)
      return notification;
  }

  // friends funtionalities
  const [friends, setFriends] = useState([]);   // list of friends for the cur user
  const [requests, setRequests] = useState([]); // friend requests from others
  const [adds, setAdds] = useState([]);         // list of users cur user send friend request to

  const addFriend = (friend) => {
    //const token = localStorage.getItem('token') || null;
    const token = GetLocalStore('token');
    if(!token) return;

    setAdds(adds => [...adds, friend]);
    socket.emit('addFriend', { token: token, username: username, friend_id: friend.soid, friend: friend.nickname });
  }

  const acceptFriend = (friend) => {
    //const token = localStorage.getItem('token') || null;
    const token = GetLocalStore('token');
    if(!token) return;

    // decrement total notification by 1
    setPrivateMessages(prevState => ({
        ...prevState,
        totalNoti: prevState['totalNoti'] - 1,
    }));

    // move the accepted user from requests list to friends list
    const user = requests.find(req => req.nickname === friend.nickname);
    setFriends(friends => [...friends, user]);
    const reqs = requests.filter(req => req.nickname !== user.nickname)
    setRequests(reqs);
    socket.emit('acceptFriend', { token: token, username: username, friend_id:  user.soid, friend: user.nickname });
  }

  // check if the given user is a friend with the current user
  const friended = (user) => {
    return friends.find(friend => friend && friend.nickname === user.nickname);
  }

  // check if the current user has sent a request to the given user
  const added = (user) => {
    return adds.find(req => req && req.nickname === user.nickname);
  }

  const getFriendsStatus = () => {
    return { Friends: friends, Requests: requests };
  }


  // return a private chat window.
  const privateWindow = () => {
    return (
      <Draggable
        bounds={{left: 0, right: width - 100, top: 400-height, bottom: 300}}
        defaultPosition={{x: 0, y: 300}}
        position={null}
        grid={[25, 25]}
        scale={1}
      >
        <div className="outerPrivate">
          <div className="innerPrivate">
            <InfoBar room={privateChat.nickname} close={setPrivateChat}/>
            <Messages
              messages={privateMessages[privateChat.nickname] ? privateMessages[privateChat.nickname]['messages'] : []}
              name={name}
              icon={icon}
            />
            <Input
              message={privateMessage}
              setMessage={setPrivateMessage}
              sendMessage={sendPrivateMessage}
              to={privateChat}
            />
          </div>
        </div>
      </Draggable>
    );
  }

  return (
    <React.Fragment>
      <Navbar>
        <NavItem icon={GetIcon(icon)}>
          <FriendsList
            room={room}
            name={name}
            items={getFriendsStatus()}
            totalNoti={privateMessages['totalNoti']}
            notification={getNotificatioin()}
            openPrivateChat={openPrivateChat}
            chatting={privateChat}
            accept={acceptFriend}
          />
        </NavItem>
        <span className="username">{name}</span>
        <NotificationBadge
          count={privateMessages['totalNoti']}
          duration={1000}
          effect={Effect.SCALE}
          style={{position:'relative', float: 'right', top: '10px', left: '50px', zIndex: 1}}
        />
        <NavItem icon={<BellIcon />} />
        <NavItem icon={<CaretIcon />}>
          <DropdownMenu
            room={room}
            name={name}
            users={people}
            friended={friended}
            added={added}
            add={addFriend}
          />
        </NavItem>
      </Navbar>
      { privateChat && privateWindow() }
    </React.Fragment>
  );
}

export default DashBar;
