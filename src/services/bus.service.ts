import userModel from "@models/users.model";
import musicModel from "@/models/music.model";
import {
  RequestWithStudentUser,
  RequestWithUser,
} from "@/interfaces/auth.interface";
import { busCache } from "@/utils/cache";
import studentBordingModel from "@/models/studentBusBoarding.model";
import { HttpException } from "@/exceptions/HttpException";

class BusService {
  public users = userModel;
  public boardings = studentBordingModel;
  public musics = musicModel;

  public async locationUpdate(req: RequestWithUser): Promise<any> {
    busCache.set(req.body.bus, req.body.location);
    req.io.emit("updateBusLocation", {
      location: req.body.location,
      bus: req.body.bus,
    });
    return true;
  }

  public async startRunBus(req: RequestWithUser): Promise<any> {
    busCache.set(req.body.bus, req.body.location);
    req.io.emit("updateBusLocation", {
      location: req.body.location,
      bus: req.body.bus,
    });
    return true;
  }

  public async stopRunBus(req: RequestWithUser): Promise<any> {
    busCache.del(req.body.bus);
    req.io.emit("stopBus", {
      bus: req.body.bus,
    });
    return true;
  }

  public async addBoradingRecord(req: RequestWithStudentUser): Promise<any> {
    const boarding = await this.boardings.findOne({
      userId: req.user._id,
      bordingTime: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    });
    if (boarding) throw new HttpException(400, "이미 탑승이 완료되었습니다.");

    await this.boardings.create({
      userId: req.user._id,
      busId: req.body.busId,
      bordingTime: new Date(),
    });
    return true;
  }
}

export default BusService;
