const users = [];

//addUser

const addUser = ({ id, username, room }) => {
  // username = username.trim().toLowerCase()
  // room = room.trim().toLowerCase()

  //validate Data
  if (!username || !room) {
    return {
      error: "Username and Room are required",
    };
  }

  //Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //Validate username
  if (existingUser) {
    return {
      error: "Username already taken!",
    };
  }

  //Store User
  const user = { id, username, room };
  users.push(user);
  return {
    user,
  };
};

//removeUser
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

//getUser
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

//getUsersInRoom
const getUsersInRoom = (room) => {
  // room = room.trim().toLowerCase()
  return users.filter((user) => user.room === room);
};

console.log(users);

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
};
