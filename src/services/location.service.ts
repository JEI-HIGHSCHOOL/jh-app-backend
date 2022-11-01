import userModel from "@models/users.model";
import musicModel from "@/models/music.model";
import { RequestWithUser } from "@/interfaces/auth.interface";

class LocationService {
  public users = userModel;
  public musics = musicModel;

  public async locationUpdate(req: RequestWithUser): Promise<any> {
    req.io.emit("updateLocation", {
        location: req.body.location,
        car: req.body.carId,
    });
    return true;
  }
}

export default LocationService;
