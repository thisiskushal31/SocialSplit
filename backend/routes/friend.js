const express = require('express');
const friend = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getUserByName } = require('../users');
const Friend = require('../models/friend.model');
const secret = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

function isAuthenticated(req, res, next) {
  let cookie = req.cookies.jwt ? req.cookies.jwt : req.headers.cookie;
  let username = req.body.username;
  try {
    if(cookie == null) {
      return res.status(401).send("You Must Log In First.");
    }

    let decoded = jwt.verify(cookie, secret);
    if(decoded.usr != username) {
      return res.status(401).send("You Don't Have Access To This Resource.");
    }
    else
      return next();
  }
  catch (err) {
    return res.status(401).send("Your Token Is Expired.");
  }
}

// get all the friends for the current user
friend.post('/:username', isAuthenticated, (req, res) => {
  const filter = { username: req.params.username };
  Friend.findOne(filter)
    .then(data => {
      if(!data) {
        const result = {
          friends: [],
          requests: [],
          adds: []
        };

        return res.status(200).json(result);
      }

      let friends = data.friends.map(friend => getUserByName(friend));
      let requests = data.requests.map(req => getUserByName(req));
      let adds = data.adds.map(add => getUserByName(add));
      const result = {
          friends: friends,
          requests: requests,
          adds: adds,
      };

      res.status(200).json(result);
    })
    .catch(err => res.status(400).json('Error ' + err));
});

/* handle friends request */
friend.post('/request/:username', isAuthenticated, (req, res) => {
  const sender = req.body.nickname;
  const receiver = req.params.username;

  // update the request list for the receiver
  const filter_receiver = { username: receiver };
  const update_receiver = { "$push": { "requests": sender } };
  Friend.findOneAndUpdate(filter_receiver, update_receiver, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  })
  .then(data => { return })
  .catch(err => { return res.status(400).json('Error ' + err)});

  // update the adds list for sender
  const filter_sender = { username: sender };
  const update_sender = { "$push": { "adds": receiver } };
  Friend.findOneAndUpdate(filter_sender, update_sender, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  })
  .then(data => res.send('Send friend request successfully.'))
  .catch(err => res.status(400).json('Error ' + err));
});

/* handle friends accept */
friend.post('/accept/:username', isAuthenticated, (req, res) => {
  const sender = req.body.nickname;
  const receiver = req.params.username;

  // update the adds and friends list for the receiver
  const filter_receiver = { username: receiver };
  const update_receiver = { "$pull": { "adds": sender }, "$push": { "friends": sender } };
  Friend.findOneAndUpdate(filter_receiver, update_receiver)
  .then(data => { return })
  .catch(err => { return res.status(400).json('Error ' + err)});

  // update the requests and friends list for the sender
  const filter_sender = { username: sender };
  const update_sender = { "$pull": { "requests": receiver }, "$push": { "friends": receiver } };
  Friend.findOneAndUpdate(filter_sender, update_sender)
  .then(data => res.send('friend accepted successfully.'))
  .catch(err => res.status(400).json('Error ' + err));
})

module.exports = friend;
