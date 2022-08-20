class User {
  constructor (socket, io, userList) {
    this.socket = socket
    this.io = io
    this.userList = userList
  }

  join (room) {
    this.socket.on('user-join', ({ username }) => {
      this.userList.push({
        id: this.socket.id,
        username: username,
      });
  
      this.socket.join(room);
      console.log('Total users: ' + this.userList.length);
  
      this.io.in(room).emit('friend-join', this.userList);
    });
  }
}

module.exports = User
