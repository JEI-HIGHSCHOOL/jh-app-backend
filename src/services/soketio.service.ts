import { busCache } from "@/utils/cache";
import { Server, Socket } from "socket.io";

const SocketioService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("getBusLocation", () => {
      if (!busCache.has("namgu") && !busCache.has("seogu")) {
        socket.emit("getBusLocation", {
          isBus: "none"
        })
      } else {
        socket.emit("getBusLocation", {
          isBus: "yes",
          namgu: busCache.get("namgu"),
          seogu: busCache.get("seogu"),
        });
      }
    });
  });
};

export default SocketioService;
