import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import cx from 'classnames';
import styles from './Join.module.css';

const Join = ({ nickname, handleLogout, handleJoin }) => {
  const [room, setRoom] = useState(null);

  return (
      <React.Fragment>
        <div className={styles.joinOuterContainer}>
          <div className={styles.joinInnerContainer}>
            <h1 className={styles.heading}>Join</h1>
              <div><input placeholder="Room" className={cx(styles.joinInput, styles.mt20)} type="text" onChange={(e) => setRoom(e.target.value)} /></div>
              <Link to={`/chat?name=${nickname}&room=${room}`}>
                <button className={cx(styles.button, styles.mt20)} type="submit" onClick={(e) => handleJoin(e,room)}>Enter</button>
              </Link>
              <Link to={'/'}>
                <button className={cx(styles.button, styles.mt10)} type="submit" onClick={handleLogout}>Leave</button>
              </Link>
          </div>
        </div>
      </React.Fragment>
  );
};

export default Join;
