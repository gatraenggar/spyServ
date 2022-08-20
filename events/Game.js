class Game {
  constructor (socket, io, userList, places) {
    this.socket = socket
    this.io = io
    this.userList = userList
    this.places = places
  }

  start(room) {
    this.socket.on("game-start", ({ duration: minutes }) => {
      let placeIndex, spy, spyIndex

      // return random int between 0 to (length-1)
      placeIndex = Math.floor(Math.random() * this.places.length);
      spyIndex = Math.floor(Math.random() * this.userList.length);
  
      spy = this.userList[spyIndex].username
      const roles = this.places[placeIndex].roles
  
      this.userList.forEach((user, i) => {
        this.userList[i] = {
          id: user.id,
          username: user.username,
          role: user.username === spy ? "Spy" : roles[Math.floor(Math.random() * roles.length)],
          place: user.username === spy ? "?" : this.places[placeIndex].name
        }
      })

      const endTime = new Date(
        new Date().getTime() 
        + ( (minutes * 60000) + 3000)
      ).getTime()
  
      this.io.in(room).emit('role-assign', { userList: this.userList, endTime });
    })
  }

  vote(room) {
    this.socket.on("game-vote", ({ votedUname, unvotedUname }) => {
      this.io.in(room).emit('game-update-votes', { votedUname, unvotedUname });
    })
  }
}

module.exports = Game
