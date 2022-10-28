const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

const User = require('../models/user.model');

login.post('/', function(req, res) {
  const password = req.body.password;
  const username = req.body.username;

  // username and password must be provided
  if (username == "" || password == "" || !username || !password) {
    return res.status(401).send("invalid input");
  }

  const filter = {"username": username};
  User.findOne(filter, (err, user) => {
    if(err){
      return res.status(500).send('Internal Server Error - Failed to Retrieve user info');
    }

    // user not found
    if(!user) {
      return res.status(401).json();
    }

    // compare the provided pwd with the hash pwd in our db
    bcrypt.compare(password, user.password, (err, result) => {
      // unmatched
      if(!result) {
        return res.status(401).json();
      }

      // matched
      else {
        // generate transient session cookie with jwt
        const _2hrs = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
        let payload = {"usr": username, "exp": _2hrs};
        let token = jwt.sign(payload, secret, {algorithm: 'HS256'});

        // no exp option specified => session cookie
        res.cookie('jwt', token);
        const data = {
          token: token,
          user: {
            username: username,
            nickname: user.nickname
          }
        };
        res.status(200).json(data);
      }
    });
  });
});

module.exports = login;
