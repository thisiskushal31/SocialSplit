import React, { useState, useEffect, useRef } from 'react';

import { CSSTransition } from 'react-transition-group';
import './Navbar.css';


import { ReactComponent as ArrowIcon } from '../../icons/arrow.svg';
import { ReactComponent as ChatIcon } from '../../icons/chat.svg';
import { ReactComponent as AddIcon } from '../../icons/add.svg';

import { GetIcon } from '../Helpers/GetPic';

/* nav bar content <nav> */
function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">{ props.children }</ul>
    </nav>
  );
}

/* each nav bar item in the content */
function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="nav-item">
      <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
        {props.icon}
      </a>

      {open && props.children}
    </li>
  );
}

/* display dropdown menu for each icon */
function DropdownMenu(props) {

  const [activeMenu, setActiveMenu] = useState('main'); //settings, animals
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
        onClick={props.goToMenu ? () => setActiveMenu(props.goToMenu) : null}>
        <span className="icon-button">{props.leftIcon}</span>
        <span>
          {props.children}
        </span>
        {/*props.notification ? <span className="notification" >{props.notification}</span> : ''*/}
        {props.rightIcon ? <span className="icon-button icon-right" onClick={props.add}>{props.rightIcon}</span> : null}
      </a>
    );
  }

  // activeMenu equals to 'main', add menu-primary-enter class to the div.
  // after 500ms, it then adds menu-primary-enter-active class.
  // if the props 'in' is false, then it adds menu-primary-exit to div.
  // then after 500ms. it then adds menu-primary-exit-active.
  return (
    <div className="dropdown" style={{ height: menuHeight}} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === 'main'}
        timeout={500}
        unmountOnExit
        classNames="menu-primary"
        onEnter={calcHeight}
      >
        <div className="menu">
          <DropdownItem
            leftIcon={<ChatIcon />}
            goToMenu='people'>
            {props.room ? <span className="room-name">Room: <b>{props.room}</b></span> : <b>Hall</b>}
          </DropdownItem>
        </div>
      </CSSTransition>


      <CSSTransition
        in={activeMenu === 'people'}
        timeout={500}
        classNames="menu-secondary"
        unmountOnExit
        onEnter={calcHeight}>
        <div className="menu">
          <DropdownItem goToMenu="main" leftIcon={<ArrowIcon />}>
            <h2>People</h2>
          </DropdownItem>
          {
            props.users.map((user, i) => {
              return user.nickname !== props.name ?
              <DropdownItem
                key={i}
                leftIcon={GetIcon(user.icon)}
                rightIcon={props.friended(user) ? <span>Friend</span> : (props.added(user) ? <span>Sent</span>: <AddIcon/>)}
                add={props.added(user) ? null : () => props.add(user)}
              >
                <b>{user.nickname}</b>
              </DropdownItem> : null
            })
          }
        </div>
      </CSSTransition>
    </div>
  );
}

export { Navbar, NavItem, DropdownMenu };
