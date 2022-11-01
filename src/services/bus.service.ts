import userModel from "@models/users.model";
import musicModel from "@/models/music.model";
import { RequestWithUser } from "@/interfaces/auth.interface";

class BusService {
  public users = userModel;
  public musics = musicModel;

  public async locationUpdate(req: RequestWithUser): Promise<any> {
    req.io.emit("updateBusLocation", {
        location: req.body.location,
        bus: req.body.bus,
    });
    return true;
  }
}

export default BusService;
