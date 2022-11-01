import { Server } from "socket.io";

class SokeioService {
  io: Server;
  constructor(io: Server) {
    this.io = io;
    this.locationUpdate()
  }

  public async locationUpdate() {
    this.io.on("connection", (socket) => {
        socket.emit("connected", "connected");
    })
  }
}

export default SokeioService;
