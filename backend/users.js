/*
  map user nicknames to their socket ids,
  socket ids are reassigned to users each time they connect to the socket io manager.
*/
const users = [];

const addUser = ({nickname, soid, icon}) => {
  let user = getUserByName(nickname);
  if(user) {
    user.soid = soid;
    user.icon = icon;
  }
  else {
    const user = {nickname: nickname, soid: soid, icon: icon, room: null};
    users.push(user);
  }

  return true;
}

const removeUser = (soid) => {
  const index = users.findIndex(user => user.soid === soid);

  if(index !== -1) return users.splice(index, 1)[0];
  return false;
}

const enterRoom = (nickname, room) => {
  let user = getUserByName(nickname);
  user.room = room;
  return user;
}

const leaveRoom = (soid) => {
  let user = users.find(user => user.soid === soid);
  user.room = null;
  return user;
}

const getUserByName = (nickname) => {
  return users.find(user => user.nickname === nickname);
}

const getUserById = (soid) => {
  return users.find(user => user.soid === soid);
}

const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
}

const getAll = () => {
  return users;
}

module.exports = { addUser, removeUser, getUserByName, getUserById, enterRoom, leaveRoom, getUsersInRoom, getAll };
