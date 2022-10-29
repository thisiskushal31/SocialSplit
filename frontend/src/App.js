import React, { useState, useEffect }  from 'react';
import { BrowserRouter as Router, Route, Navigate } from 'react-router-dom';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
import axios from 'axios';
import io from 'socket.io-client';
import queryString from 'query-string';

import { SetLocalStore, GetLocalStore } from './components/Helpers/LocalStorage';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import DashBar from './components/DashBar/DashBar';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import {
  unmatchedMsg,
  unmatchedPwd,
  emptyField,
  invalidField,
  invalidRoomName,
  success
} from './components/Notifications/Notifications';

const ENDPOINT = 'http://localhost:5000';
const getRand = () => Math.floor(Math.random() * 11 + 1);
let icon = getRand();

const _2hrs = 2 * 60 * 60 * 1000; // 2 hours in ms

export default function App() {
  const [user, setUser] = useState({
    username: GetLocalStore('username'),
    nickname: GetLocalStore('nickname')
  });
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState('');
  const [sock, setSock] = useState(null);
  const [room, setRoom] = useState(GetLocalStore('room'));

  useEffect(() => {
    if(user && user.username) {
      let socket = io(ENDPOINT);
      socket.on('connect', () => {
        socket.emit('addUser', {nickname: user.nickname, soid: socket.id, icon: icon}, () => setSock(socket));
      })
    }
  }, [])

  const handleSignup = e => {
    if(username === '' || password === '' || nickname === '' || confirmed === '') {
      e.preventDefault();
      store.addNotification(emptyField);
      return;
    }

    if(password !== confirmed) {
      e.preventDefault();
      store.addNotification(unmatchedPwd);
      return;
    }

    if(username.length < 6 || password.length < 6 || nickname.length < 3 || nickname.length > 15) {
      e.preventDefault();
      const err = 'uesrname/password minimum length is 6, nickname minimum and maximum length is 3 and 15, respectively'
      store.addNotification(invalidField(err));
      return;
    }

    const newUser = {
      username: username,
      password: password,
      nickname: nickname
    };

    axios.post(`${ENDPOINT}/signup`, newUser)
      .then(res => {
        let user = res.data.user;
        setUser(user);
        store.addNotification(success);
        let socket = io(ENDPOINT);
        socket.on('connect', () => {
          socket.emit('addUser', {nickname: user.nickname, soid: socket.id, icon: icon}, () => setSock(socket));
        })
        reset();

        SetLocalStore('token', res.data.token, _2hrs);
        SetLocalStore('username', res.data.user.username, _2hrs);
        SetLocalStore('nickname', res.data.user.nickname, _2hrs);
      })
      .catch(err => {
        store.addNotification(invalidField(err.response.data));
      });
  }

  const handleLogin = e => {
    e.preventDefault();
    const user = {
      username: username,
      password: password
    };

    axios.post(`${ENDPOINT}/login`, user)
      .then(res => {
        let newUser = res.data.user;
        setUser(newUser);
        reset();

        // initialize connection with the server
        let socket = io(ENDPOINT);
        socket.on('connect', () => {
          socket.emit('addUser', {nickname: newUser.nickname, soid: socket.id, icon: icon}, () => setSock(socket));
        })

        SetLocalStore('token', res.data.token, _2hrs);
        SetLocalStore('username', res.data.user.username, _2hrs);
        SetLocalStore('nickname', res.data.user.nickname, _2hrs);
      })
      .catch(err => {
        console.log(err);
        store.addNotification(unmatchedMsg);
      });
  }

  const handleLogout = () => {
    sock.disconnect();
    setSock(null);
    setUser(null);
    setRoom(null)
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('nickname');
    sessionStorage.removeItem('token');
  }

  const handleJoin = (e, room) => {
    if(!room || room === '') {
      e.preventDefault();
      store.addNotification(invalidRoomName);
      return;
    }

    setRoom(room);
    SetLocalStore('room', room, _2hrs);
  }

  const handleLeave = () => {
    setRoom(null);
    sessionStorage.removeItem('room');
    let socket = sock;
    socket && socket.emit('leave', () => setSock(socket));
  }

  const reset = () => {
    setUsername('');
    setPassword('');
    setNickname('');
  }

  //localStorage.getItem('token')
  return (
    <React.Fragment>
      { user && user.username && sock && GetLocalStore('token') ?
        <DashBar nickname={user.nickname} username={user.username} cur_room={room} icon={icon} socket={sock}/> : null
      }
      <ReactNotification />
      <Router>
        <Route
          exact path="/chat"
          socket={sock}
          render={ props => {
              const { name, room } = queryString.parse(props.location.search);
              return name === undefined || room === undefined ?
                <Navigate to={'/'}/> :
                <Chat
                  {...props}
                  socket={sock}
                  nickname={name}
                  room={room}
                  icon={icon}
                  handleLeave={handleLeave}
                />
            }}
        />
        <Route
          exact path="/signup"
          render={props =>
            <Signup
              handleSignup={handleSignup}
              handleNicknameChange={setNickname}
              handleNameChange={setUsername}
              handlePwdChange={setPassword}
              handleConfirmedChange={setConfirmed}
              reset={reset}
            />
          }
        />
        <ProtectedRoute
          exact path='/'
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          handleJoin={handleJoin}
          handleNameChange={setUsername}
          handlePwdChange={setPassword}
          before={Login}
          after={Join}
        />
      </Router>
    </React.Fragment>
  );
}
