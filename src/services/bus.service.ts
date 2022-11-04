import userModel from "@models/users.model";
import musicModel from "@/models/music.model";
import { RequestWithUser } from "@/interfaces/auth.interface";
import { busCache } from "@/utils/cache";

class BusService {
  public users = userModel;
  public musics = musicModel;

  public async locationUpdate(req: RequestWithUser): Promise<any> {
    busCache.set(req.body.bus, req.body.location)
    req.io.emit("updateBusLocation", {
        location: req.body.location,
        bus: req.body.bus,
    });
    return true;
  }

  public async startRunBus(req: RequestWithUser): Promise<any> {
    busCache.set(req.body.bus, req.body.location)
    req.io.emit("updateBusLocation", {
        location: req.body.location,
        bus: req.body.bus,
    });
    return true;
  }

  public async stopRunBus(req: RequestWithUser): Promise<any> {
    busCache.del(req.body.bus)
    req.io.emit("stopBus", {
        bus: req.body.bus,
    });
    return true;
  }
}

export default BusService;
