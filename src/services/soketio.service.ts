import { busCache } from "@/utils/cache";
import { Server, Socket } from "socket.io";

const SocketioService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("getBusLocation", () => {
      if (busCache.keys().length === 0) {
        socket.emit("getBusLocation", {
          isBus: "none",
        });
      } else {
        socket.emit("getBusLocation", {
          isBus: "yes",
          busses: busCache.keys().map((bus) => {
            return {
              bus,
              location: busCache.get(bus),
            };
          }),
        });
      }
    });
  });
};

export default SocketioService;
