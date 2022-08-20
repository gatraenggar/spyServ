class Connection {
  constructor (socket, io, userList) {
    this.socket = socket
    this.io = io
    this.userList = userList
  }

  disconnect(room) {
    this.socket.on('disconnect', () => {
      const i = this.userList.findIndex((user) => user.id === this.socket.id);

      if (i !== -1) {
        let username = this.userList[i].username;
        this.userList.splice(i, 1);

        this.socket.to(room).emit('friend-leave', {
          userList: this.userList,
          message: username + ' left the game',
        });
      }
    });
  }
}

module.exports = Connection;
