import { busCache } from "@/utils/cache";
import { Server, Socket } from "socket.io";

const SocketioService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("getBusLocation", (data: any) => {
      socket.emit("getBusLocation", {
        namgu: busCache.get("namgu"),
        seogu: busCache.get("seogu"),
      });
    });
  });
};

export default SocketioService;
