import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { GetIcon } from '../Helpers/GetPic';

import './FriendList.css';
import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg';
import { ReactComponent as FriendsIcon } from '../../icons/friends.svg';
import { ReactComponent as AcceptIcon } from '../../icons/accept.svg';
import { ReactComponent as RequestsIcon } from '../../icons/request.svg';
import { ReactComponent as WaitIcon } from '../../icons/wait.svg';


function FriendsList(props) {

  const [activeMenu, setActiveMenu] = useState('main');
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
   setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
 }, [])

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  /* display dropdown item in the dropdown menu */
  function DropdownItem(props) {
    return (
      <a href="#" className="menu-item"
        onClick={props.goToMenu ? () => setActiveMenu(props.goToMenu) : (props.friendList ? props.action : null)}>
        <span className="icon-button">{props.leftIcon}</span>
        <span>
          {props.children}
        </span>
        {props.notification ? <span className="notification">{props.notification}</span> : ''}
        {props.rightIcon ? <span className="icon-button icon-right square" onClick={props.action}>{props.rightIcon}</span> : null}
      </a>
    );
  }

  return (
    <div className="dropdown drop-right" style={{ height: menuHeight}} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        unmountOnExit
        classNames="menu-primary"
        onEnter={calcHeight}>
        <div className="menu">
          {
            Object.keys(props.items).map((item, i) => {
              return item ?
              <DropdownItem
                key={i}
                leftIcon={item === 'Requests' ? <RequestsIcon/>: <FriendsIcon />}
                notification={item === 'Requests' ? props.items['Requests'].length : props.totalNoti - props.items['Requests'].length}
                goToMenu={item}>
                <b>{item}</b>
              </DropdownItem> : null
            })
          }
        </div>
      </CSSTransition>

      {
        Object.keys(props.items).map((item, i) => {
          return item ?
          <CSSTransition
            key={i}
            in={activeMenu === item}
            timeout={500}
            classNames="menu-secondary"
            unmountOnExit
            onEnter={calcHeight}>
            <div className="menu">
              <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
                <h2>{item}</h2>
              </DropdownItem>
              {
                props.items[item].map((user, i) => {
                  return user ?
                  <DropdownItem
                    key={i}
                    leftIcon={GetIcon(user.icon)}
                    rightIcon={
                      item === 'Requests' ? <AcceptIcon/> :
                      (props.chatting && props.chatting.nickname === user.nickname ? <WaitIcon/> : null)
                    }
                    notification={props.notification[user.nickname]}
                    friendList={item === 'Friends' ? true : false}
                    action={item === 'Friends' ? () => props.openPrivateChat(user) : () => props.accept(user)}>
                    <b>{user.nickname}</b>
                  </DropdownItem> : null
                })
              }
            </div>
          </CSSTransition> : null
        })
      }
    </div>
  );
}

export { FriendsList };
