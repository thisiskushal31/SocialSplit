import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './Signup.module.css';

const Signup = ({ handleSignup, handleNameChange, handleNicknameChange, handlePwdChange, handleConfirmedChange, reset }) => {
  return (
    <div className={styles.joinOuterContainer}>
      <div className={styles.joinInnerContainer}>
        <h1 className={styles.heading}>Sign Up</h1>
        <div>
          <input
          placeholder="Username"
          className={styles.joinInput}
          type="text"
          onChange={(e) => handleNameChange(e.target.value)} />
        </div>
        <div>
          <input
            placeholder="Nickname"
            className={cx(styles.joinInput, styles.mt20)}
            type="text"
            onChange={(e) => handleNicknameChange(e.target.value)} />
        </div>
        <div>
          <input
            placeholder="Password"
            className={cx(styles.joinInput, styles.mt20)}
            type="password"
            onChange={(e) => handlePwdChange(e.target.value)} />
        </div>
        <div>
          <input
            placeholder="Confirmed Password"
            className={cx(styles.joinInput, styles.mt20)}
            type="password"
            onChange={(e) => handleConfirmedChange(e.target.value)} />
        </div>
        <Link to='/'>
          <button className={cx(styles.button, styles.mt20but)} type="submit" onClick={(e) => handleSignup(e)}>Sign Up</button>
        </Link>
        <Link to='/'>
          <button className={cx(styles.button, styles.mt10)} type="submit" onClick={reset}>Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default Signup;
