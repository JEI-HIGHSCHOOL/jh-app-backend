import { NoticeAddDto, NoticeDto, PushDto } from "@/dtos/push.dto";
import { RequestWithUser } from "@/interfaces/auth.interface";
import deviceModel from "@/models/devices.model";
import noticeModel from "@/models/notice";
import userModel from "@/models/users.model";
import { noticeCache } from "@/utils/cache";
import { pushAlarm } from "@/utils/pushAlarm";
import { Request } from "express";

class DeviceService {
  public device = deviceModel;

  public async checkDevice(req: Request): Promise<any> {
    const { deviceId, token } = req.body as PushDto;
    const device = await this.device.findOne({ deviceId });
    if (!device) {
      const deviceDB = new this.device({
        deviceId,
        pushToken: token,
        pushPermission: true,
      });
      await deviceDB.save();
    } else {
      await device.updateOne({ pushToken: token });
    }
    return null;
  }

  public async addNotice(req: Request): Promise<any> {
    const { title, description, url } = req.body as NoticeDto;
    await pushAlarm(title, description);
    return null;
  }

  public async publishNotice(req: RequestWithUser): Promise<any> {
    const { title, description } = req.body as NoticeAddDto;
    const noticeDB = new noticeModel({
      title,
      content: description,
      publisher: req.user._id
    })
    await noticeDB.save()
    await pushAlarm('새로운 알림이 도착하였습니다', title);
    noticeCache.flushAll()
    return null;
  }

  public async getNotice(): Promise<any> {
    const noticeCaches = noticeCache.has("notice");
    if (!noticeCaches) {
      const noticesDB = await noticeModel.find({},  null, {sort: {published_date: -1}}).limit(20);
      const notices = [];
      for await (const notice of noticesDB) {
        const publisher = await userModel.findOne(
          { _id: notice.publisher },
          { name: 1, id: 1 }
        );
        notices.push({
          ...notice.toJSON(),
          publisher: publisher
            ? publisher
            : {
                id: notice.publisher,
                name: "알 수 없음",
              },
        });
      }
      noticeCache.set("notice", notices)
      return notices
    } else {
      return noticeCache.get("notice")
    }
  }
}

export default DeviceService;
